/**
 * Reverse-engineered Office.js command implementations (the "backend" bridge).
 *
 * These are the actual functions that talk to the Excel/Word/PowerPoint
 * object model via the Office.js API. They are the `commands.*` methods
 * called by the tool implementations in tool-implementations.ts.
 *
 * Architecture:
 *
 *   Claude API  →  Tool Implementations (STe)  →  Command Implementations (Tbe)  →  Office.js
 *                  (tool-implementations.ts)        (this file)                       (Excel OM)
 *
 * The command map (Tbe) contains raw async functions that receive:
 *   (params, context: Excel.RequestContext) => Promise<result>
 *
 * These are wrapped by `createCommandBridge` (Zbe) which:
 *   1. Picks the right host runner (Excel.run / Word.run / PowerPoint.run)
 *   2. Wraps each call in `safeOfficeRun` (pa) for timeout protection
 *   3. Catches OfficeExtension.Error and reformats with debug info
 *
 * Minified symbol mapping:
 *   Tbe  = sheetCommands (this file's main object)
 *   Zbe  = createCommandBridge
 *   Wbe  = initializeCommands
 *   qbe  = { sheet: Tbe, doc: ebe, slide: Gbe }
 *   ii   = getWorksheetById
 *   zN   = getSheetMetadata
 *   Ex   = resolveSourceRange
 *   lC   = parseAddress
 *   BN   = configurePivotFields
 *   $N   = findPivotTable
 *   HN   = findChart
 *   Dbe  = serializePivotTable
 *   Ube  = serializeChart
 *   Rbe  = applyCellStyles
 *   Obe  = applyBorderStyles
 *   Ibe  = applyBorderProps
 *   kbe  = extractDisplayedStyles
 *   pa   = safeOfficeRun
 *   li   = columnToLetter
 *   Jf   = letterToColumn
 */

// ============================================================================
// TYPES
// ============================================================================

interface SheetMetadata {
  id: number;
  name: string;
  maxRows: number;
  maxColumns: number;
  frozenRows: number;
  frozenColumns: number;
}

interface CellData {
  a1: string;
  value?: any;
  formula?: string;
  note?: string;
  cellStyles?: CellStyles;
  borderStyles?: Record<string, BorderDef>;
}

interface CellStyles {
  fontColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  fontLine?: string;
  backgroundColor?: string;
  horizontalAlignment?: string;
  numberFormat?: string;
}

interface BorderDef {
  style?: string;
  weight?: string;
  color?: string;
}

interface ParsedAddress {
  workbookName: string | null;
  sheetName: string | null;
  range: string;
}

// ============================================================================
// HELPER: Column ↔ Letter conversion
// ============================================================================

/** Convert 1-based column number to letter (1→A, 27→AA) */
function columnToLetter(col: number): string {
  let result = "";
  while (col > 0) {
    col--;
    result = String.fromCharCode(65 + (col % 26)) + result;
    col = Math.floor(col / 26);
  }
  return result;
}

/** Convert column letter to 1-based number (A→1, AA→27) */
function letterToColumn(letter: string): number | null {
  const upper = letter.toUpperCase();
  let col = 0;
  for (let i = 0; i < upper.length; i++) {
    const code = upper.charCodeAt(i) - 64;
    if (code < 1 || code > 26) return null;
    col = col * 26 + code;
  }
  return col || null;
}

// ============================================================================
// HELPER: Address parser (lC in minified)
// ============================================================================

/**
 * Parse a full Excel address like "'Sheet1'!A1:B10" or "[Book1.xlsx]Sheet1!A1"
 * into its components.
 */
function parseAddress(address: string): ParsedAddress {
  let remaining = address;
  let workbookName: string | null = null;

  // Extract [workbookName] prefix
  const wbMatch = remaining.match(/^\[([^\]]+)\]/);
  if (wbMatch) {
    workbookName = wbMatch[1];
    remaining = remaining.substring(wbMatch[0].length);
  }

  // No sheet separator → just a range
  if (!remaining.includes("!")) {
    return { workbookName, sheetName: null, range: remaining };
  }

  const bangIdx = remaining.lastIndexOf("!");
  const sheetPart = remaining.substring(0, bangIdx);
  const rangePart = remaining.substring(bangIdx + 1);

  let sheetName = sheetPart;

  // Handle quoted sheet names: 'Sheet Name' or '[Book.xlsx]SheetName'
  if (sheetName.startsWith("'") && sheetName.endsWith("'")) {
    sheetName = sheetName.slice(1, -1);
    // Check for embedded workbook reference
    const embeddedWb = sheetName.match(/\[([^\]]+\.(xlsx?|xlsm|xlsb))\]([^[\]]+)$/i);
    if (embeddedWb) {
      workbookName = embeddedWb[1];
      sheetName = embeddedWb[3];
    }
    sheetName = sheetName.replace(/''/g, "'");
  }

  return { workbookName, sheetName, range: rangePart };
}

// ============================================================================
// HELPER: Get worksheet by ID or name (ii in minified)
// ============================================================================

/**
 * Find a worksheet by its tabId (number) or name (string).
 * Throws NotFoundError if not found.
 */
async function getWorksheetById(
  context: Excel.RequestContext,
  identifier: number | string
): Promise<Excel.Worksheet> {
  const worksheets = context.workbook.worksheets;
  worksheets.load("items");
  await context.sync();

  const key = typeof identifier === "number" ? "tabId" : "name";
  const sheet = worksheets.items.find((ws: any) => ws[key] === identifier);

  if (!sheet) {
    throw new Error(`NotFoundError: Worksheet with ${key} ${identifier} not found`);
  }

  return sheet;
}

