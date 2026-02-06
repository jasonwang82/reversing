/**
 * Reverse-engineered tool implementations and sandbox/lockdown logic
 * from Claude for Excel's minified_bundle.js
 *
 * This file reconstructs the complete tool dispatch, permission system,
 * Office.js sandbox (SES lockdown + Proxy-based instrumentation), and
 * formula security validation.
 */

// ============================================================================
// TYPES
// ============================================================================

interface CellData {
  a1: string;
  value?: any;
  formula?: string;
  note?: string;
  cellStyles?: CellStyles;
  borderStyles?: BorderStyles;
}

interface CellStyles {
  fontWeight?: string;
  fontStyle?: string;
  fontLine?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  backgroundColor?: string;
  horizontalAlignment?: string;
  numberFormat?: string;
}

interface BorderStyles {
  top?: BorderDef;
  bottom?: BorderDef;
  left?: BorderDef;
  right?: BorderDef;
}

interface BorderDef {
  weight?: string;
  style?: string;
  color?: string;
}

interface SheetMetadata {
  id: number;
  name: string;
  maxRows: number;
  maxColumns: number;
  frozenRows: number;
  frozenColumns: number;
}

interface ToolInput {
  sheetId?: number;
  ranges?: string[];
  range?: string;
  cells?: any[][];
  explanation?: string;
  allow_overwrite?: boolean;
  copyToRange?: string;
  resizeWidth?: SizeSpec;
  resizeHeight?: SizeSpec;
  includeStyles?: boolean;
  cellLimit?: number;
  includeHeaders?: boolean;
  maxRows?: number;
  searchTerm?: string;
  offset?: number;
  options?: SearchOptions;
  operation?: string;
  reference?: string;
  dimension?: string;
  count?: number;
  sheetName?: string;
  newName?: string;
  sourceRange?: string;
  destinationRange?: string;
  objectType?: string;
  properties?: any;
  id?: string;
  width?: SizeSpec;
  height?: SizeSpec;
  clearType?: string;
  code?: string;
}

interface SizeSpec {
  type: "points" | "standard";
  value?: number;
}

interface SearchOptions {
  matchCase?: boolean;
  matchEntireCell?: boolean;
  useRegex?: boolean;
  matchFormulas?: boolean;
  ignoreDiacritics?: boolean;
  maxResults?: number;
}

interface OperationRecord {
  type: "method" | "setter";
  name: string;
  chain: string[];
  isDestructive: boolean;
  warning: string;
}

type PermissionCheckCallback = (operations: OperationRecord[]) => Promise<boolean>;

type PermissionMode = "ask" | "skip" | "dangerously-skip";

interface ToolCall {
  id: string;
  name: string;
  input: ToolInput;
  caller?: { type: string };
}

// Backend commands interface (the RPC bridge to Office.js host)
interface CommandImplementations {
  getFileData(params: {}): Promise<{ success: boolean; error?: string; sheetsMetadata: SheetMetadata[] }>;
  getSheet(params: {
    sheetId: number;
    startRow: number;
    endRow: number;
    includeStyles?: boolean;
  }): Promise<{ success: boolean; error?: string; data: CellData[][]; notes?: Record<string, string>; metadata?: { name: string } }>;
  setCells(params: { sheetId: number; cells: CellData[] }): Promise<{ success: boolean; error?: string }>;
  copyTo(params: {
    sheetId: number;
    sourceRange: string;
    destinationRange: string;
  }): Promise<{ success: boolean; error?: string }>;
  resizeRange(params: {
    sheetId: number;
    range?: string;
    width?: SizeSpec;
    height?: SizeSpec;
  }): Promise<{ success: boolean; error?: string }>;
  modifySheetStructure(params: any): Promise<{ success: boolean; error?: string }>;
  modifyWorkbookStructure(params: any): Promise<{ success: boolean; error?: string; sheetId?: number }>;
  getPivotTables(params: {}): Promise<{ success: boolean; error?: string; results: any[] }>;
  getCharts(params: {}): Promise<{ success: boolean; error?: string; results: any[] }>;
  clearCellRange(params: {
    sheetId: number;
    range: string;
    clearType?: string;
  }): Promise<{ success: boolean; error?: string }>;
  searchCells?(params: {
    sheetId?: number;
    searchTerm: string;
    matchCase: boolean;
    matchEntireCell: boolean;
  }): Promise<{ success: boolean; matches: any[]; totalFound: number }>;
  highlightRange?(range: string): Promise<void>;
  getUserContext?(params: {}): Promise<any>;
  [key: string]: any; // dynamic method dispatch for modify_object operations
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Default cell limit for get_cell_ranges */
const DEFAULT_CELL_LIMIT = 2000;

/** JIT code execution timeout (90 seconds) */
const JIT_TIMEOUT = 90_000;

/** Office.run timeout for online (120 seconds) */
const OFFICE_RUN_TIMEOUT = 120_000;

/** Max recursion depth for formula validation in nested objects */
const MAX_FORMULA_VALIDATION_DEPTH = 3;

/**
 * Write tools that require user permission before execution.
 * These are the "destructive" structured tools for the sheet surface.
 */
const WRITE_TOOLS_SHEET: string[] = [
  "set_cell_range",
  "clear_cell_range",
  "modify_sheet_structure",
  "modify_workbook_structure",
  "copy_to",
  "modify_object",
];

/** Write tools for the slide surface */
const WRITE_TOOLS_SLIDE: string[] = [
  "insert_slide_element",
  "remove_slide_element",
  "modify_presentation_structure",
];

/** Write tools for the doc surface */
const WRITE_TOOLS_DOC: string[] = [
  "insert_text",
  "replace_text",
  "format_text",
];

/**
 * Map of surface → write tool names that require permission
 */
const WRITE_TOOLS_BY_SURFACE: Record<string, string[]> = {
  sheet: WRITE_TOOLS_SHEET,
  slide: WRITE_TOOLS_SLIDE,
  doc: WRITE_TOOLS_DOC,
};


// ============================================================================
// FORMULA SECURITY: Blocked Functions & DDE Detection
// ============================================================================

/**
 * Functions that are blocked from being written to cells because they can
 * make network requests, access external resources, or execute arbitrary code.
 */
const BLOCKED_FORMULA_FUNCTIONS: string[] = [
  "WEBSERVICE",
  "IMPORTDATA",
  "INDIRECT",
  "IMPORTXML",
  "IMPORTHTML",
  "IMPORTFEED",
  "FILTERXML",
  "RTD",
  "REGISTER.ID",
  "CALL",
  "EVALUATE",
  "FORMULA",
  "IMAGE",
  "FILES",
  "DIRECTORY",
  "DDE",
  "FOPEN",
  "FWRITE",
  "FCLOSE",
  "INFO",
  "STOCKHISTORY",
  "STOCKSERIES",
  "TRANSLATE",
  "CUBEKPIMEMBER",
  "CUBEMEMBER",
  "CUBEMEMBERPROPERTY",
  "CUBERANKEDMEMBER",
  "CUBESET",
  "CUBESETCOUNT",
  "CUBEVALUE",
  "EXEC",
];

const BLOCKED_FUNCTIONS_SET = new Set(BLOCKED_FORMULA_FUNCTIONS.map((f) => f.toUpperCase()));

/** Prefixes that indicate a formula (DDE injection vectors) */
const FORMULA_PREFIXES = ["=", "+", "-", "@", "{="];

/**
 * Check if a formula string contains blocked functions or DDE patterns.
 * Uses a tokenizer (rZ) to parse the formula and check each token.
 */
function containsBlockedFormula(formula: string): boolean {
  const trimmed = formula.trim();
  if (!trimmed || !FORMULA_PREFIXES.some((p) => trimmed.startsWith(p))) {
    return false;
  }

  try {
    const tokens = tokenizeFormula(trimmed); // rZ in minified
    for (const token of tokens) {
      if (token.type === TokenType.FUNCTION || token.type === TokenType.REF_NAMED) {
        // Strip Excel's internal prefixes: _xlfn._xlws., _xlfn., _xlws.
        const normalized = token.value.toUpperCase().replace(/^_XLFN\.(_XLWS\.)?|^_XLWS\./, "");
        if (BLOCKED_FUNCTIONS_SET.has(normalized)) {
          return true;
        }
      }
      // DDE injection: UNKNOWN token containing pipe character
      if (token.type === TokenType.UNKNOWN && token.value.includes("|")) {
        return true;
      }
    }
  } catch {
    // If tokenization fails, we can't validate — allow it through
  }

  return false;
}

/**
 * Extract the names of blocked functions found in a set_cell_range input's cells.
 * Returns a list of uppercase function names for error reporting.
 */
function extractBlockedFunctions(input: ToolInput): string[] {
  const found = new Set<string>();
  if (!input?.cells || !Array.isArray(input.cells)) return [];

  for (const row of input.cells) {
    if (!Array.isArray(row)) continue;
    for (const cell of row) {
      if (!cell || typeof cell !== "object" || !("formula" in cell)) continue;
      const formula = cell.formula;
      if (!formula) continue;

      const tokens = tokenizeFormula(formula);
      for (const token of tokens) {
        if (token.type === TokenType.FUNCTION || token.type === TokenType.REF_NAMED) {
          if (BLOCKED_FUNCTIONS_SET.has(token.value.toUpperCase())) {
            found.add(token.value.toUpperCase());
          }
        }
      }
    }
  }

  return Array.from(found);
}

/**
 * Check if a set_cell_range input contains any blocked formulas.
 */
function inputContainsBlockedFormulas(input: ToolInput): boolean {
  if (!input?.cells || !Array.isArray(input.cells)) return false;

  for (const row of input.cells) {
    if (!Array.isArray(row)) continue;
    for (const cell of row) {
      if (!cell || typeof cell !== "object" || !("formula" in cell)) continue;
      if (cell.formula && containsBlockedFormula(cell.formula)) return true;
    }
  }

  return false;
}

// Placeholder for actual formula tokenizer
enum TokenType {
  FUNCTION = "FUNCTION",
  REF_NAMED = "REF_NAMED",
  UNKNOWN = "UNKNOWN",
  // ... other token types from the formula parser
}

interface FormulaToken {
  type: TokenType;
  value: string;
}

/** Placeholder: in the real bundle this is a full Excel formula tokenizer */
declare function tokenizeFormula(formula: string): FormulaToken[];


// ============================================================================
// OFFICE.JS SANDBOX: SES Lockdown + Proxy Instrumentation
// ============================================================================

/**
 * The sandbox uses Secure ECMAScript (SES) via `lockdown()` and `Compartment`
 * to create a hardened JavaScript evaluation environment for user-generated
 * Office.js code from the execute_office_js tool.
 *
 * Layers of protection:
 * 1. SES lockdown() — freezes all intrinsics, prevents prototype pollution
 * 2. Compartment — isolated evaluation scope with curated globals
 * 3. Proxy instrumentation — tracks all reads/writes, blocks dangerous APIs
 * 4. Formula validation — blocks dangerous formulas at the property setter level
 * 5. Deep freeze — freezes values written via property setters
 */

let lockdownInitialized = false;

/**
 * Object properties to exclude from the safe Object shim
 * (prevents sandbox escape via prototype manipulation)
 */
const EXCLUDED_OBJECT_METHODS = new Set([
  "defineProperty",
  "getOwnPropertyDescriptor",
  "getPrototypeOf",
  "setPrototypeOf",
]);

/** Properties to preserve from Function (the rest get locked) */
const PRESERVED_FUNCTION_PROPS = new Set(["length", "name", "prototype"]);

/**
 * Function validation methods that get nulled out after lockdown
 * to prevent Office.js parameter validation from interfering
 */
const VALIDATION_METHODS_TO_NULL = new Set([
  "_validateParams",
  "_validateParameterCount",
  "_validateParameter",
  "_validateParameterType",
]);

/**
 * Create a safe subset of the Object global.
 * Removes dangerous methods that could be used to escape the sandbox:
 * - defineProperty: could redefine frozen properties
 * - getOwnPropertyDescriptor: could leak proxy internals
 * - getPrototypeOf / setPrototypeOf: could manipulate prototype chain
 */
function createSafeObject(): Record<string, any> {
  const safe: Record<string, any> = {};
  for (const key of Object.getOwnPropertyNames(Object)) {
    if (!EXCLUDED_OBJECT_METHODS.has(key)) {
      safe[key] = (Object as any)[key];
    }
  }
  return safe;
}

/**
 * Snapshot Function's own properties before lockdown freezes them.
 * After lockdown, we restore validation methods as no-ops.
 */
function snapshotFunctionProperties(): Map<string, any> {
  const snapshot = new Map<string, any>();
  for (const key of Object.getOwnPropertyNames(Function)) {
    if (!PRESERVED_FUNCTION_PROPS.has(key)) {
      snapshot.set(key, (Function as any)[key]);
    }
  }
  return snapshot;
}

/**
 * After SES lockdown, null out Office.js internal validation methods
 * on Function that would otherwise throw when the sandboxed code
 * tries to call Office.js APIs.
 */
function restoreValidationMethods(snapshot: Map<string, any>): void {
  if (snapshot.size === 0) return;

  const noop = () => null;
  for (const methodName of VALIDATION_METHODS_TO_NULL) {
    if (snapshot.has(methodName)) {
      snapshot.set(methodName, noop);
    }
  }

  const fn = globalThis.Function;
  if (Object.isExtensible(fn)) {
    try {
      for (const [key, value] of snapshot) {
        Object.defineProperty(fn, key, {
          value,
          writable: false,
          enumerable: false,
          configurable: false,
        });
      }
    } catch {
      // Already frozen by lockdown — ignore
    }
  }
}

/**
 * Initialize SES lockdown (once per session).
 * This freezes all JavaScript intrinsics to prevent prototype pollution.
 */
function initializeLockdown(): void {
  if (lockdownInitialized) return;
  lockdownInitialized = true;

  try {
    const functionSnapshot = snapshotFunctionProperties();

    // SES lockdown with relaxed error/console taming for debugging
    (globalThis as any).lockdown({
      errorTaming: "unsafe",
      consoleTaming: "unsafe",
      overrideTaming: "severe",
    });

    restoreValidationMethods(functionSnapshot);
  } catch (e: any) {
    // If SES is already locked down, that's fine
    if (!(e instanceof TypeError && String(e).includes("SES_ALREADY_LOCKED_DOWN"))) {
      throw e;
    }
  }
}


// ============================================================================
// BLOCKED OFFICE.JS API ACCESS
// ============================================================================

/**
 * Office.js APIs that are completely blocked (throw on access).
 * These could be used to exfiltrate data or perform unauthorized actions.
 */
const BLOCKED_OFFICE_APIS = [
  "context.ui.openBrowserWindow",   // open arbitrary URLs
  "context.ui.displayDialogAsync",  // open dialog windows
  "context.auth.getAccessToken",    // steal auth tokens
  "actions.associate",              // register custom actions
];

/**
 * Office.js methods blocked from being called (throw on invocation).
 * These could inject malicious content or send data externally.
 */
const BLOCKED_METHODS = new Set([
  "addAsJson",
  "sendForReview",
  "sendFaxOverInternet",
  "sendFax",
  "sendMail",
  "insertHtml",
  "insertOoxml",
  "insertWorksheetsFromBase64",
  "insertFileFromBase64",
  "insertSlidesFromBase64",
]);

/**
 * Property setters that are intercepted for formula validation.
 * When writing to these properties, the value is checked for blocked formulas.
 * `valuesAsJson` / `valuesAsJsonLocal` are fully blocked (write throws).
 * The rest go through formula validation before allowing the write.
 */
const INTERCEPTED_SETTERS = new Map<string, "block" | "validate">([
  ["valuesAsJson", "block"],
  ["valuesAsJsonLocal", "block"],
  ["values", "validate"],
  ["formulas", "validate"],
  ["formulasLocal", "validate"],
  ["formulasR1C1", "validate"],
  ["formulasR1C1Local", "validate"],
  ["formulaArray", "validate"],
  ["dataValidation", "validate"],
  ["formula", "validate"],
]);

/**
 * Property names that are tracked as non-destructive setter operations
 * for the permission system.
 */
const TRACKED_SETTER_PROPERTIES = new Set([
  "values",
  "formulas",
  "formulasLocal",
  "formulasR1C1",
  "formulasR1C1Local",
  "formulaArray",
  "numberFormat",
  "numberFormatLocal",
  "text",
  "name",
  "position",
  "visibility",
  "visible",
  "style",
  "hyperlink",
  "left",
  "top",
  "width",
  "height",
  "rotation",
]);

/**
 * Method names that are destructive (data loss potential).
 * Shown with a red warning in the permission dialog.
 */
const DESTRUCTIVE_METHOD_NAMES = new Set([
  "delete",
  "clear",
  "clearAll",
  "deleteAll",
  "deleteRows",
  "deleteColumns",
  "removeDuplicates",
  "replaceAll",
  "moveTo",
  "cut",
  "clearOrResetContents",
  "deleteText",
  "clearFilters",
  "acceptAllRevisions",
  "rejectAllRevisions",
  "acceptAll",
  "rejectAll",
  "ungroup",
  "markDirty",
  "unmerge",
  "split",
  "convertToText",
  "breakAllLinks",
  "breakLinks",
  "removePageBreaks",
  "save",
  "close",
  "autoFill",
  "flashFill",
]);

/**
 * Method name prefixes that are tracked as write operations.
 * If a method call starts with any of these, it is recorded
 * as a write operation requiring user permission.
 */
const WRITE_METHOD_PREFIXES: string[] = [
  "add", "apply", "accept", "attach", "auto", "break", "change", "clear",
  "close", "connect", "convert", "copy", "cut", "delete", "detach",
  "disconnect", "distribute", "duplicate", "flash", "freeze", "hide",
  "increment", "indent", "insert", "merge", "move", "outdent", "pause",
  "protect", "refresh", "reject", "remove", "replace", "resize", "reset",
  "resume", "save", "scale", "set", "sort", "split", "suspend", "group",
  "unfreeze", "unprotect", "update",
];

/** Formatting sub-objects on the property chain */
const FORMATTING_SUB_OBJECTS: Record<string, string> = {
  font: "Modify font on",
  fill: "Modify fill on",
  format: "Modify format on",
  border: "Modify border on",
  borders: "Modify borders on",
  protection: "Modify protection on",
  paragraphFormat: "Modify paragraph on",
  lineFormat: "Modify line on",
  textFrame: "Modify text frame on",
};

/**
 * Check if a method name should be tracked as a write operation.
 */
function isWriteMethod(methodName: string): boolean {
  return (
    DESTRUCTIVE_METHOD_NAMES.has(methodName) ||
    WRITE_METHOD_PREFIXES.some((prefix) => methodName.startsWith(prefix))
  );
}

/**
 * Check if the current property chain includes a formatting sub-object.
 */
function isFormattingChain(chain: string[]): boolean {
  return chain.some((segment) => segment in FORMATTING_SUB_OBJECTS);
}

/**
 * Deeply validate a value for blocked formulas.
 * Recurses into arrays and objects up to MAX_FORMULA_VALIDATION_DEPTH.
 */
const proxyOriginals = new WeakMap<object, object>();

function validateFormulaValue(value: any, depth: number = 0): void {
  if (depth > MAX_FORMULA_VALIDATION_DEPTH) return;

  if (typeof value === "string") {
    if (containsBlockedFormula(value)) {
      throw new Error("IllegalAccessError: Method argument contains blocked formula function(s)");
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      validateFormulaValue(item, depth + 1);
    }
    return;
  }

  if (value && typeof value === "object" && !proxyOriginals.has(value)) {
    for (const v of Object.values(value)) {
      validateFormulaValue(v, depth + 1);
    }
  }
}

/**
 * Deep freeze a value to prevent mutation after it's been validated.
 * Only freezes plain objects and arrays.
 */
function deepFreeze(value: any, seen: WeakSet<object> = new WeakSet()): any {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) deepFreeze(item, seen);
    return Object.freeze(value);
  }

  if (Object.getPrototypeOf(value) === Object.prototype) {
    for (const v of Object.values(value)) deepFreeze(v, seen);
    return Object.freeze(value);
  }

  return value;
}