// ============================================================================
// HELPER: Get sheet metadata (zN in minified)
// ============================================================================

/**
 * Load metadata for a worksheet: dimensions, frozen panes, etc.
 */
async function getSheetMetadata(
  sheet: Excel.Worksheet,
  context: Excel.RequestContext
): Promise<SheetMetadata> {
  sheet.load(["tabId", "name"]);

  const usedRange = sheet.getUsedRangeOrNullObject(true);
  usedRange.load(["rowCount", "columnCount", "isNullObject", "rowIndex", "columnIndex"]);

  const frozenRange = sheet.freezePanes.getLocationOrNullObject();
  await context.sync();

  let frozenRows = 0;
  let frozenColumns = 0;

  if (!frozenRange.isNullObject) {
    frozenRange.load(["rowCount", "columnCount"]);
    await context.sync();
    frozenRows = frozenRange.rowCount;
    frozenColumns = frozenRange.columnCount;
  }

  if (usedRange.isNullObject) {
    return {
      id: (sheet as any).tabId,
      name: sheet.name,
      maxRows: 0,
      maxColumns: 0,
      frozenRows,
      frozenColumns,
    };
  }

  return {
    id: (sheet as any).tabId,
    name: sheet.name,
    maxRows: usedRange.rowIndex + usedRange.rowCount,
    maxColumns: usedRange.columnIndex + usedRange.columnCount,
    frozenRows,
    frozenColumns,
  };
}

// ============================================================================
// HELPER: Resolve source range from address (Ex in minified)
// ============================================================================

/**
 * Resolve a "SheetName!A1:B10" address to an Excel.Range object.
 */
async function resolveSourceRange(
  context: Excel.RequestContext,
  address: string
): Promise<Excel.Range> {
  const { sheetName, range } = parseAddress(address);
  if (!sheetName) {
    throw new Error(
      "InvalidAddressError: sheetName is required in the address (e.g., 'Sheet1!A1:B2')"
    );
  }
  const sheet = await getWorksheetById(context, sheetName);
  return sheet.getRange(range);
}

// ============================================================================
// HELPER: Apply cell styles (Rbe in minified)
// ============================================================================

/**
 * Apply cell styles (font, fill, alignment, number format) to a range.
 */
function applyCellStyles(range: Excel.Range, styles: CellStyles): void {
  if (styles.fontColor) range.format.font.color = styles.fontColor;
  if (styles.fontSize) range.format.font.size = styles.fontSize;
  if (styles.fontFamily) range.format.font.name = styles.fontFamily;
  if (styles.fontWeight) range.format.font.bold = styles.fontWeight === "bold";
  if (styles.fontStyle) range.format.font.italic = styles.fontStyle === "italic";

  if (styles.fontLine) {
    const underlineStyles = Excel.RangeUnderlineStyle;
    range.format.font.underline =
      styles.fontLine === "underline" ? underlineStyles.single : underlineStyles.none;
    range.format.font.strikethrough = styles.fontLine === "line-through";
  }

  if (styles.backgroundColor) {
    range.format.fill.color = styles.backgroundColor;
  }

  if (styles.horizontalAlignment) {
    // Maps "left"→Excel.HorizontalAlignment.left, etc.
    (range.format as any).horizontalAlignment = styles.horizontalAlignment;
  }

  if (styles.numberFormat) {
    range.numberFormat = [[styles.numberFormat]];
  }
}

// ============================================================================
// HELPER: Apply border styles (Obe in minified)
// ============================================================================

/**
 * Apply border styles to a range's edges.
 */
function applyBorderStyles(range: Excel.Range, borders: Record<string, BorderDef>): void {
  const borderIndexMap: Record<string, Excel.BorderIndex> = {
    top: Excel.BorderIndex.edgeTop,
    bottom: Excel.BorderIndex.edgeBottom,
    left: Excel.BorderIndex.edgeLeft,
    right: Excel.BorderIndex.edgeRight,
  };

  for (const [side, def] of Object.entries(borders)) {
    if (!def) continue;
    const borderIndex = borderIndexMap[side];
    if (!borderIndex) continue;

    const border = range.format.borders.getItem(borderIndex);
    applyBorderProps(border, def.style, def.weight, def.color);
  }
}

/**
 * Set individual border properties (style, weight, color). (Ibe in minified)
 */
function applyBorderProps(
  border: Excel.RangeBorder,
  style?: string,
  weight?: string,
  color?: string
): void {
  if (style) {
    // Maps "solid"→Excel.BorderLineStyle.continuous, etc.
    const styleMap: Record<string, Excel.BorderLineStyle> = {
      solid: Excel.BorderLineStyle.continuous,
      dashed: Excel.BorderLineStyle.dash,
      dotted: Excel.BorderLineStyle.dot,
      double: Excel.BorderLineStyle.double,
    };
    if (styleMap[style]) border.style = styleMap[style];
  }

  if (weight) {
    const weightMap: Record<string, Excel.BorderWeight> = {
      thin: Excel.BorderWeight.thin,
      medium: Excel.BorderWeight.medium,
      thick: Excel.BorderWeight.thick,
    };
    if (weightMap[weight]) border.weight = weightMap[weight];
  }

  if (color) {
    border.color = color;
  }
}