// ============================================================================
// PROXY INSTRUMENTATION: createInstrumentedProxy (q2 in minified)
// ============================================================================

/**
 * Unwrap a proxy to its original Office.js object (for passing to real APIs).
 */
function unwrapProxy(value: any): any {
  return value && typeof value === "object" && proxyOriginals.has(value)
    ? proxyOriginals.get(value)
    : value;
}

/**
 * Format a method call for the operation chain (e.g., "getRange(A1:B10)")
 */
function formatMethodCall(name: string, args: any[]): string {
  if (args.length === 0) return name;
  const first = args[0];
  const repr = typeof first === "string" ? first : JSON.stringify(first);
  return `${name}(${repr})`;
}

/**
 * Generate a human-readable warning string for an operation.
 */
function generateWarning(methodName: string, chain: string[]): string {
  // Extracts meaningful context from the chain for the permission UI
  // (simplified here — real implementation resolves ordinals, sheet names, etc.)
  const contextParts = chain.filter(Boolean).join(" → ");
  return `${methodName} on ${contextParts || "workbook"}`;
}

/**
 * Create an instrumented Proxy around an Office.js context object.
 *
 * This is the core sandbox mechanism. Every property access and method call
 * on the context goes through this proxy, which:
 *
 * 1. **Tracks operations** — builds a list of all write operations performed
 * 2. **Blocks dangerous APIs** — throws on access to blocked methods/properties
 * 3. **Validates formulas** — checks all formula values for blocked functions
 * 4. **Intercepts context.sync()** — pauses for user permission before flushing
 * 5. **Deep-freezes written values** — prevents post-validation mutation
 * 6. **Unwraps proxies** — extracts original objects when passing to real APIs
 *
 * @param target           The real Office.js object to wrap
 * @param operations       Accumulator for tracked operations (mutated in place)
 * @param chain            Current property access chain (for reporting)
 * @param permissionCheck  Callback invoked at context.sync() to check permissions
 */