// ============================================================================
// HELPER: Extract displayed cell styles (kbe in minified)
// ============================================================================

/**
 * Convert Excel.js CellPropertiesFormat to our simplified CellStyles/BorderStyles.
 */
function extractDisplayedStyles(
  format: any
): { cellStyles?: CellStyles; borderStyles?: Record<string, BorderDef> } {
  const cellStyles: CellStyles = {};

  if (format.font?.color) cellStyles.fontColor = format.font.color;
  if (format.font?.size) cellStyles.fontSize = format.font.size;
  if (format.font?.name) cellStyles.fontFamily = format.font.name;
  if (format.font?.bold) cellStyles.fontWeight = "bold";
  if (format.font?.italic) cellStyles.fontStyle = "italic";
  if (format.font?.strikethrough) {
    cellStyles.fontLine = "line-through";
  } else if (format.font?.underline !== Excel.RangeUnderlineStyle.none) {
    cellStyles.fontLine = "underline";
  }

  if (format.fill?.color) cellStyles.backgroundColor = format.fill.color;
  if (format.horizontalAlignment) cellStyles.horizontalAlignment = format.horizontalAlignment;

  // Borders
  const borderSides = { top: format.borders?.top, bottom: format.borders?.bottom, left: format.borders?.left, right: format.borders?.right };
  const borderStyles: Record<string, BorderDef> = {};
  let hasBorders = false;

  for (const [side, borderData] of Object.entries(borderSides)) {
    if (borderData && borderData.style && borderData.style !== "None") {
      borderStyles[side] = {
        style: borderData.style,
        weight: borderData.weight,
        color: borderData.color,
      };
      hasBorders = true;
    }
  }

  return {
    cellStyles: Object.keys(cellStyles).length > 0 ? cellStyles : undefined,
    borderStyles: hasBorders ? borderStyles : undefined,
  };
}

// ============================================================================
// HELPER: Pivot table serialization (Dbe in minified)
// ============================================================================

/**
 * Serialize a PivotTable object for get_all_objects output.
 */
async function serializePivotTable(
  context: Excel.RequestContext,
  pivot: Excel.PivotTable
): Promise<any> {
  pivot.load(["id", "name", "worksheet"]);
  pivot.rowHierarchies.load("items/fields/items/name");
  pivot.columnHierarchies.load("items/fields/items/name");
  pivot.dataHierarchies.load("items/field/name,items/summarizeBy");
  pivot.worksheet.load("tabId");

  const dataSourceStr = pivot.getDataSourceString();
  const layoutRange = pivot.layout.getRange();
  layoutRange.load("address");
  await context.sync();

  // Resolve the source address
  const source = await resolveDataSourceAddress(context, dataSourceStr.value);

  return {
    id: pivot.id,
    type: "pivotTable",
    name: pivot.name,
    sheetId: (pivot.worksheet as any).tabId,
    range: parseAddress(layoutRange.address).range,
    source,
    rows: pivot.rowHierarchies.items.flatMap((h: any) =>
      h.fields.items.map((f: any) => ({ field: f.name }))
    ),
    columns: pivot.columnHierarchies.items.flatMap((h: any) =>
      h.fields.items.map((f: any) => ({ field: f.name }))
    ),
    values: pivot.dataHierarchies.items.map((d: any) => ({
      field: d.field.name,
      summarizeBy: reverseSummarizeBy(d.summarizeBy),
    })),
  };
}

// ============================================================================
// HELPER: Chart serialization (Ube in minified)
// ============================================================================

/**
 * Serialize a Chart object for get_all_objects output.
 */
async function serializeChart(
  context: Excel.RequestContext,
  chart: Excel.Chart
): Promise<any> {
  chart.load(["id", "chartType", "top", "left", "worksheet"]);
  chart.worksheet.load("tabId");
  chart.title.load("text");
  chart.series.load("items");
  await context.sync();

  const seriesData: any[] = [];
  for (const series of chart.series.items) {
    series.load("name");
    const valuesSource = series.getDimensionDataSourceString("Values" as any);
    const categoriesSource = series.getDimensionDataSourceString("Categories" as any);
    await context.sync();
    seriesData.push({
      name: series.name,
      values: valuesSource.value,
      categories: categoriesSource.value,
    });
  }

  return {
    id: chart.id,
    type: "chart",
    sheetId: (chart.worksheet as any).tabId,
    chartType: reverseChartType(chart.chartType),
    title: chart.title.text,
    position: { top: chart.top, left: chart.left },
    readOnlySeries: seriesData,
  };
}

// ============================================================================
// HELPER: Configure pivot table fields (BN in minified)
// ============================================================================

/**
 * Add row, column, and value hierarchies to a pivot table.
 */
function configurePivotFields(pivot: Excel.PivotTable, config: any): void {
  for (const row of config.rows || []) {
    const hierarchy = pivot.hierarchies.getItem(row.field);
    pivot.rowHierarchies.add(hierarchy);
  }

  for (const col of config.columns || []) {
    const hierarchy = pivot.hierarchies.getItem(col.field);
    pivot.columnHierarchies.add(hierarchy);
  }

  for (const val of config.values || []) {
    const hierarchy = pivot.hierarchies.getItem(val.field);
    const dataHierarchy = pivot.dataHierarchies.add(hierarchy);
    if (val.summarizeBy) {
      dataHierarchy.summarizeBy = mapSummarizeBy(val.summarizeBy);
    }
  }
}