function createInstrumentedProxy(
  target: any,
  operations: OperationRecord[],
  chain: string[],
  permissionCheck?: PermissionCheckCallback
): any {
  if (!target || typeof target !== "object") return target;

  // Arrays get a simpler proxy (only intercept nested object access)
  if (Array.isArray(target)) {
    const proxy = new Proxy(target, {
      get(arr, prop) {
        const value = Reflect.get(arr, prop);
        return value && typeof value === "object" && !Array.isArray(value)
          ? createInstrumentedProxy(value, operations, chain, permissionCheck)
          : value;
      },
    });
    proxyOriginals.set(proxy, target);
    return proxy;
  }

  // Full instrumented proxy for objects
  const proxy = new Proxy(Object.create(null), {
    /**
     * SET trap: intercept property writes
     * - Validates formulas in intercepted setters
     * - Deep-freezes the value after validation
     * - Tracks the operation for permission reporting
     */
    set(_proxyTarget, prop, value) {
      if (typeof prop === "string") {
        const interceptAction = INTERCEPTED_SETTERS.get(prop);
        if (interceptAction) {
          if (interceptAction === "block") {
            throw new Error(`IllegalAccessError: Writing to '${prop}' is blocked`);
          }
          // "validate" — check formulas then deep-freeze
          try {
            validateFormulaValue(value);
          } catch {
            throw new Error(
              `IllegalAccessError: Formula set via '${prop}' contains blocked function(s)`
            );
          }
          deepFreeze(value);
        }
      }

      // Track the operation for permission UI
      if (operations && typeof prop === "string") {
        if (TRACKED_SETTER_PROPERTIES.has(prop)) {
          operations.push({
            type: "setter",
            name: prop,
            chain: [...(chain ?? []), prop],
            isDestructive: false,
            warning: generateWarning(prop, chain ?? []),
          });
        } else if (isFormattingChain(chain ?? [])) {
          operations.push({
            type: "setter",
            name: prop,
            chain: [...(chain ?? []), prop],
            isDestructive: false,
            warning: generateWarning(prop, chain ?? []),
          });
        }
      }

      return Reflect.set(target, prop, value);
    },

    /**
     * GET trap: intercept property reads and method calls
     * - Blocks access to dangerous methods
     * - Intercepts context.sync() for permission gating
     * - Validates formula arguments to all method calls
     * - Tracks write method calls
     * - Recursively wraps returned objects
     */
    get(_proxyTarget, prop) {
      // Block dangerous methods
      if (typeof prop === "string" && BLOCKED_METHODS.has(prop)) {
        throw new Error(`IllegalAccessError: Access to '${prop}' is blocked`);
      }

      const value = Reflect.get(target, prop);

      if (typeof value === "function") {
        // Special handling for context.sync() — this is the permission gate
        if (operations && prop === "sync" && (chain ?? []).length === 0) {
          return async () => {
            const pendingOps = [...operations];
            if (pendingOps.length > 0 && permissionCheck) {
              const approved = await permissionCheck(pendingOps);
              if (!approved) {
                throw new Error("PermissionDenied: User denied permission");
              }
            }
            // Clear operations after approval
            operations.length = 0;
            return value.apply(target);
          };
        }

        // Regular method call wrapper
        return function (...args: any[]) {
          // Validate all arguments for blocked formulas (Excel only)
          if (typeof prop === "string" && typeof Excel !== "undefined") {
            for (const arg of args) {
              validateFormulaValue(arg);
            }
          }

          // Unwrap proxy arguments before passing to real Office.js APIs
          const unwrappedArgs = args.map((arg) =>
            arg && typeof arg === "object" && proxyOriginals.has(arg)
              ? proxyOriginals.get(arg)
              : arg
          );

          // Track write method calls
          if (operations && typeof prop === "string" && isWriteMethod(prop)) {
            operations.push({
              type: "method",
              name: prop,
              chain: [...(chain ?? []), formatMethodCall(prop, args)],
              isDestructive: DESTRUCTIVE_METHOD_NAMES.has(prop),
              warning: generateWarning(prop, chain ?? []),
            });
          }

          // Call the real method and wrap the result
          const result = value.apply(target, unwrappedArgs);
          return createInstrumentedProxy(
            result,
            operations,
            [...(chain ?? []), formatMethodCall(typeof prop === "string" ? prop : String(prop), args)],
            permissionCheck
          );
        };
      }

      // Recursively wrap nested objects
      if (value && typeof value === "object") {
        return createInstrumentedProxy(
          value,
          operations,
          [...(chain ?? []), prop as string],
          permissionCheck
        );
      }

      return value;
    },

    has(_proxyTarget, prop) {
      return Reflect.has(target, prop);
    },

    ownKeys(_proxyTarget) {
      return Reflect.ownKeys(target);
    },

    getOwnPropertyDescriptor(_proxyTarget, prop) {
      const desc = Object.getOwnPropertyDescriptor(target, prop);
      if (!desc) return desc;

      if ("value" in desc && desc.value !== null && typeof desc.value === "object") {
        return { enumerable: desc.enumerable, configurable: true };
      }
      if (typeof desc.value === "function" || "get" in desc || "set" in desc) {
        return { enumerable: desc.enumerable, configurable: true };
      }
      return { ...desc, configurable: true };
    },
  });

  proxyOriginals.set(proxy, target);
  return proxy;
}


// ============================================================================
// NAMESPACE BLOCKER: createBlockingProxy (Jm in minified)
// ============================================================================

/**
 * Create a proxy that blocks access to specific properties/sub-paths
 * on a namespace object (Office, Excel, etc.).
 *
 * Used to prevent AI-generated code from accessing dangerous APIs like:
 * - Office.context.ui.openBrowserWindow (open arbitrary URLs)
 * - Office.context.auth.getAccessToken (steal tokens)
 *
 * @param target     The real namespace object (e.g., Office)
 * @param blockedPaths  Dot-separated paths to block (e.g., "context.ui.openBrowserWindow")
 */
function createBlockingProxy(target: any, blockedPaths: string[]): any {
  const subBlocks = new Map<string, string[]>(); // prop -> remaining sub-paths
  const directBlocks = new Set<string>();          // directly blocked properties

  for (const path of blockedPaths) {
    const dotIdx = path.indexOf(".");
    if (dotIdx === -1) {
      directBlocks.add(path);
    } else {
      const prop = path.slice(0, dotIdx);
      const rest = path.slice(dotIdx + 1);
      if (!subBlocks.has(prop)) subBlocks.set(prop, []);
      subBlocks.get(prop)!.push(rest);
    }
  }

  return new Proxy(Object.create(null), {
    get(_proxyTarget, prop) {
      // Block direct access
      if (typeof prop === "string" && directBlocks.has(prop)) {
        throw new Error(`IllegalAccessError: Access to '${prop}' is blocked`);
      }

      const value = Reflect.get(target, prop);

      // Recursively block sub-paths
      if (typeof prop === "string" && subBlocks.has(prop) && value && typeof value === "object") {
        return createBlockingProxy(value, subBlocks.get(prop) ?? []);
      }

      return value;
    },
  });
}


// ============================================================================
// COMPARTMENT GLOBALS: Safe evaluation environment
// ============================================================================

/**
 * Base globals available inside the SES Compartment.
 * Notably:
 * - Reflect, Proxy, Compartment, harden, lockdown are ALL set to undefined
 *   to prevent sandbox escape
 * - Object is replaced with a safe subset (no defineProperty, etc.)
 */
function createBaseGlobals(): Record<string, any> {
  return {
    console,
    Math,
    Date,
    DOMParser: typeof DOMParser !== "undefined" ? DOMParser : undefined,
    XMLSerializer: typeof XMLSerializer !== "undefined" ? XMLSerializer : undefined,
    // BLOCKED — set to undefined to prevent sandbox escape:
    Reflect: undefined,
    Proxy: undefined,
    Object: createSafeObject(),
    Compartment: undefined,
    harden: undefined,
    lockdown: undefined,
  };
}

/**
 * Office.js-specific globals added to the Compartment.
 * Each namespace is wrapped in a blocking proxy.
 */
function createOfficeGlobals(
  permissionCheck?: PermissionCheckCallback
): Record<string, any> {
  return {
    Office: typeof Office !== "undefined"
      ? createBlockingProxy(Office, BLOCKED_OFFICE_APIS)
      : undefined,
    Excel: typeof Excel !== "undefined"
      ? createBlockingProxy(Excel, ["run"])
      : undefined,
    Word: typeof Word !== "undefined"
      ? createBlockingProxy(Word, ["run"])
      : undefined,
    PowerPoint: typeof PowerPoint !== "undefined"
      ? createBlockingProxy(PowerPoint, ["run"])
      : undefined,
  };
}


// ============================================================================
// JIT CODE COMPILATION: compileSandboxedCode (CCe in minified)
// ============================================================================

/**
 * Compile AI-generated Office.js code into a sandboxed async function.
 *
 * The code runs inside:
 * 1. A SES Compartment with restricted globals
 * 2. An instrumented Proxy around the Excel RequestContext
 * 3. Timeout protection via the deadline mechanism
 *
 * @param code            The raw JS code body from the AI
 * @param permissionCheck Optional callback for context.sync() permission gating
 * @returns An async function that accepts an Office.js context
 */
function compileSandboxedCode(
  code: string,
  permissionCheck?: PermissionCheckCallback
): (context: any) => Promise<any> {
  initializeLockdown();

  const compartment = new (globalThis as any).Compartment({
    ...createBaseGlobals(),
    ...createOfficeGlobals(permissionCheck),
  });

  // Wrap the code as an async function receiving context
  const wrappedCode = "(async function(context) { " + code + " })";
  const sandboxedFn = compartment.evaluate(wrappedCode);

  // Return a function that instruments the context before passing it in
  return async (context: any) => {
    return sandboxedFn(
      createInstrumentedProxy(context, [], [], permissionCheck)
    );
  };
}


// ============================================================================
// JIT CODE EXECUTION: executeJitCode (bZ in minified)
// ============================================================================

/**
 * Map of Office host → run function.
 */
const HOST_RUNNERS: Record<string, (fn: (context: any) => Promise<any>) => Promise<any>> = {
  Excel: (fn) => safeOfficeRun(Excel.run, fn),
  Word: (fn) => safeOfficeRun(Word.run, fn),
  PowerPoint: (fn) => safeOfficeRun(PowerPoint.run, fn),
};

/**
 * Run an Office.js operation with a timeout for Online environments.
 */
function safeOfficeRun(
  runFn: (fn: (context: any) => Promise<any>) => Promise<any>,
  callback: (context: any) => Promise<any>
): Promise<any> {
  // On Office Online, wrap in a timeout chain to prevent hanging
  if (getHostPlatform() !== "OfficeOnline") {
    return runFn(callback);
  }

  // Serialize concurrent operations for Office Online
  return runFn(callback); // simplified — real impl uses promise chaining + timeout
}

/**
 * Execute AI-generated Office.js code inside the full sandbox.
 *
 * Complete flow:
 * 1. Determine the Office host (Excel, Word, PowerPoint)
 * 2. Compile the code in a SES Compartment with restricted globals
 * 3. Wrap the context in an instrumented Proxy
 * 4. Execute with a deadline timeout (90 seconds)
 * 5. At context.sync(), pause for user permission if operations were tracked
 * 6. Return the result as a serializable JSON object
 *
 * @param code             The JS code to execute
 * @param permissionCheck  Callback to ask user for permission at sync()
 */
async function executeJitCode(
  code: string,
  permissionCheck?: PermissionCheckCallback
): Promise<{ success: boolean; result?: any; error?: string }> {
  const host = Office.context.host;
  const runner = HOST_RUNNERS[host as string];

  if (!runner) {
    throw new Error(
      JSON.stringify({ success: false, error: `UnsupportedHostError: ${host}` })
    );
  }

  // For PowerPoint Online, special handling for sync timing
  const isPptOnline =
    typeof Office !== "undefined" &&
    host === Office.HostType.PowerPoint &&
    getHostPlatform() === "OfficeOnline";

  try {
    const result = await runner(async (context: any) => {
      // Create deadline timer
      const { run: runWithDeadline, exclude: pauseTimer } = createDeadline(JIT_TIMEOUT);

      // Compile the code in the sandbox
      const sandboxedFn = compileSandboxedCode(
        code,
        permissionCheck
          ? (operations) =>
              pauseTimer(async () => {
                // For PPT Online, sync before permission check to flush pending state
                if (isPptOnline) await context.sync();
                return permissionCheck(operations);
              })
          : undefined
      );

      // Execute with deadline
      return runWithDeadline(() => sandboxedFn(context));
    });

    return {
      success: true,
      result: result !== undefined ? JSON.parse(JSON.stringify(result)) : undefined,
    };
  } catch (e: any) {
    const debugInfo = e.debugInfo || {};
    throw new Error(
      JSON.stringify({ success: false, error: e.message, ...debugInfo })
    );
  }
}

/**
 * Create a deadline timer that throws TimeoutError if exceeded.
 * The `exclude` function pauses the timer during async operations
 * (like waiting for user permission).
 */
function createDeadline(timeoutMs: number): {
  run: <T>(fn: () => Promise<T>) => Promise<T>;
  exclude: <T>(fn: () => Promise<T>) => Promise<T>;
} {
  let pausedDuration = 0;
  let startTime: number;
  let timerHandle: any;
  let rejectFn: ((error: Error) => void) | null = null;
  let completed = false;

  function check(): void {
    clearTimeout(timerHandle);
    if (completed) return;

    const remaining = timeoutMs - (Date.now() - startTime - pausedDuration);
    if (remaining <= 0) {
      rejectFn?.(new TimeoutError());
    } else {
      timerHandle = setTimeout(check, remaining);
    }
  }

  return {
    run<T>(fn: () => Promise<T>): Promise<T> {
      return new Promise<T>((resolve, reject) => {
        rejectFn = reject;
        startTime = Date.now();
        check();

        fn().then(
          (result) => { completed = true; clearTimeout(timerHandle); resolve(result); },
          (error) => { completed = true; clearTimeout(timerHandle); reject(error); }
        );
      });
    },
    exclude<T>(fn: () => Promise<T>): Promise<T> {
      const pauseStart = Date.now();
      return fn().finally(() => {
        pausedDuration += Date.now() - pauseStart;
      });
    },
  };
}