// ============================================================================
// HELPER: Find pivot table / chart by ID ($N / HN in minified)
// ============================================================================

async function findPivotTable(
  context: Excel.RequestContext,
  sheetId: number,
  pivotId: string
): Promise<Excel.PivotTable> {
  const sheet = await getWorksheetById(context, sheetId);
  sheet.pivotTables.load("items");
  await context.sync();

  const pivot = sheet.pivotTables.items.find((p) => p.id === pivotId);
  if (!pivot) {
    throw new Error(`NotFoundError: Pivot table with id ${pivotId} not found in sheet ${sheetId}`);
  }
  return pivot;
}

async function findChart(
  context: Excel.RequestContext,
  sheetId: number,
  chartId: string
): Promise<Excel.Chart> {
  const sheet = await getWorksheetById(context, sheetId);
  sheet.charts.load("items");
  await context.sync();

  const chart = sheet.charts.items.find((c) => c.id === chartId);
  if (!chart) {
    throw new Error(`NotFoundError: Chart with id ${chartId} not found in sheet ${sheetId}`);
  }
  return chart;
}

// ============================================================================
// MAIN: Sheet command implementations (Tbe in minified)
// ============================================================================

/**
 * The complete map of command implementations for the "sheet" (Excel) surface.
 * Each method receives (params, context: Excel.RequestContext) and returns a result.
 *
 * These are NOT called directly — they are wrapped by `createCommandBridge()`
 * which handles Excel.run(), error wrapping, and timeout protection.
 */