class TimeoutError extends Error {
  constructor(message = "The operation was timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}


// ============================================================================
// TOOL IMPLEMENTATIONS (STe in minified)
// ============================================================================

const toolImplementations: Record<
  string,
  (input: ToolInput, commands: CommandImplementations) => Promise<any>
> = {

  // --------------------------------------------------------------------------
  // get_cell_ranges
  // --------------------------------------------------------------------------
  get_cell_ranges: async (input, commands) => {
    const fileData = await commands.getFileData({});
    if (!fileData.success) throw new Error(fileData.error || "Failed to get file data for pagination");

    const sheetMeta = fileData.sheetsMetadata.find((s) => s.id === input.sheetId);
    if (!sheetMeta) throw new Error(`NotFoundError: Worksheet with ID ${input.sheetId} not found`);

    const dimensions = { rows: sheetMeta.maxRows, columns: sheetMeta.maxColumns };
    const cellLimit = Math.min(input.cellLimit ?? DEFAULT_CELL_LIMIT, DEFAULT_CELL_LIMIT);

    // Expand and normalize ranges
    const expandedRanges = expandRanges(input.ranges!, /* maxRangeSize, rows, cols */);

    const worksheet: any = {
      sheetId: input.sheetId,
      name: sheetMeta.name,
      cells: {},
      dimension: dimensions,
    };

    if (dimensions.rows === 0 || dimensions.columns === 0) {
      return { success: true, hasMore: false, worksheet: formatWorksheet(worksheet) };
    }

    let cellCount = 0;
    const remaining: string[] = [];

    // Fetch ranges in batches of 3
    async function fetchRange(rangeStr: string) {
      const { startRow, endRow, startColumn, endColumn } = parseRange(rangeStr, dimensions.rows, dimensions.columns);
      const sheetData = await commands.getSheet({
        sheetId: input.sheetId!,
        startRow,
        endRow,
        includeStyles: input.includeStyles,
      });
      if (!sheetData.success) throw new Error(sheetData.error || `Failed to get sheet data for range ${rangeStr}`);
      return { startRow, endRow, startColumn, endColumn, cells: sheetData.data, notes: sheetData.notes || {} };
    }

    function processRange(rangeData: any): void {
      const { cells = [], startRow, endRow, startColumn, endColumn, notes = {} } = rangeData;
      const propertiesToInclude = input.includeStyles
        ? ["value", "formula", "note", "cellStyles", "borderStyles"]
        : ["value", "formula", "note"];

      for (let i = 0; i < cells.length; i++) {
        const row = startRow + i;
        const rowCells = cells[i]?.slice(startColumn - 1, endColumn) || [];
        for (const cell of rowCells) {
          if (cellCount >= cellLimit) {
            // Truncate: push remaining as a new range
            remaining.push(`${columnToLetter(startColumn)}${row}:${columnToLetter(endColumn)}${endRow}`);
            return;
          }
          worksheet.cells[cell.a1] = extractCellProperties(cell, propertiesToInclude);
          cellCount += isCellEmpty(cell) ? 0 : 1;
        }
      }

      // Merge notes
      for (const [a1, noteText] of Object.entries(notes)) {
        const { row, col } = parseA1(a1);
        if (row < startRow || row > endRow || col < startColumn || col > endColumn) continue;
        worksheet.cells[a1] ??= {};
        worksheet.cells[a1].note = noteText;
      }
    }

    // Batch fetch with concurrency of 3
    let idx = 0;
    while (cellCount < cellLimit && idx < expandedRanges.length) {
      const batchEnd = Math.min(idx + 3, expandedRanges.length);
      const batch = expandedRanges.slice(idx, batchEnd);
      const results = await Promise.allSettled(batch.map(fetchRange));

      const [fulfilled, _rejected] = partitionResults(results);
      if (fulfilled.length === 0) {
        throw new Error("All range fetches failed");
      }

      for (const result of fulfilled) {
        if (result.status === "fulfilled") processRange(result.value);
      }

      idx = batchEnd;
    }

    const allRemaining = [...remaining, ...expandedRanges.slice(idx)];
    const formatted = formatWorksheet(worksheet);

    return {
      success: true,
      hasMore: allRemaining.length > 0,
      nextRanges: allRemaining.length > 0 ? allRemaining : undefined,
      worksheet: {
        ...formatted,
        styles: input.includeStyles ? formatted.styles : undefined,
        borders: input.includeStyles ? formatted.borders : undefined,
      },
    };
  },

  // --------------------------------------------------------------------------
  // get_range_as_csv
  // --------------------------------------------------------------------------
  get_range_as_csv: async (input, commands) => {
    const fileData = await commands.getFileData({});
    if (!fileData.success) throw new Error(fileData.error || "Failed to get file data");

    const sheetMeta = fileData.sheetsMetadata.find((s) => s.id === input.sheetId);
    if (!sheetMeta) throw new Error(`NotFoundError: Worksheet with ID ${input.sheetId} not found`);

    const dimensions = { rows: sheetMeta.maxRows, columns: sheetMeta.maxColumns };
    const { startRow, endRow: rawEndRow, startColumn, endColumn } = parseRange(
      input.range!,
      dimensions.rows,
      dimensions.columns
    );

    const maxRows = input.includeHeaders ? (input.maxRows ?? 500) + 1 : (input.maxRows ?? 500);
    const endRow = Math.min(rawEndRow, startRow + maxRows - 1);
    const hasMore = rawEndRow > endRow;

    const sheetData = await commands.getSheet({
      sheetId: input.sheetId!,
      startRow,
      endRow,
      includeStyles: false,
    });
    if (!sheetData.success) throw new Error(sheetData.error || "Failed to get sheet data");

    // Build CSV
    const rows: string[] = [];
    const numColumns = endColumn - startColumn + 1;

    for (let i = 0; i < sheetData.data.length; i++) {
      const rowCells = sheetData.data[i]?.slice(startColumn - 1, endColumn) || [];
      const values: string[] = [];

      for (let j = 0; j < numColumns; j++) {
        let val: any = rowCells[j]?.value ?? "";
        if (typeof val === "string" && (val.includes(",") || val.includes('"') || val.includes("\n"))) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        values.push(String(val));
      }

      rows.push(values.join(","));
    }

    const dataRowCount = input.includeHeaders ? rows.length - 1 : rows.length;

    return {
      success: true,
      csv: rows.join("\n"),
      rowCount: dataRowCount,
      columnCount: numColumns,
      hasMore,
      sheetName: sheetMeta.name,
    };
  },

  // --------------------------------------------------------------------------
  // search_data
  // --------------------------------------------------------------------------
  search_data: async (input, commands) => {
    const options = input.options || {};
    const offset = input.offset || 0;
    const maxResults = options.maxResults || 500;

    // Try native search first (faster for non-regex)
    if (commands.searchCells && !options.useRegex) {
      const result = await commands.searchCells({
        sheetId: input.sheetId,
        searchTerm: input.searchTerm!,
        matchCase: options.matchCase ?? false,
        matchEntireCell: options.matchEntireCell ?? false,
      });

      if (result.success) {
        const page = result.matches.slice(offset, offset + maxResults);
        const hasMore = result.matches.length > offset + maxResults;
        return {
          success: true,
          matches: page,
          totalFound: result.totalFound,
          returned: page.length,
          offset,
          hasMore,
          searchTerm: input.searchTerm,
          searchScope: input.sheetId ? `Sheet ${input.sheetId}` : "All sheets",
          nextOffset: hasMore ? offset + maxResults : null,
        };
      }
    }

    // Fallback: manual search through sheet data
    const matches: any[] = [];

    function searchRows(rows: CellData[][], sheetName: string, sheetId: number): void {
      let rowIdx = 0;
      for (const row of rows) {
        let colIdx = 0;
        for (const cell of row) {
          const text = cell.value ? String(cell.value) : "";
          const formula = cell.formula || "";
          const target = options.matchFormulas ? formula : text;
          let isMatch = false;

          if (options.useRegex) {
            isMatch = new RegExp(input.searchTerm!, options.matchCase ? "g" : "gi").test(target);
          } else if (options.matchEntireCell) {
            isMatch = options.matchCase
              ? target === input.searchTerm
              : target.toLowerCase() === input.searchTerm!.toLowerCase();
          } else {
            isMatch = options.matchCase
              ? target.includes(input.searchTerm!)
              : target.toLowerCase().includes(input.searchTerm!.toLowerCase());
          }

          if (isMatch && matches.length < offset + maxResults) {
            matches.push({
              sheetName,
              sheetId,
              a1: cell.a1,
              value: cell.value,
              formula: cell.formula || null,
              row: rowIdx + 1,
              column: colIdx + 1,
            });
          }
          colIdx++;
        }
        rowIdx++;
      }
    }

    // Determine sheets to search
    const sheets: { id: number }[] = [];
    if (input.sheetId) {
      sheets.push({ id: input.sheetId });
    } else {
      const fileData = await commands.getFileData({});
      if (fileData.success) sheets.push(...fileData.sheetsMetadata);
    }

    // Search each sheet in chunks of 1000 rows
    for (const sheet of sheets) {
      const fileData = await commands.getFileData({});
      if (!fileData.success) continue;
      const meta = fileData.sheetsMetadata.find((s) => s.id === sheet.id);
      if (!meta || meta.maxRows === 0) continue;

      const chunkSize = 1000;
      let startRow = 1;
      while (startRow <= meta.maxRows && matches.length < offset + maxResults) {
        const endRow = Math.min(startRow + chunkSize - 1, meta.maxRows);
        const data = await commands.getSheet({ sheetId: sheet.id, startRow, endRow });
        if (data.success && data.data) {
          const sheetName = data.metadata?.name || "Unknown";
          searchRows(data.data, sheetName, sheet.id);
        }
        startRow += chunkSize;
      }
    }

    const page = matches.slice(offset, offset + maxResults);
    const hasMore = matches.length > offset + maxResults;

    return {
      success: true,
      matches: page,
      totalFound: matches.length,
      returned: page.length,
      offset,
      hasMore,
      searchTerm: input.searchTerm,
      searchScope: input.sheetId ? `Sheet ${input.sheetId}` : "All sheets",
      nextOffset: hasMore ? offset + maxResults : null,
    };
  },

  // --------------------------------------------------------------------------
  // set_cell_range
  // --------------------------------------------------------------------------
  set_cell_range: async (input, commands) => {
    const messages: string[] = [];

    // Auto-adjust range dimensions to match cells array
    const adjusted = adjustRangeDimensions(input.range!, input.cells!);
    if (adjusted.adjusted) {
      input.range = adjusted.range;
      messages.push(adjusted.reason!);
    }

    const { startRow, endRow, startColumn, endColumn } = parseRange(input.range!);

    // Build cell list and track formula cells
    const cellsToWrite: CellData[] = [];
    const formulaCells: string[] = [];
    const dataCells: string[] = [];

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startColumn; col <= endColumn; col++) {
        const a1 = columnToLetter(col) + row;
        const rowIdx = row - startRow;
        const colIdx = col - startColumn;

        if (input.cells?.[rowIdx]?.[colIdx]) {
          const cell = input.cells[rowIdx][colIdx];
          cellsToWrite.push({
            a1,
            value: cell.value,
            formula: cell.formula,
            note: cell.note,
            cellStyles: cell.cellStyles,
            borderStyles: cell.borderStyles,
          });

          if (cell.formula) formulaCells.push(a1);
          if (cell.value !== undefined || cell.formula !== undefined) dataCells.push(a1);
        }
      }
    }

    // OVERWRITE PROTECTION: check if target cells have existing data
    if (!input.allow_overwrite && dataCells.length > 0) {
      try {
        let minRow = Infinity;
        let maxRow = 0;
        for (const a1 of dataCells) {
          const match = a1.match(/(\d+)/);
          if (match) {
            const row = parseInt(match[1], 10);
            minRow = Math.min(minRow, row);
            maxRow = Math.max(maxRow, row);
          }
        }

        if (minRow !== Infinity) {
          const existing = await commands.getSheet({
            sheetId: input.sheetId!,
            startRow: minRow,
            endRow: maxRow,
          });

          if ("success" in existing && existing.success && existing.data) {
            // Build a map of existing cells
            const cellMap = new Map<string, CellData>();
            for (const row of existing.data) {
              for (const cell of row) {
                if (cell.a1) cellMap.set(cell.a1, cell);
              }
            }

            // Find non-empty cells that would be overwritten
            const conflicts: string[] = [];
            for (const a1 of dataCells) {
              const existing = cellMap.get(a1);
              if (existing && !isCellEmpty(existing)) {
                conflicts.push(a1);
              }
            }

            if (conflicts.length > 0) {
              const preview = conflicts.slice(0, 5).join(", ");
              const extra = conflicts.length - 5;
              const suffix = extra > 0 ? `${preview}... (and ${extra} more)` : preview;
              throw new Error(
                `Would overwrite ${conflicts.length} non-empty cell${conflicts.length > 1 ? "s" : ""}: ${suffix}. ` +
                `To proceed with overwriting existing data, retry with allow_overwrite set to true.`
              );
            }
          }
        }
      } catch (e: any) {
        if (e instanceof Error && e.message.includes("Would overwrite")) throw e;
        // Log but continue — protection check failure shouldn't block the write
        console.error("Failed to validate overwrite protection, proceeding with write", e);
      }
    }

    // WRITE the cells
    const writeResult = await commands.setCells({ sheetId: input.sheetId!, cells: cellsToWrite });
    if (!("success" in writeResult) || !writeResult.success) {
      throw new Error("error" in writeResult ? writeResult.error : "Unknown error");
    }

    // COPY TO RANGE (optional)
    if (input.copyToRange) {
      const copyResult = await commands.copyTo({
        sheetId: input.sheetId!,
        sourceRange: input.range!,
        destinationRange: input.copyToRange,
      });
      if (!("success" in copyResult) || !copyResult.success) {
        throw new Error("error" in copyResult ? copyResult.error : "Failed to copy range");
      }
    }

    // RESIZE (optional)
    if (input.resizeWidth || input.resizeHeight) {
      const resizeResult = await commands.resizeRange({
        sheetId: input.sheetId!,
        range: input.range!,
        width: input.resizeWidth,
        height: input.resizeHeight,
      });
      if (!("success" in resizeResult) || !resizeResult.success) {
        throw new Error("error" in resizeResult ? resizeResult.error : "Failed to resize range");
      }
    }

    // READ BACK formula results
    const formulaResults: Record<string, number | string> = {};
    if (formulaCells.length > 0) {
      try {
        let minRow = Infinity;
        let maxRow = 0;
        for (const a1 of formulaCells) {
          const match = a1.match(/(\d+)/);
          if (match) {
            const row = parseInt(match[1], 10);
            minRow = Math.min(minRow, row);
            maxRow = Math.max(maxRow, row);
          }
        }
        if (minRow === Infinity) { minRow = 1; maxRow = 1; }

        const readBack = await commands.getSheet({
          sheetId: input.sheetId!,
          startRow: minRow,
          endRow: maxRow,
        });

        if ("success" in readBack && readBack.success && readBack.data) {
          const valueMap = new Map<string, any>();
          for (const row of readBack.data) {
            for (const cell of row) {
              if (cell.a1 && cell.value !== undefined) valueMap.set(cell.a1, cell.value);
            }
          }

          for (const a1 of formulaCells) {
            const val = valueMap.get(a1);
            if (val !== undefined) {
              if ((typeof val === "string" && val.startsWith("#")) || typeof val === "number") {
                formulaResults[a1] = val;
              } else {
                formulaResults[a1] = String(val);
              }
            }
          }
        }
      } catch (e: any) {
        console.error("Failed to get formula results", e);
      }
    }

    return {
      success: true,
      formula_results: Object.keys(formulaResults).length > 0 ? formulaResults : undefined,
      messages: messages.length > 0 ? messages : undefined,
    };
  },

  // --------------------------------------------------------------------------
  // modify_sheet_structure
  // --------------------------------------------------------------------------
  modify_sheet_structure: async (input, commands) => {
    const result = await commands.modifySheetStructure(input);
    if (!("success" in result) || !result.success) {
      throw new Error("error" in result ? result.error : "Unknown error");
    }
    return { success: true };
  },

  // --------------------------------------------------------------------------
  // modify_workbook_structure
  // --------------------------------------------------------------------------
  modify_workbook_structure: async (input, commands) => {
    const result = await commands.modifyWorkbookStructure(input);
    if (!("success" in result) || !result.success) {
      throw new Error("error" in result ? result.error : "Unknown error");
    }

    let message = "";
    switch (input.operation) {
      case "create":
        message = `Created new sheet "${input.sheetName}"`;
        break;
      case "delete":
        message = `Deleted sheet with ID ${input.sheetId}`;
        break;
      case "rename":
        message = `Renamed sheet to "${input.newName}"`;
        break;
      case "duplicate":
        message = `Duplicated sheet${input.newName ? ` as "${input.newName}"` : ""}`;
        break;
    }

    return {
      success: true,
      sheetId: result.sheetId,
      sheetName: input.newName || input.sheetName,
      rows: input.operation === "create" ? (input as any).rows || 1000 : undefined,
      columns: input.operation === "create" ? (input as any).columns || 26 : undefined,
      message,
    };
  },

  // --------------------------------------------------------------------------
  // copy_to
  // --------------------------------------------------------------------------
  copy_to: async (input, commands) => {
    const result = await commands.copyTo({
      sheetId: input.sheetId!,
      sourceRange: input.sourceRange!,
      destinationRange: input.destinationRange!,
    });
    if (!("success" in result) || !result.success) {
      throw new Error("error" in result ? result.error : "Unknown error");
    }
    return { success: true };
  },

  // --------------------------------------------------------------------------
  // get_all_objects
  // --------------------------------------------------------------------------
  get_all_objects: async (input, commands) => {
    const [pivots, charts] = await Promise.all([
      commands.getPivotTables({}),
      commands.getCharts({}),
    ]);

    if (!pivots.success) throw new Error(pivots.error);
    if (!charts.success) throw new Error(charts.error);

    let objects = [...pivots.results, ...charts.results];
    if (input.sheetId) objects = objects.filter((o) => o.sheetId === input.sheetId);
    if (input.id) objects = objects.filter((o) => o.id === input.id);

    return { success: true, objects };
  },

  // --------------------------------------------------------------------------
  // modify_object
  // --------------------------------------------------------------------------
  modify_object: async (input, commands) => {
    // Dispatch to the correct backend method based on operation + objectType
    // e.g., "createPivotTable", "updateChart", "deleteChart"
    const methodName = `${input.operation}${capitalize(input.objectType!)}`;
    const properties = input.properties || {};

    const params = {
      id: input.id,
      sheetId: input.sheetId,
      properties: { ...properties, sheetId: input.sheetId },
    };

    // Validate input against schema (simplified)
    const result = await commands[methodName](params);
    if (!result.success) throw new Error(result.error);

    return result;
  },

  // --------------------------------------------------------------------------
  // resize_range
  // --------------------------------------------------------------------------
  resize_range: async (input, commands) => {
    const result = await commands.resizeRange({
      sheetId: input.sheetId!,
      range: input.range,
      width: input.width,
      height: input.height,
    });
    if (!("success" in result) || !result.success) {
      throw new Error("error" in result ? result.error : "Unknown error");
    }
    return { success: true };
  },

  // --------------------------------------------------------------------------
  // clear_cell_range
  // --------------------------------------------------------------------------
  clear_cell_range: async (input, commands) => {
    const result = await commands.clearCellRange({
      sheetId: input.sheetId!,
      range: input.range!,
      clearType: input.clearType,
    });
    if (!("success" in result) || !result.success) {
      throw new Error("error" in result ? result.error : "Unknown error");
    }
    return { success: true };
  },
};