const sheetCommands = {

  // --------------------------------------------------------------------------
  // getFileData: Return workbook name + all sheet metadata
  // --------------------------------------------------------------------------
  getFileData: async (
    _params: {},
    context: Excel.RequestContext
  ): Promise<{
    fileName: string;
    sheetsMetadata: SheetMetadata[];
    totalSheets: number;
  }> => {
    context.workbook.load(["name", "worksheets/items"]);
    await context.sync();

    const sheets = context.workbook.worksheets.items;
    const metadata: SheetMetadata[] = [];

    for (const sheet of sheets) {
      const meta = await getSheetMetadata(sheet, context);
      metadata.push(meta);
    }

    return {
      fileName: context.workbook.name || "Untitled",
      sheetsMetadata: metadata,
      totalSheets: metadata.length,
    };
  },

  // --------------------------------------------------------------------------
  // getSheet: Read cell data from a range of rows
  // --------------------------------------------------------------------------
  getSheet: async (
    params: {
      sheetId: number;
      startRow: number;
      endRow: number;
      includeStyles?: boolean;
    },
    context: Excel.RequestContext
  ): Promise<{
    metadata: SheetMetadata;
    data: CellData[][];
    notes: Record<string, string>;
  }> => {
    const sheet = await getWorksheetById(context, params.sheetId);
    const metadata = await getSheetMetadata(sheet, context);

    const MAX_EXCEL_ROWS = 1_048_576;
    const startRow = params.startRow;
    const endRow = Math.min(params.endRow, MAX_EXCEL_ROWS);

    if (startRow < 1 || startRow > MAX_EXCEL_ROWS) {
      throw new Error(
        `startRow ${startRow} is out of bounds. Must be between 1 and ${MAX_EXCEL_ROWS}.`
      );
    }
    if (endRow < startRow) {
      throw new Error(`endRow ${endRow} cannot be less than startRow ${startRow}.`);
    }

    // Read in chunks of up to 1000 rows
    const chunkSize = 1000;
    const rowCount = endRow - startRow + 1;
    const readRows = Math.min(rowCount, chunkSize);
    const numColumns = metadata.maxColumns || 1;

    // Get the range
    const range = sheet.getRangeByIndexes(startRow - 1, 0, readRows, numColumns);
    range.load(["values", "formulas", "rowIndex", "columnIndex"]);

    // Load notes
    const notes = sheet.notes;
    notes.load("items/content");

    // Optionally load styles
    const includeStyles = params.includeStyles !== false;
    let displayedProps: any;
    if (includeStyles) {
      displayedProps = range.getDisplayedCellProperties({
        format: {
          font: {
            bold: true,
            color: true,
            italic: true,
            name: true,
            size: true,
            strikethrough: true,
            underline: true,
          },
          borders: { color: true, style: true, weight: true },
          fill: { color: true },
          horizontalAlignment: true,
        },
      } as any);
    }

    await context.sync();

    // Resolve note locations
    const noteItems = notes.items.map((note: any) => {
      const location = note.getLocation();
      location.load("address");
      return { note, location };
    });
    await context.sync();

    const noteMap: Record<string, string> = {};
    for (const { note, location } of noteItems) {
      const addr = parseAddress(location.address).range;
      noteMap[addr] = note.content;
    }

    // Build cell data grid
    const data: CellData[][] = [];
    for (let r = 0; r < range.values.length; r++) {
      const row: CellData[] = [];
      for (let c = 0; c < range.values[r].length; c++) {
        const colNum = range.columnIndex + c + 1;
        const a1 = `${columnToLetter(colNum)}${range.rowIndex + r + 1}`;
        const value = range.values[r][c];
        const formula = range.formulas[r][c];

        let cellStyles: CellStyles | undefined;
        let borderStyles: Record<string, BorderDef> | undefined;

        if (includeStyles && displayedProps) {
          const cellProps = displayedProps.value?.[r]?.[c];
          if (cellProps?.format) {
            const extracted = extractDisplayedStyles(cellProps.format);
            cellStyles = extracted.cellStyles;
            borderStyles = extracted.borderStyles;
          }
        }

        row.push({
          a1,
          value: value !== "" ? value : undefined,
          formula: formula !== "" ? formula : undefined,
          cellStyles,
          borderStyles,
          note: noteMap[a1] || undefined,
        });
      }
      data.push(row);
    }

    return { metadata, data, notes: noteMap };
  },

  // --------------------------------------------------------------------------
  // setCells: Write values, formulas, notes, and styles to individual cells
  // --------------------------------------------------------------------------
  setCells: async (
    params: { sheetId: number; cells: CellData[] },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const sheet = await getWorksheetById(context, params.sheetId);

    for (const cell of params.cells) {
      const range = sheet.getRange(cell.a1);

      // Set value or formula
      if (cell.formula !== undefined) {
        range.formulas = [[cell.formula]];
      } else if (cell.value !== undefined) {
        range.values = [[cell.value]];
      }

      // Apply styles
      if (cell.cellStyles) applyCellStyles(range, cell.cellStyles);
      if (cell.borderStyles) applyBorderStyles(range, cell.borderStyles);

      // Set note
      if (cell.note !== undefined && cell.note !== "") {
        const existingNote = sheet.notes.getItemOrNullObject(cell.a1);
        existingNote.load("isNullObject");
        await context.sync();

        if (existingNote.isNullObject) {
          sheet.notes.add(cell.a1, cell.note);
        } else {
          existingNote.content = cell.note;
        }
      }
    }

    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // modifySheetStructure: Insert/delete/hide/unhide rows & columns, freeze panes
  // --------------------------------------------------------------------------
  modifySheetStructure: async (
    params: {
      sheetId: number;
      operation: string;
      dimension?: string;
      reference?: string;
      count?: number;
      position?: string;
    },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const sheet = await getWorksheetById(context, params.sheetId);
    sheet.load("name");
    await context.sync();

    const count = params.count || 1;

    if (params.operation === "unfreeze") {
      sheet.freezePanes.unfreeze();
    } else if (params.dimension === "rows") {
      if (params.operation === "freeze") {
        sheet.freezePanes.freezeRows(count);
      } else {
        if (!params.reference) {
          throw new Error("Reference required for insert/delete/hide/unhide operations");
        }

        const refRow = parseInt(params.reference, 10);
        const startRow = (params.position || "before") === "before" ? refRow : refRow + 1;
        const endRow = startRow + count - 1;
        const rangeAddr = `${startRow}:${endRow}`;
        const range = sheet.getRange(rangeAddr);

        switch (params.operation) {
          case "insert":
            range.insert("Down");
            break;
          case "delete":
            range.delete("Up");
            break;
          case "hide":
            range.rowHidden = true;
            break;
          case "unhide":
            range.rowHidden = false;
            break;
        }
      }
    } else {
      // columns
      if (params.operation === "freeze") {
        sheet.freezePanes.freezeColumns(count);
      } else if (params.operation === "insert" || params.operation === "delete") {
        if (!params.reference) {
          throw new Error("Reference required for insert/delete operations");
        }

        const colNum = letterToColumn(params.reference.toUpperCase());
        if (!colNum) throw new Error(`Invalid column reference: ${params.reference}`);

        const startCol = (params.position || "before") === "before" ? colNum : colNum + 1;
        const endCol = startCol + count - 1;
        const rangeAddr = `${columnToLetter(startCol)}:${columnToLetter(endCol)}`;
        const range = sheet.getRange(rangeAddr);

        if (params.operation === "insert") {
          range.insert("Right");
        } else {
          range.delete("Left");
        }
      } else if (params.operation === "hide" || params.operation === "unhide") {
        if (!params.reference) {
          throw new Error(`Reference required for ${params.operation} operation`);
        }

        const colNum = letterToColumn(params.reference.toUpperCase());
        if (!colNum) throw new Error(`Invalid column reference: ${params.reference}`);

        const endCol = colNum + count - 1;
        const rangeAddr = `${params.reference.toUpperCase()}:${columnToLetter(endCol)}`;
        const range = sheet.getRange(rangeAddr);
        range.columnHidden = params.operation === "hide";
      }
    }

    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // modifyWorkbookStructure: Create/delete/rename/duplicate sheets
  // --------------------------------------------------------------------------
  modifyWorkbookStructure: async (
    params: {
      operation: string;
      sheetId?: number;
      sheetName?: string;
      newName?: string;
      tabColor?: string;
    },
    context: Excel.RequestContext
  ): Promise<{ sheetId?: number }> => {
    switch (params.operation) {
      case "create": {
        const name = params.sheetName || "Sheet";
        const newSheet = context.workbook.worksheets.add(name);
        newSheet.load(["tabId", "name"]);
        await context.sync();

        if (params.tabColor) {
          newSheet.tabColor = params.tabColor;
          await context.sync();
        }

        return { sheetId: (newSheet as any).tabId };
      }

      case "delete": {
        if (!params.sheetId) throw new Error("sheetId is required for delete operation");
        const sheet = await getWorksheetById(context, params.sheetId);
        sheet.delete();
        await context.sync();
        return {};
      }

      case "rename": {
        if (!params.sheetId || !params.newName) {
          throw new Error("sheetId and newName are required for rename operation");
        }
        const sheet = await getWorksheetById(context, params.sheetId);
        sheet.name = params.newName;
        await context.sync();
        return {};
      }

      case "duplicate": {
        if (!params.sheetId) throw new Error("sheetId is required for duplicate operation");

        const sourceSheet = await getWorksheetById(context, params.sheetId);
        sourceSheet.load("name");
        await context.sync();

        const newName = params.newName || `${sourceSheet.name} Copy`;
        const newSheet = context.workbook.worksheets.add(newName);
        newSheet.load(["tabId", "name"]);
        await context.sync();

        // Copy used range
        const usedRange = sourceSheet.getUsedRangeOrNullObject(true);
        usedRange.load(["values", "formulas", "isNullObject"]);
        await context.sync();

        if (!usedRange.isNullObject) {
          const destRange = newSheet.getRangeByIndexes(
            0, 0,
            usedRange.values.length,
            usedRange.values[0].length
          );
          destRange.formulas = usedRange.formulas;
          await context.sync();
        }

        return { sheetId: (newSheet as any).tabId };
      }

      default:
        throw new Error(`Unknown operation: ${params.operation}`);
    }
  },

  // --------------------------------------------------------------------------
  // getUserContext: Get active sheet, selection, and chart context
  // --------------------------------------------------------------------------
  getUserContext: async (
    _params: {},
    context: Excel.RequestContext
  ): Promise<{
    sheetId: number;
    selectedRanges?: string[];
    selectedChart?: { chartId: string; chartTitle: string };
  }> => {
    const activeSheet = context.workbook.worksheets.getActiveWorksheet();
    activeSheet.load(["tabId", "name"]);

    const activeChart = context.workbook.getActiveChartOrNullObject();
    activeChart.load(["isNullObject", "id", "name"]);
    await context.sync();

    // If a chart is selected, return chart info
    if (!activeChart.isNullObject) {
      activeChart.title.load("text");
      await context.sync();

      return {
        sheetId: (activeSheet as any).tabId,
        selectedChart: {
          chartId: activeChart.id,
          chartTitle: activeChart.title.text || activeChart.name,
        },
      };
    }

    // Otherwise return selected ranges
    const selectedRanges = context.workbook.getSelectedRanges();
    selectedRanges.load("address");
    await context.sync();

    const ranges = selectedRanges.address ? selectedRanges.address.split(",") : [];

    return {
      sheetId: (activeSheet as any).tabId,
      selectedRanges: ranges,
    };
  },

  // --------------------------------------------------------------------------
  // selectCellRange: Activate a sheet and select a range
  // --------------------------------------------------------------------------
  selectCellRange: async (
    params: { sheetId: number; range: string },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const sheet = await getWorksheetById(context, params.sheetId);
    sheet.activate();
    await context.sync();
    sheet.getRange(params.range).select();
    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // copyTo: Copy from source range to destination range
  // --------------------------------------------------------------------------
  copyTo: async (
    params: { sheetId: number; sourceRange: string; destinationRange: string },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const sheet = await getWorksheetById(context, params.sheetId);
    sheet.getRange(params.destinationRange).copyFrom(params.sourceRange);
    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // highlightRange: Activate sheet and optionally select a range
  // --------------------------------------------------------------------------
  highlightRange: async (
    params: { sheetId: number; range?: string },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const sheet = await getWorksheetById(context, params.sheetId);
    if (params.range) {
      sheet.getRange(params.range).select();
    } else {
      sheet.activate();
    }
    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // createPivotTable: Create a new pivot table
  // --------------------------------------------------------------------------
  createPivotTable: async (
    params: { properties: any },
    context: Excel.RequestContext
  ): Promise<{ id: string }> => {
    const props = params.properties;
    const sheet = await getWorksheetById(context, props.sheetId);
    const sourceRange = await resolveSourceRange(context, props.source);
    const destRange = sheet.getRange(props.range);

    const pivot = sheet.pivotTables.add(props.name, sourceRange, destRange);
    configurePivotFields(pivot, props);

    pivot.load("id");
    await context.sync();
    return { id: pivot.id };
  },

  // --------------------------------------------------------------------------
  // getPivotTables: Get all pivot tables in the workbook
  // --------------------------------------------------------------------------
  getPivotTables: async (
    _params: {},
    context: Excel.RequestContext
  ): Promise<{ results: any[] }> => {
    context.workbook.worksheets.load("items");
    await context.sync();

    const results: any[] = [];
    for (const sheet of context.workbook.worksheets.items) {
      sheet.pivotTables.load("items");
      await context.sync();

      for (const pivot of sheet.pivotTables.items) {
        results.push(await serializePivotTable(context, pivot));
      }
    }
    return { results };
  },

  // --------------------------------------------------------------------------
  // updatePivotTable: Update pivot table fields
  // --------------------------------------------------------------------------
  updatePivotTable: async (
    params: { id: string; sheetId: number; properties: any },
    context: Excel.RequestContext
  ): Promise<{ id: string }> => {
    const props = params.properties;
    const pivot = await findPivotTable(context, params.sheetId, params.id);

    pivot.load(["id", "name"]);
    pivot.rowHierarchies.load("items");
    pivot.columnHierarchies.load("items");
    pivot.dataHierarchies.load("items");
    await context.sync();

    // Update name
    if (props.name) pivot.name = props.name;

    // Clear existing fields if new ones are provided
    if (props.rows?.length) {
      pivot.rowHierarchies.items.forEach((h: any) => pivot.rowHierarchies.remove(h));
    }
    if (props.columns?.length) {
      pivot.columnHierarchies.items.forEach((h: any) => pivot.columnHierarchies.remove(h));
    }
    if (props.values?.length) {
      pivot.dataHierarchies.items.forEach((h: any) => pivot.dataHierarchies.remove(h));
    }
    await context.sync();

    // Add new fields
    configurePivotFields(pivot, props);
    pivot.refresh();
    await context.sync();

    return { id: params.id };
  },

  // --------------------------------------------------------------------------
  // deletePivotTable
  // --------------------------------------------------------------------------
  deletePivotTable: async (
    params: { id: string; sheetId: number },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const pivot = await findPivotTable(context, params.sheetId, params.id);
    pivot.delete();
    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // createChart
  // --------------------------------------------------------------------------
  createChart: async (
    params: { properties: any },
    context: Excel.RequestContext
  ): Promise<{ id: string }> => {
    const props = params.properties;
    const sheet = await getWorksheetById(context, props.sheetId);
    const sourceRange = await resolveSourceRange(context, props.source);

    const chart = sheet.charts.add(
      mapChartType(props.chartType),
      sourceRange,
      Excel.ChartSeriesBy.auto
    );

    if (props.anchor) chart.setPosition(props.anchor);
    chart.title.text = props.title;

    chart.load("id");
    await context.sync();
    return { id: chart.id };
  },

  // --------------------------------------------------------------------------
  // getCharts
  // --------------------------------------------------------------------------
  getCharts: async (
    _params: {},
    context: Excel.RequestContext
  ): Promise<{ results: any[] }> => {
    context.workbook.worksheets.load("items");
    await context.sync();

    const results: any[] = [];
    for (const sheet of context.workbook.worksheets.items) {
      sheet.charts.load("items");
      await context.sync();

      for (const chart of sheet.charts.items) {
        results.push(await serializeChart(context, chart));
      }
    }
    return { results };
  },

  // --------------------------------------------------------------------------
  // updateChart
  // --------------------------------------------------------------------------
  updateChart: async (
    params: { id: string; sheetId: number; properties: any },
    context: Excel.RequestContext
  ): Promise<{ id: string; messages?: string[] }> => {
    const props = params.properties;
    const chart = await findChart(context, params.sheetId, params.id);

    if (props.chartType) chart.chartType = mapChartType(props.chartType);
    if (props.title) chart.title.text = props.title;
    if (props.anchor) chart.setPosition(props.anchor);
    if (props.position) {
      chart.top = props.position.top;
      chart.left = props.position.left;
    }
    if (props.source) {
      const sourceRange = await resolveSourceRange(context, props.source);
      chart.setData(sourceRange, Excel.ChartSeriesBy.auto);
    }

    let messages: string[] | undefined;
    try {
      await context.sync();
    } catch (err: any) {
      if (
        err instanceof OfficeExtension.Error &&
        err.code === Excel.ErrorCodes.invalidOperation
      ) {
        messages = [
          "WARN: This chart is backed by a pivot table. To modify its data source, " +
            "update the pivot table itself - changes will automatically propagate to the chart.",
          "INFO: All other chart properties were updated successfully",
        ];
      } else {
        throw err;
      }
    }

    return { id: params.id, messages };
  },

  // --------------------------------------------------------------------------
  // deleteChart
  // --------------------------------------------------------------------------
  deleteChart: async (
    params: { id: string; sheetId: number },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const chart = await findChart(context, params.sheetId, params.id);
    chart.delete();
    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // resizeRange: Adjust column widths and/or row heights
  // --------------------------------------------------------------------------
  resizeRange: async (
    params: {
      sheetId: number;
      range?: string;
      width?: { type: string; value?: number };
      height?: { type: string; value?: number };
    },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const sheet = await getWorksheetById(context, params.sheetId);
    const range = params.range ? sheet.getRange(params.range) : sheet.getRange();

    if (params.width) {
      if (params.width.type === "points" && params.width.value !== undefined) {
        range.format.columnWidth = params.width.value;
      } else if (params.width.type === "standard") {
        (range.format as any).useStandardWidth = true;
      }
    }

    if (params.height) {
      if (params.height.type === "points" && params.height.value !== undefined) {
        range.format.rowHeight = params.height.value;
      } else if (params.height.type === "standard") {
        (range.format as any).useStandardHeight = true;
      }
    }

    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // clearCellRange: Clear content, formatting, or both
  // --------------------------------------------------------------------------
  clearCellRange: async (
    params: { sheetId: number; range: string; clearType?: string },
    context: Excel.RequestContext
  ): Promise<{}> => {
    const sheet = await getWorksheetById(context, params.sheetId);
    const range = sheet.getRange(params.range);

    const clearMap: Record<string, Excel.ClearApplyTo> = {
      contents: Excel.ClearApplyTo.contents,
      all: Excel.ClearApplyTo.all,
      formats: Excel.ClearApplyTo.formats,
    };

    range.clear(clearMap[params.clearType || "contents"]);
    await context.sync();
    return {};
  },

  // --------------------------------------------------------------------------
  // searchCells: Native Excel search using findAllOrNullObject
  // --------------------------------------------------------------------------
  searchCells: async (
    params: {
      sheetId?: number;
      searchTerm: string;
      matchCase?: boolean;
      matchEntireCell?: boolean;
    },
    context: Excel.RequestContext
  ): Promise<{ matches: any[]; totalFound: number }> => {
    const matches: any[] = [];
    const worksheets = context.workbook.worksheets;
    worksheets.load("items");
    await context.sync();

    const sheetsToSearch = params.sheetId
      ? worksheets.items.filter((ws: any) => ws.tabId === params.sheetId)
      : worksheets.items;

    for (const sheet of sheetsToSearch) {
      sheet.load(["tabId", "name"]);

      const found = sheet.findAllOrNullObject(params.searchTerm, {
        matchCase: params.matchCase || false,
        completeMatch: params.matchEntireCell || false,
      });
      found.load(["isNullObject", "areas/items"]);
      await context.sync();

      if (!found.isNullObject) {
        for (const area of found.areas.items) {
          area.load(["values", "formulas", "rowIndex", "columnIndex", "rowCount", "columnCount"]);
        }
        await context.sync();

        for (const area of found.areas.items) {
          for (let r = 0; r < area.rowCount; r++) {
            for (let c = 0; c < area.columnCount; c++) {
              const value = area.values[r][c];
              const formula = area.formulas[r][c];
              const row = area.rowIndex + r + 1;
              const col = area.columnIndex + c + 1;

              matches.push({
                sheetName: sheet.name,
                sheetId: (sheet as any).tabId,
                a1: columnToLetter(col) + row,
                value: value !== "" ? value : undefined,
                formula: formula !== "" && formula !== value ? formula : null,
                row,
                column: col,
              });
            }
          }
        }
      }
    }

    return { matches, totalFound: matches.length };
  },
};


// ============================================================================
// COMMAND BRIDGE: Wraps raw commands in Office.run + error handling (Zbe)
// ============================================================================

/**
 * Wrap the raw command implementations for a given surface so that each
 * call is automatically wrapped in the host's .run() method with:
 * - Timeout protection via safeOfficeRun (pa)
 * - OfficeExtension.Error formatting with debug info
 *
 * This is what the tool implementations actually call.
 */
function createCommandBridge(surface: "sheet" | "doc" | "slide"): Record<string, Function> {
  const getRunner = () => {
    switch (surface) {
      case "sheet": return Excel.run;
      case "doc": return Word.run;
      case "slide": return PowerPoint.run;
    }
  };

  const commandMap: Record<string, Function> = {
    sheet: sheetCommands,
    // doc: docCommands,   (ebe in minified)
    // slide: slideCommands (Gbe in minified)
  }[surface] as any;

  const hostName = { sheet: "Excel", doc: "Word", slide: "PowerPoint" }[surface];
  const runner = getRunner();

  return Object.fromEntries(
    Object.entries(commandMap).map(([name, handler]) => [
      name,
      async (params: any) => {
        try {
          return await safeOfficeRun(runner, async (context: any) =>
            (handler as Function)(params, context)
          );
        } catch (err: any) {
          if (err instanceof OfficeExtension.Error) {
            const debugLocation =
              err.debugInfo?.errorLocation || err.debugInfo?.fullStatements || "";
            throw new Error(
              `${hostName} Error ${err.code}: ${err.message}${
                debugLocation ? ` | Debug: ${debugLocation}` : ""
              }`
            );
          }
          throw err;
        }
      },
    ])
  );
}

/**
 * Run an Office.js operation with timeout protection for Online environments.
 * On Desktop, just calls the runner directly.
 * On Office Online, serializes operations and adds a 120s timeout.
 */
const OFFICE_ONLINE_TIMEOUT = 120_000;
let onlinePromiseChain = Promise.resolve();

function safeOfficeRun(
  runner: (fn: (context: any) => Promise<any>) => Promise<any>,
  callback: (context: any) => Promise<any>
): Promise<any> {
  if (getHostPlatform() !== "OfficeOnline") {
    return runner(callback);
  }

  // Serialize concurrent operations on Office Online
  const operation = onlinePromiseChain
    .catch(() => {})
    .then(() =>
      Promise.race([
        runner(callback),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`Office.run timed out after ${OFFICE_ONLINE_TIMEOUT}ms`)),
            OFFICE_ONLINE_TIMEOUT
          )
        ),
      ])
    );

  onlinePromiseChain = operation as any;
  return operation;
}

/**
 * Initialize the command bridge for the current Office host.
 * Called once at app startup. (Wbe in minified)
 */
function initializeCommands(): Record<string, Function> {
  if (typeof Office === "undefined" || !Office.context?.host) {
    return {};
  }
  const surface = getSurface(); // tn() in minified — "sheet" | "slide" | "doc"
  return createCommandBridge(surface as any);
}


// ============================================================================
// STUBS for external dependencies
// ============================================================================

declare function getSurface(): string;
declare function getHostPlatform(): string;
declare function mapChartType(chartType: string): Excel.ChartType;
declare function reverseChartType(chartType: Excel.ChartType): string;
declare function mapSummarizeBy(summarizeBy: string): Excel.AggregationFunction;
declare function reverseSummarizeBy(summarizeBy: Excel.AggregationFunction): string;
declare function resolveDataSourceAddress(context: Excel.RequestContext, raw: string): Promise<string>;


// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Main command map
  sheetCommands,

  // Bridge
  createCommandBridge,
  initializeCommands,
  safeOfficeRun,

  // Helpers
  getWorksheetById,
  getSheetMetadata,
  resolveSourceRange,
  parseAddress,
  applyCellStyles,
  applyBorderStyles,
  extractDisplayedStyles,
  configurePivotFields,
  serializePivotTable,
  serializeChart,
  findPivotTable,
  findChart,
  columnToLetter,
  letterToColumn,
};