// ============================================================================
// PERMISSION SYSTEM: Tool dispatch with approval flow
// ============================================================================

/**
 * The Agent's onToolInit handler — the central permission gating logic.
 *
 * Called when the AI model requests a tool call. This determines whether
 * the tool needs user permission and what kind of approval flow is needed.
 *
 * Flow:
 * 1. Add message to UI as "pending"
 * 2. SECURITY CHECK: block set_cell_range with dangerous formulas
 * 3. PERMISSION CHECK: if tool is a write tool AND mode is "ask", show dialog
 * 4. JIT PERMISSION: for execute_office_js, return a callback for sync()-time approval
 */
async function onToolInit(
  toolCall: ToolCall,
  surface: string,
  permissionMode: PermissionMode,
  waitForApproval: (
    toolId: string,
    toolName: string,
    toolInput: any,
    operations?: OperationRecord[]
  ) => Promise<boolean>,
  uiState: any
): Promise<((operations: OperationRecord[]) => Promise<boolean>) | undefined> {
  // Add to UI
  uiState.addMessage({
    uuid: toolCall.id,
    timestamp: new Date(),
    type: "tool",
    name: toolCall.name,
    status: "pending",
    input: toolCall.input,
  });

  // ask_user_question (elicitation) never needs permission
  if (toolCall.name === "ask_user_question") return;

  const writeTools = WRITE_TOOLS_BY_SURFACE[surface] || [];

  // SECURITY: Block formulas with dangerous functions
  if (toolCall.name === "set_cell_range" && inputContainsBlockedFormulas(toolCall.input)) {
    const blockedFns = extractBlockedFunctions(toolCall.input).join(", ");
    uiState.updateMessage(toolCall.id, { status: "rejected" });
    throw new Error(
      `ToolExecutionBlocked: Formula contains blocked function(s) or DDE injection patterns ` +
      `that cannot be executed: ${blockedFns}. These functions can make network requests ` +
      `or access external resources.`
    );
  }

  // PERMISSION: Structured write tools
  const needsPermission = writeTools.includes(toolCall.name) && permissionMode === "ask";

  if (needsPermission) {
    const approved = await waitForApproval(toolCall.id, toolCall.name, toolCall.input);
    if (!approved) {
      uiState.updateMessage(toolCall.id, { status: "rejected" });
      throw new Error("ToolExecutionRejected: User denied permission to execute the tool.");
    }
  }

  // JIT PERMISSION: execute_office_js gets a callback for sync()-time approval
  // (but not in dangerously-skip mode)
  const jitTools: Record<string, any> = {
    execute_office_js: true,
    // also execute_apps_script for Google
  };

  if (toolCall.name in jitTools && permissionMode !== "dangerously-skip") {
    return async (operations: OperationRecord[]) => {
      return waitForApproval(toolCall.id, toolCall.name, toolCall.input, operations);
    };
  }
}

/**
 * The approval promise handler.
 *
 * Handles three permission modes:
 * - "dangerously-skip": always approve immediately (env var override only)
 * - "skip": approve unless operations contain destructive actions
 * - "ask": show the permission dialog and wait for user response
 *
 * Approvals are serialized to prevent concurrent permission dialogs.
 */
async function waitForApproval(
  toolId: string,
  toolName: string,
  toolInput: any,
  operations?: OperationRecord[],
  permissionModeGetter: () => PermissionMode = () => "ask",
  setPermissionRequest: (request: any) => void = () => {},
  clearPermissionRequest: () => void = () => {},
  pendingApproval: Promise<boolean> = Promise.resolve(true)
): Promise<boolean> {
  const mode = permissionModeGetter();

  // Fast paths
  if (mode === "dangerously-skip") return true;
  if (mode === "skip" && !operations?.some((op) => op.isDestructive)) return true;

  // Serialize: wait for any previous approval to complete, then show dialog
  return pendingApproval
    .catch(() => {})
    .then(
      () =>
        new Promise<boolean>((resolve) => {
          const currentMode = permissionModeGetter();
          if (currentMode === "dangerously-skip") { resolve(true); return; }
          if (currentMode === "skip" && !operations?.some((op) => op.isDestructive)) {
            resolve(true);
            return;
          }

          setPermissionRequest({
            toolCallId: toolId,
            toolName,
            toolInput,
            operations,
            approve: () => { clearPermissionRequest(); resolve(true); },
            deny: () => { clearPermissionRequest(); resolve(false); },
          });
        })
    );
}


// ============================================================================
// TOOL LIST GENERATION
// ============================================================================

/**
 * Generate the complete tool list sent to the Claude API.
 * Includes structured tools + built-in tools + JIT fallback.
 */
function generateToolList(): any[] {
  // Structured spreadsheet tools
  const structuredTools = Object.entries(toolImplementations).map(([name, _impl]) => ({
    type: "custom",
    name,
    // description and input_schema come from the schema definitions (mA)
  }));

  // Built-in tools
  const builtinTools = [
    generateAskUserQuestionTool(),
    { type: "web_search_20250305", name: "web_search" },
    { type: "code_execution_20250825", name: "code_execution" },
  ];

  return [...structuredTools, ...builtinTools];
}

function generateAskUserQuestionTool(): any {
  return {
    type: "custom",
    name: "ask_user_question",
    description: "Present tappable options to gather user preferences before starting work...",
    input_schema: {
      type: "object",
      // ... schema from LZ
    },
  };
}


// ============================================================================
// HELPER FUNCTIONS (stubs — actual implementations are in the bundle)
// ============================================================================

/** Convert column number to letter (1 → A, 27 → AA) */
function columnToLetter(col: number): string {
  let result = "";
  while (col > 0) {
    col--;
    result = String.fromCharCode(65 + (col % 26)) + result;
    col = Math.floor(col / 26);
  }
  return result;
}

/** Parse A1 notation to row/col numbers */
function parseA1(a1: string): { row: number; col: number } {
  const match = a1.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error(`Invalid A1 notation: ${a1}`);
  let col = 0;
  for (const ch of match[1]) col = col * 26 + ch.charCodeAt(0) - 64;
  return { row: parseInt(match[2], 10), col };
}

/** Check if a cell is empty (no value, no formula) */
function isCellEmpty(cell: CellData): boolean {
  return (
    (cell.value === undefined || cell.value === null || cell.value === "") &&
    (!cell.formula || cell.formula === "")
  );
}

/** Capitalize first letter */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Get the host platform type */
declare function getHostPlatform(): string;

// Placeholder implementations for range parsing, formatting, etc.
declare function parseRange(range: string, maxRows?: number, maxCols?: number): {
  startRow: number; endRow: number; startColumn: number; endColumn: number;
};
declare function expandRanges(ranges: string[], ...args: any[]): string[];
declare function adjustRangeDimensions(range: string, cells: any[][]): {
  adjusted: boolean; range: string; reason?: string;
};
declare function formatWorksheet(ws: any): any;
declare function extractCellProperties(cell: CellData, props: string[]): any;
declare function partitionResults<T>(results: PromiseSettledResult<T>[]): [PromiseFulfilledResult<T>[], PromiseRejectedResult[]];


// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Tool implementations
  toolImplementations,

  // Sandbox
  initializeLockdown,
  compileSandboxedCode,
  executeJitCode,
  createInstrumentedProxy,
  createBlockingProxy,

  // Security
  containsBlockedFormula,
  inputContainsBlockedFormulas,
  extractBlockedFunctions,
  BLOCKED_FORMULA_FUNCTIONS,
  BLOCKED_FUNCTIONS_SET,
  BLOCKED_OFFICE_APIS,
  BLOCKED_METHODS,
  DESTRUCTIVE_METHOD_NAMES,
  WRITE_METHOD_PREFIXES,
  WRITE_TOOLS_SHEET,

  // Permission
  onToolInit,
  waitForApproval,

  // Tool list
  generateToolList,

  // Types
  PermissionMode,
  OperationRecord,
  ToolCall,
  ToolInput,
};
