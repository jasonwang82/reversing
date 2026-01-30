!(function () {
  try {
    var e =
        "undefined" != typeof window
          ? window
          : "undefined" != typeof global
            ? global
            : "undefined" != typeof globalThis
              ? globalThis
              : "undefined" != typeof self
                ? self
                : {},
      n = new e.Error().stack;
    n &&
      ((e._posthogChunkIds = e._posthogChunkIds || {}),
      (e._posthogChunkIds[n] = "019c0cd3-ceb1-79c0-a5ab-b9767f0bc46e"));
  } catch (e) {}
})();
("use strict");
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [49183],
  {
    2845: (e, t, r) => {
      function o(e) {
        let t,
          r = "",
          o = e + 1;
        for (; o > 0; )
          ((r = String.fromCharCode(65 + (t = (o - 1) % 26)) + r),
            (o = Math.floor((o - t) / 26)));
        return r;
      }
      r.d(t, {
        Ge: () => d,
        IB: () => s,
        K7: () => g,
        MU: () => u,
        VW: () => l,
        dE: () => o,
        lJ: () => p,
        p: () => h,
        pC: () => a,
        tS: () => S,
        yn: () => c,
        zj: () => m,
      });
      let a = (e, t) => {
          let r = o(t);
          return "".concat(r).concat(e + 1);
        },
        n = /^([A-Z]+)([0-9]+)$/;
      function i(e) {
        let t,
          r = e;
        if (e.includes("!")) {
          let o = e.split("!");
          2 === o.length &&
            ((t = o[0]),
            (r = o[1]),
            t.startsWith("'") &&
              t.endsWith("'") &&
              (t = t.slice(1, -1).replace(/''/g, "'")));
        }
        return {
          sheetName: t,
          rest: r,
        };
      }
      function l(e) {
        let { sheetName: t, rest: r } = i(e),
          o = r.match(n);
        if (!o) throw Error("Invalid Excel address: ".concat(e));
        let a = o[1],
          l = o[2],
          s = -1;
        for (let e = 0; e < a.length; e++)
          s = (s + 1) * 26 + (a.charCodeAt(e) - 65);
        let c = {
          row: parseInt(l, 10) - 1,
          col: s,
        };
        return (t && (c.sheetName = t), c);
      }
      function s(e) {
        let { sheetName: t, rest: r } = i(e),
          o = r.split(":"),
          a = null,
          n = null;
        2 !== o.length ? (n = a = l(r)) : ((a = l(o[0])), (n = l(o[1])));
        let s = {
          startRow: a.row,
          startCol: a.col,
          endRow: n.row,
          endCol: n.col,
        };
        if (
          (t && (s.sheetName = t),
          s.startRow > s.endRow || s.startCol > s.endCol)
        )
          throw Error("Invalid Excel range: ".concat(e));
        return s;
      }
      function c(e) {
        if (!e || "" === e.trim())
          throw Error("Invalid chart data range: empty range");
        for (let t of e.split(",")) {
          let r = t.trim();
          if (!r)
            throw Error(
              'Invalid chart data range: empty part in "'.concat(e, '"'),
            );
          s(r);
        }
      }
      function h(e) {
        return (
          "number" == typeof e ||
          ("string" == typeof e && /^[\d,]+(\.\d+)?([eE][+-]?\d+)?$/.test(e))
        );
      }
      function u(e) {
        var t, r;
        if (!e || 0 === e.length) return !1;
        let o = (null == (t = e[0]) ? void 0 : t.length) || 0;
        for (let t = 0; t < e.length; t++)
          for (let a = 0; a < o; a++) {
            let o = null == (r = e[t]) ? void 0 : r[a];
            if (null != o && "" !== o && h(o)) return !0;
          }
        return !1;
      }
      function d(e) {
        if (e.startsWith("'") && e.endsWith("'")) return e;
        let t = e.replace(/'/g, "''");
        return "'".concat(t, "'");
      }
      function g(e, t, r) {
        return "".concat(e, "!").concat(a(t, r));
      }
      function m(e, t, r, o, n) {
        let i = a(t, r),
          l = a(o, n);
        return "".concat(e, "!").concat(i, ":").concat(l);
      }
      function p(e, t, r, o) {
        let n = a(e, t),
          i = a(r, o);
        return "".concat(n, ":").concat(i);
      }
      function f(e) {
        let t = e.match(/^([A-Z]+)(\d+)$/);
        if (!t) throw Error("Invalid cell address: ".concat(e));
        let r = t[1];
        return {
          row: parseInt(t[2]) - 1,
          col: (function (e) {
            let t = 0;
            for (let r = 0; r < e.length; r++)
              t = 26 * t + (e.charCodeAt(r) - 64);
            return t - 1;
          })(r),
        };
      }
      function S(e) {
        let [t, r] = e.split(":");
        if (!t || !r) throw Error("Invalid range format: ".concat(e));
        let o = f(t),
          a = f(r);
        return {
          startRow: o.row,
          startCol: o.col,
          endRow: a.row,
          endCol: a.col,
        };
      }
    },
    7922: (e, t, r) => {
      r.d(t, {
        JY: () => N,
        NB: () => A,
        mW: () => _,
        lo: () => x,
        cM: () => k,
        di: () => L,
        cI: () => O,
        yj: () => M,
        LL: () => I,
        o8: () => E,
        eM: () => F,
        ww: () => T,
        f0: () => P,
        Cf: () => D,
        zu: () => eA,
        tW: () => ef,
        IB: () => h.IB,
      });
      var o = r(60395),
        a = r.n(o),
        n = r(92267),
        i = r(14377);
      function l(e, t) {
        var r;
        let o = e.length,
          a = (null == (r = e[0]) ? void 0 : r.length) || 0,
          n = Array(o)
            .fill(0)
            .map(() => Array(a).fill(!1));
        for (let r = 0; r < o; r++)
          for (let o = 0; o < a; o++) 1 !== e[r][o] || n[r][o] || t(r, o, n);
      }
      function s(e, t, r, o, a) {
        let n = [
          {
            r: r,
            c: o,
          },
        ];
        for (; n.length > 0; ) {
          let { r, c: o } = n.shift();
          r < 0 ||
            r >= e.length ||
            o < 0 ||
            o >= e[0].length ||
            t[r][o] ||
            0 === e[r][o] ||
            ((t[r][o] = !0),
            a(r, o),
            n.push({
              r: r - 1,
              c: o,
            }),
            n.push({
              r: r + 1,
              c: o,
            }),
            n.push({
              r,
              c: o - 1,
            }),
            n.push({
              r,
              c: o + 1,
            }));
        }
      }
      function c(e, t, r) {
        let o = Array(e)
          .fill(0)
          .map(() => Array(t).fill(0));
        for (let a = 0; a < e; a++)
          for (let e = 0; e < t; e++) r(a, e) && (o[a][e] = 1);
        return o;
      }
      var h = r(2845),
        u = r(25323);
      function d(e, t, r) {
        return e.replace(/(?:(?:'[^']+'|[^\s!]+)!)?\$?[A-Z]+\$?\d+/g, (e) => {
          let o = "",
            a = e;
          if (e.includes("!")) {
            let t = e.split("!");
            ((o = t[0] + "!"), (a = t[1]));
          }
          let n = a.includes("$") && a.indexOf("$") < a.search(/\d/),
            i = a.includes("$") && a.lastIndexOf("$") >= a.search(/\d/);
          if (n && i) return o + "$$CELL$$";
          if (n) return o + "$$COL$$[R]";
          if (i) return o + "[C]$$ROW$$";
          let l = (0, h.VW)(a),
            s = l.row - t,
            c = l.col - r;
          return (
            o +
            (0 === c
              ? "[C]"
              : c > 0
                ? "[C+".concat(c, "]")
                : "[C".concat(c, "]")) +
            (0 === s
              ? "[R]"
              : s > 0
                ? "[R+".concat(s, "]")
                : "[R".concat(s, "]"))
          );
        });
      }
      var g = r(90123);
      function m(e, t, r, o, a) {
        let n = new Map(),
          i = 1;
        for (let l = 0; l < t.length; l++)
          for (let s = 0; s < t[l].length; s++) {
            let c = t[l][s],
              u = "".concat((0, h.dE)(o + s)).concat(r + l + 1);
            if (a && a.has(u)) continue;
            let d = e.getStyleAt(u),
              g = d && Object.keys(d).length > 0;
            if ((null == c || "" === c) && !g) continue;
            let m = (function (e) {
              if (!e || "object" != typeof e) return "";
              let t = Object.keys(e).sort(),
                r = [];
              for (let o of t) {
                let t = e[o];
                null != t &&
                  "" !== t &&
                  ("object" == typeof t
                    ? r.push("".concat(o, ":").concat(JSON.stringify(t)))
                    : r.push("".concat(o, ":").concat(t)));
              }
              return r.join("|");
            })(d);
            if (!n.has(m)) {
              let e = "S".concat(i++),
                t = (function (e) {
                  if (!e || "object" != typeof e) return "No style";
                  let t = Object.keys(e).sort(),
                    r = [];
                  for (let o of t) {
                    let t,
                      a = e[o];
                    if (null != a && "" !== a) {
                      if ("object" == typeof a)
                        try {
                          t = JSON.stringify(a);
                        } catch (e) {
                          t = String(a);
                        }
                      else t = String(a);
                      r.push("".concat(o, ":").concat(t));
                    }
                  }
                  return r.length > 0 ? r.join(", ") : "Default style";
                })(d);
              n.set(m, {
                cells: [],
                style: d,
                id: e,
                description: t,
              });
            }
            n.get(m).cells.push({
              row: r + l,
              col: o + s,
              value: c,
            });
          }
        return {
          styleMap: n,
          minCellsForSignificant: 0,
        };
      }
      function p(e) {
        let t =
            !(arguments.length > 1) || void 0 === arguments[1] || arguments[1],
          r = Array.from(e.styleMap.entries());
        if (0 === r.length) return [];
        let o = t ? ["", "--- Style Patterns ---", ""] : [];
        for (let [e, t] of r.slice(0, 10)) {
          let { cells: e, description: r } = t,
            a =
              0 === e.length
                ? ""
                : (0, g.T)(e)
                    .map((e) =>
                      e.startRow === e.endRow && e.startCol === e.endCol
                        ? ""
                            .concat((0, h.dE)(e.startCol))
                            .concat(e.startRow + 1)
                        : ""
                            .concat((0, h.dE)(e.startCol))
                            .concat(e.startRow + 1, ":")
                            .concat((0, h.dE)(e.endCol))
                            .concat(e.endRow + 1),
                    )
                    .join(", "),
            n = e[0],
            i =
              "number" == typeof n.value
                ? " (numbers)"
                : "string" == typeof n.value
                  ? " (text)"
                  : "";
          (o.push("".concat(a, ": ").concat(e.length, " cells").concat(i)),
            "Default style" !== r &&
              "No style" !== r &&
              o.push("  → ".concat(r)));
        }
        return (
          r.length > 10 &&
            (o.push(""),
            o.push("... and ".concat(r.length - 10, " more style patterns"))),
          o
        );
      }
      class f {
        getFormattedRange(e) {
          let t,
            r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            o =
              !(arguments.length > 2) ||
              void 0 === arguments[2] ||
              arguments[2],
            a = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
            n = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
            { startRow: i, startCol: l, endRow: s, endCol: c } = (0, h.IB)(e),
            u = s - i + 1,
            d = c - l + 1,
            g = !1,
            m = this.sheetProxy.getArray(i, l, u, d);
          if (r) {
            t = [];
            for (let e = 0; e < u; e++) {
              let r = [];
              for (let t = 0; t < d; t++) {
                var p;
                let o = "".concat((0, h.dE)(l + t)).concat(i + e + 1),
                  a = this.sheetProxy.getCell(o, !1, !1);
                (m &&
                  (0, h.p)(null == (p = m[e]) ? void 0 : p[t]) &&
                  !g &&
                  (g = !0),
                  r.push(a));
              }
              t.push(r);
            }
          } else {
            if (!m) return "No data available";
            ((t = m), (g = (0, h.MU)(t)));
          }
          return t && t.length
            ? this.formatAsCondensedCSV(t, i, l, o, a, n && g)
            : "No data available";
        }
        formatAsCondensedCSV(e, t, r, o) {
          let a =
              arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
            n = arguments.length > 5 && void 0 !== arguments[5] && arguments[5],
            i = [],
            l = o
              ? (function (e, t, r, o) {
                  let a = new Map(),
                    n = new Map(),
                    i = new Map(),
                    l = 1;
                  for (let s = 0; s < t.length; s++)
                    for (let c = 0; c < t[s].length; c++) {
                      let h = e.getFormula(r + s, o + c);
                      if (h) {
                        let e = d(h, r + s, o + c),
                          u = t[s][c];
                        if (!a.has(e)) {
                          let t = "F".concat(l++);
                          (a.set(e, {
                            cells: [],
                            id: t,
                          }),
                            n.set(t, e),
                            i.set(e, {
                              cells: [],
                              id: t,
                            }));
                        }
                        (a.get(e).cells.push({
                          row: r + s,
                          col: o + c,
                          value: u,
                          formula: h,
                        }),
                          i.get(e).cells.push({
                            row: r + s,
                            col: o + c,
                            value: u,
                            formula: h,
                          }));
                      }
                    }
                  for (let [e, t] of n) {
                    let r = a.get(t).cells,
                      o = (function (e, t) {
                        if (0 === t.length) return e;
                        let r = e;
                        for (let o of [
                          ...e.matchAll(/\[(C[+-]\d+|C)\]\[(R[+-]\d+|R)\]/g),
                        ]) {
                          let e = o[0],
                            a = o[1],
                            n = o[2],
                            i = "[".concat(a, "]"),
                            l = "[".concat(n, "]");
                          if ("R" !== n && n.startsWith("R")) {
                            let e = parseInt(n.substring(1)),
                              r = t.map((t) => t.row + e);
                            if (r.every((e) => e === r[0])) {
                              let e = r[0] + 1;
                              l = "['".concat(e, "']");
                            }
                          }
                          if ("C" !== a && a.startsWith("C")) {
                            let e = parseInt(a.substring(1)),
                              r = t.map((t) => t.col + e);
                            if (r.every((e) => e === r[0])) {
                              let e = (0, h.dE)(r[0]);
                              i = "['".concat(e, "']");
                            }
                          }
                          if (
                            i !== "[".concat(a, "]") ||
                            l !== "[".concat(n, "]")
                          ) {
                            let t = i + l;
                            r = r.replace(e, t);
                          }
                        }
                        return r;
                      })(t, r);
                    if ((n.set(e, o), o !== t)) {
                      let e = a.get(t);
                      (a.delete(t), a.set(o, e));
                    }
                  }
                  return {
                    formulaMap: a,
                    formulaPatterns: n,
                    originalPatternMap: i,
                    minCellsForSignificant: 10,
                  };
                })(this.sheetProxy, e, t, r)
              : null,
            s = a ? m(this.sheetProxy, e, t, r) : null,
            c = Array.isArray(e[0]) ? e[0].length : 0;
          if (c <= 0) return "No data available";
          let g = r + c - 1,
            f = n
              ? (function (e, t, r, o, a) {
                  let n =
                      arguments.length > 5 && void 0 !== arguments[5]
                        ? arguments[5]
                        : 2,
                    i =
                      arguments.length > 6 && void 0 !== arguments[6]
                        ? arguments[6]
                        : "→",
                    l = t.length;
                  if (l <= 0 || n <= 0) return null;
                  let s = Math.max(0, o - Math.max(0, 0 | a));
                  if (s >= o) return null;
                  let c = null;
                  try {
                    c = e.getArray(r, s, l, o - s);
                  } catch (e) {
                    c = null;
                  }
                  return c
                    ? (0, u.BM)(l, r, o, s, c, n, i, (t, r) => {
                        let o = "".concat((0, h.dE)(r)).concat(t + 1),
                          a = e.getStyleAt(o);
                        return {
                          text: e.getCell(o, !1, !1),
                          indent: (null == a ? void 0 : a.textIndent) || 0,
                        };
                      })
                    : null;
                })(this.sheetProxy, e, t, r, 10, 2)
              : null,
            S = n
              ? (function (e, t, r, o, a) {
                  let n =
                      arguments.length > 5 && void 0 !== arguments[5]
                        ? arguments[5]
                        : 30,
                    i = Math.max(
                      1,
                      Math.ceil((Math.max(0, n) / 100) * (o - r + 1)),
                    ),
                    l = (t, r) => {
                      var o, a;
                      return null == (a = e.getArray(t, r, 1, 1)) ||
                        null == (o = a[0])
                        ? void 0
                        : o[0];
                    },
                    s = (0, u.v7)(t, r, o, a, i, l, (t) => {
                      let a = 0;
                      for (let l = r; l <= o; l++) {
                        var n, i;
                        let r =
                          null == (i = e.getArray(t, l, 1, 1)) ||
                          null == (n = i[0])
                            ? void 0
                            : n[0];
                        null != r &&
                          "" !== r &&
                          "number" != typeof r &&
                          isNaN(Number(r)) &&
                          a++;
                      }
                      return a;
                    });
                  if (null == s) return null;
                  let c = (0, u.nS)(s, r, o, l, (t, r) => {
                    let o = "".concat((0, h.dE)(r)).concat(t + 1);
                    return e.getCell(o, !1, !1);
                  });
                  return c ? [c] : null;
                })(this.sheetProxy, t, r, g, 20, 30)
              : null,
            y = !1;
          (l &&
            (y =
              Array.from(l.formulaMap.values()).filter(
                (e) => e.cells.length >= l.minCellsForSignificant,
              ).length > 0),
            y &&
              (i.push(
                "Common formulas are abbreviated as F1, F2, etc. Definitions are given at the end.",
              ),
              i.push("")));
          for (let o = 0; o < e.length; o++) {
            let a = [],
              n = !1;
            for (let i = 0; i < e[o].length; i++) {
              let s = this.formatCellContent(e[o][i], t + o, r + i, l),
                c = (0, h.dE)(r + i) + (t + o + 1);
              "" !== s
                ? ((n = !0), a.push("".concat(c, ":").concat(s)))
                : a.push("".concat(c, ":"));
            }
            n && i.push(a.join(" | "));
          }
          if (l) {
            let e = (function (e, t) {
              let r = Array.from(e.formulaMap.entries())
                .filter((t) => {
                  let [r, o] = t;
                  return o.cells.length >= e.minCellsForSignificant;
                })
                .sort(
                  (e, t) =>
                    parseInt(e[1].id.substring(1)) -
                    parseInt(t[1].id.substring(1)),
                );
              if (0 === r.length) return [];
              let o = [
                "",
                "--- Common Formula Definitions ---",
                "Cell references: [C] = current column, [R] = current row, ['A'] = column A, ['5'] = row 5",
                "",
              ];
              for (let [e, a] of r) {
                let { cells: r, id: n } = a,
                  i = t(r);
                (o.push(
                  ""
                    .concat(n, ": ")
                    .concat(i, ", ")
                    .concat(r.length, ' cells, "')
                    .concat(e, '"'),
                ),
                  o.push("Example cells in range:"));
                let l = (function (e) {
                  if (e.length <= 3) return [...e];
                  let t = [];
                  if ((t.push(e[0]), e.length > 2)) {
                    let r = 1 + Math.floor(Math.random() * (e.length - 2));
                    t.push(e[r]);
                  }
                  return (t.push(e[e.length - 1]), t);
                })(r).map((e) => {
                  let t = "".concat((0, h.dE)(e.col)).concat(e.row + 1);
                  return "  - "
                    .concat(t, ": ")
                    .concat(e.value, " (=")
                    .concat(e.formula, ")");
                });
                (o.push(...l),
                  r.length > 3 &&
                    o.push("  - ... and ".concat(r.length - 3, " more cells")));
              }
              return o;
            })(l, (e) => this.getConnectedRegionsDescription(e));
            e.length > 0 && i.push(...e);
          }
          if (s) {
            let e = p(s);
            e.length > 0 && i.push(...e);
          }
          if (f && f.length > 0) {
            let e = f.map((e) => e.trim()).filter((e) => e);
            e.length > 0 &&
              (i.push(""),
              i.push(
                "--- Context from cells to the left (→ denotes a single indent) ---",
              ),
              i.push(...e));
          }
          if (S && S.length > 0) {
            let e = S.map((e) => e.trim()).filter((e) => e);
            e.length > 0 &&
              (i.push(""),
              i.push("--- Context from cells above ---"),
              i.push(e.join(" | ")));
          }
          return i.join("\n");
        }
        formatCellContent(e, t, r, o) {
          if (null == e || "" === e) return "";
          let a = String(e);
          if (o) {
            let e = this.sheetProxy.getFormula(t, r);
            if (e) {
              let n = d(e, t, r),
                i = o.originalPatternMap.get(n);
              i && i.cells.length >= o.minCellsForSignificant
                ? (a += "(".concat(i.id, ")"))
                : (a += "(".concat(e, ")"));
            }
          }
          return (
            (a.includes(",") || a.includes('"') || a.includes("\n")) &&
              (a = '"' + a.replace(/"/g, '""') + '"'),
            a
          );
        }
        getConnectedRegionsDescription(e) {
          if (0 === e.length) return "";
          let t = Math.min(...e.map((e) => e.row)),
            r = Math.max(...e.map((e) => e.row)),
            o = Math.min(...e.map((e) => e.col)),
            a = Math.max(...e.map((e) => e.col)),
            n = new Set(
              e.map((e) => "".concat(e.row - t, ",").concat(e.col - o)),
            ),
            i = c(r - t + 1, a - o + 1, (e, t) =>
              n.has("".concat(e, ",").concat(t)),
            ),
            u = [];
          return (l(i, (e, r, a) => {
            let n = e,
              l = e,
              c = r,
              h = r;
            (s(i, a, e, r, (e, t) => {
              ((n = Math.min(n, e)),
                (l = Math.max(l, e)),
                (c = Math.min(c, t)),
                (h = Math.max(h, t)));
            }),
              u.push({
                minRow: n + t,
                maxRow: l + t,
                minCol: c + o,
                maxCol: h + o,
              }));
          }),
          1 === u.length &&
            u[0].minRow === u[0].maxRow &&
            u[0].minCol === u[0].maxCol)
            ? "".concat((0, h.dE)(u[0].minCol)).concat(u[0].minRow + 1)
            : u
                .map((e) =>
                  e.minRow === e.maxRow && e.minCol === e.maxCol
                    ? "".concat((0, h.dE)(e.minCol)).concat(e.minRow + 1)
                    : ""
                        .concat((0, h.dE)(e.minCol))
                        .concat(e.minRow + 1, ":")
                        .concat((0, h.dE)(e.maxCol))
                        .concat(e.maxRow + 1),
                )
                .join(", ");
        }
        getStyles(e, t, r) {
          let { startRow: o, startCol: a, endRow: n, endCol: i } = (0, h.IB)(e),
            l = n - o + 1,
            s = i - a + 1,
            c = this.sheetProxy.getArray(o, a, l, s);
          if (!c) return "No styles found in range";
          let u = m(this.sheetProxy, c, o, a, t);
          if (!u || 0 === u.styleMap.size) return "No styles found in range";
          let d = [];
          r && d.push("", r, "");
          let g = p(u, !1);
          return (g.length > 0 && d.push(...g), d.join("\n"));
        }
        constructor(e) {
          this.sheetProxy = e;
        }
      }
      function S(e, t) {
        let r =
          !(arguments.length > 2) || void 0 === arguments[2] || arguments[2];
        if (!e && !t) return "";
        let o = [];
        if ((r && o.push("\nFrozen Panes:"), e > 0)) {
          let t = (0, h.dE)(e - 1);
          o.push(
            ""
              .concat(r ? "  " : "", "Columns A through ")
              .concat(
                t,
                " (inclusive) have been frozen. A vertical line will display to the right of column ",
              )
              .concat(t, "."),
          );
        }
        return (
          t > 0 &&
            o.push(
              ""
                .concat(r ? "  " : "", "Rows 1 through ")
                .concat(
                  t,
                  " (inclusive) have been frozen. A horizontal line will display below row ",
                )
                .concat(t, "."),
            ),
          o.join("\n")
        );
      }
      let y = {
        MIN_ROW_COUNT: 1e4,
        MIN_COLUMN_COUNT: 100,
        MAX_ROW_COUNT: 1048576,
        MAX_COLUMN_COUNT: 16384,
        EXPANSION_BUFFER: 20,
        EXPANSION_INCREMENT_ROWS: 1e3,
        EXPANSION_INCREMENT_COLS: 100,
      };
      (y.MIN_ROW_COUNT, y.MIN_COLUMN_COUNT);
      let w = new RegExp(
          "(".concat(
            "backColor|foreColor|font|hAlign|vAlign|borderLeft|borderTop|borderRight|borderBottom|border|formatter|textIndent|wordWrap",
            ")",
          ),
        ),
        v = /\(\s*\{[^}]*\}\s*\)/;
      var C = (function (e) {
          return (
            (e[(e.left = 0)] = "left"),
            (e[(e.center = 1)] = "center"),
            (e[(e.right = 2)] = "right"),
            (e[(e.general = 3)] = "general"),
            e
          );
        })({}),
        b = (function (e) {
          return (
            (e[(e.empty = 0)] = "empty"),
            (e[(e.thin = 1)] = "thin"),
            (e[(e.medium = 2)] = "medium"),
            (e[(e.dashed = 3)] = "dashed"),
            (e[(e.dotted = 4)] = "dotted"),
            (e[(e.thick = 5)] = "thick"),
            (e[(e.double = 6)] = "double"),
            (e[(e.hair = 7)] = "hair"),
            (e[(e.mediumDashed = 8)] = "mediumDashed"),
            (e[(e.dashDot = 9)] = "dashDot"),
            (e[(e.mediumDashDot = 10)] = "mediumDashDot"),
            (e[(e.dashDotDot = 11)] = "dashDotDot"),
            (e[(e.mediumDashDotDot = 12)] = "mediumDashDotDot"),
            (e[(e.slantedDashDot = 13)] = "slantedDashDot"),
            e
          );
        })({});
      let T = "Cannot import two files to same workbook";
      var k = (function (e) {
          return (
            (e.Hardcoded = "Hardcoded"),
            (e.HardcodedInFormula = "HardcodedInFormula"),
            (e.ReferenceOtherSheets = "ReferenceOtherSheets"),
            (e.Formula = "Formula"),
            (e.Percentage = "Percentage"),
            e
          );
        })({}),
        E = (function (e) {
          return (
            (e.General = "General"),
            (e.OneDecimal = "#,##0.0"),
            (e.TwoDecimals = "#,##0.00"),
            (e.Number = "#,##0"),
            (e.Currency = "$#,##0.00"),
            (e.Percentage = "0.00%"),
            (e.Scientific = "##0.0E+0"),
            (e.Fraction = "# ??/??"),
            (e.Accounting =
              '_([$$-409]* #,##0.00_);_([$$-409]* (#,##0.00);_([$$-409]* "-"??_);_(@_)'),
            (e.Banking =
              '_([$$-409]* #,##0.0_);_([$$-409]* (#,##0.0);_([$$-409]* "-"??_);_(@_)'),
            (e.Date = "yyyy-mm-dd"),
            (e.DateShort = "mm/dd/yyyy"),
            (e.Time = "hh:mm:ss"),
            (e.Text = "@"),
            e
          );
        })({}),
        A = (function (e) {
          return (
            (e.Area = "Area"),
            (e.AreaStacked = "AreaStacked"),
            (e.AreaStacked100 = "AreaStacked100"),
            (e.Bar = "Bar"),
            (e.BarStacked = "BarStacked"),
            (e.BarStacked100 = "BarStacked100"),
            (e.ColumnClustered = "ColumnClustered"),
            (e.ColumnStacked = "ColumnStacked"),
            (e.ColumnStacked100 = "ColumnStacked100"),
            (e.Doughnut = "Doughnut"),
            (e.Funnel = "Funnel"),
            (e.Line = "Line"),
            (e.LineStacked = "LineStacked"),
            (e.LineStacked100 = "LineStacked100"),
            (e.Pie = "Pie"),
            (e.Radar = "Radar"),
            (e.Treemap = "Treemap"),
            (e.Waterfall = "Waterfall"),
            (e.XYScatter = "XYScatter"),
            (e.XYScatterLines = "XYScatterLines"),
            (e.XYScatterLinesNoMarkers = "XYScatterLinesNoMarkers"),
            (e.XYScatterSmooth = "XYScatterSmooth"),
            (e.XYScatterSmoothNoMarkers = "XYScatterSmoothNoMarkers"),
            e
          );
        })({});
      let R = {
        MIN: "#FF0000",
        MID: "#FFFF00",
        MAX: "#00FF00",
        BAR: "#638EC6",
      };
      var x = (function (e) {
          return (
            (e.TwoColorScale = "2-color scale"),
            (e.ThreeColorScale = "3-color scale"),
            (e.DataBar = "Data bar"),
            (e.IconSet = "Icon sets"),
            (e.AverageRule = "Average rule"),
            (e.CellValueRule = "Cell value rule"),
            (e.DateOccurringRule = "Date occurring rule"),
            (e.DuplicateRule = "Duplicate rule"),
            (e.FormulaRule = "Formula rule"),
            (e.SpecificTextRule = "Specific text rule"),
            (e.Top10Rule = "Top 10 rule"),
            (e.UniqueRule = "Unique rule"),
            e
          );
        })({}),
        F = (function (e) {
          return (
            (e.ThreeArrows = "3Arrows"),
            (e.ThreeTriangles = "3Triangles"),
            (e.ThreeTrafficLights = "3TrafficLights"),
            (e.FourTrafficLights = "4TrafficLights"),
            (e.FiveArrows = "5Arrows"),
            (e.FiveRating = "5Rating"),
            e
          );
        })({}),
        N = (function (e) {
          return (
            (e.Above = "above"),
            (e.Below = "below"),
            (e.EqualOrAbove = "equalOrAbove"),
            (e.EqualOrBelow = "equalOrBelow"),
            (e.Above1StdDev = "above1StdDev"),
            (e.Below1StdDev = "below1StdDev"),
            (e.Above2StdDev = "above2StdDev"),
            (e.Below2StdDev = "below2StdDev"),
            (e.Above3StdDev = "above3StdDev"),
            (e.Below3StdDev = "below3StdDev"),
            e
          );
        })({}),
        _ = (function (e) {
          return (
            (e.EqualsTo = "equalsTo"),
            (e.NotEqualsTo = "notEqualsTo"),
            (e.GreaterThan = "greaterThan"),
            (e.GreaterThanOrEqualsTo = "greaterThanOrEqualsTo"),
            (e.LessThan = "lessThan"),
            (e.LessThanOrEqualsTo = "lessThanOrEqualsTo"),
            (e.Between = "between"),
            (e.NotBetween = "notBetween"),
            e
          );
        })({}),
        I = (function (e) {
          return (
            (e.Today = "today"),
            (e.Yesterday = "yesterday"),
            (e.Tomorrow = "tomorrow"),
            (e.Last7Days = "last7Days"),
            (e.ThisWeek = "thisWeek"),
            (e.LastWeek = "lastWeek"),
            (e.NextWeek = "nextWeek"),
            (e.ThisMonth = "thisMonth"),
            (e.LastMonth = "lastMonth"),
            (e.NextMonth = "nextMonth"),
            e
          );
        })({}),
        P = (function (e) {
          return (
            (e.Contains = "contains"),
            (e.DoesNotContain = "doesNotContain"),
            (e.BeginsWith = "beginsWith"),
            (e.EndsWith = "endsWith"),
            e
          );
        })({}),
        D = (function (e) {
          return ((e.Top = "top"), (e.Bottom = "bottom"), e);
        })({}),
        M = (function (e) {
          return (
            (e.List = "List"),
            (e.FormulaList = "FormulaList"),
            (e.WholeNumber = "WholeNumber"),
            (e.Decimal = "Decimal"),
            (e.Date = "Date"),
            (e.Time = "Time"),
            (e.TextLength = "TextLength"),
            (e.Custom = "Custom"),
            e
          );
        })({}),
        O = (function (e) {
          return (
            (e.Equal = "Equal"),
            (e.NotEqual = "NotEqual"),
            (e.GreaterThan = "GreaterThan"),
            (e.GreaterThanOrEqual = "GreaterThanOrEqual"),
            (e.LessThan = "LessThan"),
            (e.LessThanOrEqual = "LessThanOrEqual"),
            (e.Between = "Between"),
            (e.NotBetween = "NotBetween"),
            e
          );
        })({}),
        L = (function (e) {
          return (
            (e.Stop = "Stop"),
            (e.Warning = "Warning"),
            (e.Information = "Information"),
            e
          );
        })({});
      class V {
        getCellAtPosition(e, t) {
          let r = 0,
            o = 0;
          for (
            ;
            r < e &&
            o < this.sheet.getColumnCount() &&
            !((r += this.sheet.getColumnWidth(o)) > e);
          )
            o++;
          let a = 0,
            n = 0;
          for (
            ;
            a < t &&
            n < this.sheet.getRowCount() &&
            !((a += this.sheet.getRowHeight(n)) > t);
          )
            n++;
          return {
            row: n,
            col: o,
          };
        }
        getCellPosition(e, t) {
          let r = 0,
            o = 0;
          for (let e = 0; e < t; e++) r += this.sheet.getColumnWidth(e);
          for (let t = 0; t < e; t++) o += this.sheet.getRowHeight(t);
          return {
            x: r,
            y: o,
          };
        }
        getRangeDimensions(e, t, r, o) {
          let a = 0,
            n = 0;
          for (let e = t; e <= o; e++) a += this.sheet.getColumnWidth(e);
          for (let t = e; t <= r; t++) n += this.sheet.getRowHeight(t);
          return {
            width: a,
            height: n,
          };
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      class W {
        findPositionForChart(e, t, r, o) {
          let a = [[0, 0, 100]],
            n = new Set(),
            i = this.calculateSearchBounds(e, t),
            l = i.maxX,
            s = i.maxY;
          for (; a.length > 0; ) {
            let [i, c, h] = a.shift(),
              u = "".concat(i, ",").concat(c);
            if (n.has(u)) continue;
            n.add(u);
            let d = {
              x: i,
              y: c,
              width: e,
              height: t,
            };
            if (this.overlapDetector.isPositionValid(d, r, o))
              return {
                x: i,
                y: c,
              };
            let g =
              h > 20 &&
              this.overlapDetector.quickDataOverlapCheck({
                x: i - r,
                y: c - r,
                width: e + 2 * r,
                height: t + 2 * r,
              })
                ? 20
                : h;
            (i + g <= l && a.push([i + g, c, g]),
              c + g <= s && a.push([i, c + g, g]),
              i + g <= l && c + g <= s && a.push([i + g, c + g, g]));
          }
          return {
            x: l + r,
            y: r,
          };
        }
        calculateSmartPosition(e) {
          return this.findPositionForChart(480, 288, 10, e);
        }
        calculateSearchBounds(e, t) {
          let r = this.sheet.getUsedRange(o.Spread.Sheets.UsedRangeType.data),
            a = 0,
            n = 0;
          if (r && r.rowCount && r.colCount) {
            let e = r.row || 0,
              t = (r.col || 0) + r.colCount - 1,
              o = e + r.rowCount - 1;
            for (let e = 0; e <= t; e++) a += this.sheet.getColumnWidth(e);
            for (let e = 0; e <= o; e++) n += this.sheet.getRowHeight(e);
          } else {
            for (let e = 0; e < 10; e++) a += this.sheet.getColumnWidth(e);
            for (let e = 0; e < 20; e++) n += this.sheet.getRowHeight(e);
          }
          return {
            maxX: a + 3 * e,
            maxY: n + 3 * t,
          };
        }
        getCellPosition(e, t) {
          return this.cellGeometry.getCellPosition(e, t);
        }
        getCellAddressFromPixel(e, t) {
          let r = this.cellGeometry.getCellAtPosition(e, t),
            o = (0, h.dE)(r.col);
          return "".concat(o).concat(r.row + 1);
        }
        constructor(e, t) {
          ((this.sheet = e),
            (this.overlapDetector = t),
            (this.cellGeometry = new V(e)));
        }
      }
      class B {
        cacheOccupiedCells() {
          this.dataCellsCache = new Set();
          let e = this.sheet.getUsedRange(o.Spread.Sheets.UsedRangeType.data);
          if (!e) return;
          let t = e.row || 0,
            r = e.col || 0,
            a = t + e.rowCount,
            n = r + e.colCount;
          for (let e = t; e < a; e++)
            for (let t = r; t < n; t++)
              this.isCellOccupied(e, t) &&
                this.dataCellsCache.add("".concat(e, ",").concat(t));
        }
        clearCache() {
          this.dataCellsCache = null;
        }
        isPositionValid(e, t, r) {
          let o = {
            x: e.x,
            y: e.y,
            width: e.width + t,
            height: e.height + t,
          };
          return !(
            this.overlapsWithData(o) ||
            this.overlapsWithCharts(e, r, t) ||
            this.overlapsWithTables(e, t)
          );
        }
        overlapsWithData(e) {
          let t = this.cellGeometry.getCellAtPosition(e.x, e.y),
            r = this.cellGeometry.getCellAtPosition(
              e.x + e.width,
              e.y + e.height,
            );
          for (let e = t.row; e <= r.row; e++)
            for (let o = t.col; o <= r.col; o++)
              if (this.isCellOccupiedCached(e, o)) return !0;
          return !1;
        }
        overlapsWithCharts(e, t, r) {
          for (let [, o] of t) {
            let t = {
              x: o.x - r,
              y: o.y - r,
              width: o.width + 2 * r,
              height: o.height + 2 * r,
            };
            if (this.rectanglesOverlap(e, t)) return !0;
          }
          return !1;
        }
        overlapsWithTables(e, t) {
          for (let r of this.sheet.tables.all())
            if (r) {
              let o = r.range(),
                a = this.cellGeometry.getCellPosition(o.row, o.col),
                n = this.cellGeometry.getRangeDimensions(
                  o.row,
                  o.col,
                  o.row + o.rowCount - 1,
                  o.col + o.colCount - 1,
                ),
                i = {
                  x: a.x - t,
                  y: a.y - t,
                  width: n.width + 2 * t,
                  height: n.height + 2 * t,
                };
              if (this.rectanglesOverlap(e, i)) return !0;
            }
          return !1;
        }
        isCellOccupied(e, t) {
          let r = this.sheet.getValue(e, t);
          if ((null != r && "" !== r) || this.sheet.getFormula(e, t)) return !0;
          let a = this.sheet.getStyle(e, t);
          if (
            (a && this.hasNonDefaultStyle(a)) ||
            this.sheet.getFormatter(e, t, o.Spread.Sheets.SheetArea.viewport)
          )
            return !0;
          for (let r of this.sheet.getSpans())
            if (
              e >= r.row &&
              e < r.row + r.rowCount &&
              t >= r.col &&
              t < r.col + r.colCount
            )
              return !0;
          return !1;
        }
        isCellOccupiedCached(e, t) {
          return this.dataCellsCache
            ? this.dataCellsCache.has("".concat(e, ",").concat(t))
            : this.isCellOccupied(e, t);
        }
        quickDataOverlapCheck(e) {
          for (let t of [
            {
              x: e.x,
              y: e.y,
            },
            {
              x: e.x + e.width,
              y: e.y,
            },
            {
              x: e.x,
              y: e.y + e.height,
            },
            {
              x: e.x + e.width,
              y: e.y + e.height,
            },
            {
              x: e.x + e.width / 2,
              y: e.y + e.height / 2,
            },
          ]) {
            let e = this.cellGeometry.getCellAtPosition(t.x, t.y);
            if (this.isCellOccupied(e.row, e.col)) return !0;
          }
          return !1;
        }
        hasNonDefaultStyle(e) {
          return (
            (!!e.backColor &&
              "white" !== e.backColor &&
              "#FFFFFF" !== e.backColor) ||
            (!!e.foreColor &&
              "black" !== e.foreColor &&
              "#000000" !== e.foreColor) ||
            !!e.borderLeft ||
            !!e.borderTop ||
            !!e.borderRight ||
            !!e.borderBottom ||
            (void 0 !== e.hAlign && 3 !== e.hAlign) ||
            (void 0 !== e.vAlign && 1 !== e.vAlign) ||
            !!e.textIndent ||
            !!e.wordWrap ||
            !1
          );
        }
        rectanglesOverlap(e, t) {
          return !(
            e.x + e.width <= t.x ||
            t.x + t.width <= e.x ||
            e.y + e.height <= t.y ||
            t.y + t.height <= e.y
          );
        }
        constructor(e) {
          ((this.sheet = e),
            (this.dataCellsCache = null),
            (this.cellGeometry = new V(e)));
        }
      }
      class j {
        configure(e, t) {
          let r = e.series(),
            o = r.get();
          if (0 === o.length) return;
          let a = o.every((e) => e.xValues);
          if (a && 0 === t) return;
          if (a && 0 !== t) return void this.reconfigureAutoDetected(r, o, t);
          if (t < 0 || t >= o.length)
            throw Error(
              "Category index "
                .concat(t, " is out of range (0-")
                .concat(o.length - 1, ")"),
            );
          let n = o[t].yValues;
          if (!n)
            throw Error(
              "Series at index ".concat(
                t,
                " has no yValues to use as categories",
              ),
            );
          for (let e = 0; e < o.length; e++)
            if (e !== t) {
              let t = r.get(e);
              t && ((t.xValues = n), r.set(e, t));
            }
          r.remove(t);
        }
        reconfigureAutoDetected(e, t, r) {
          if (r < 0 || r >= t.length)
            throw Error(
              "Category index "
                .concat(r, " is out of range (0-")
                .concat(t.length - 1, ")"),
            );
          let o = t[r].yValues;
          if (!o)
            throw Error(
              "Series at index ".concat(
                r,
                " has no yValues to use as categories",
              ),
            );
          for (let a = 0; a < t.length; a++)
            if (a !== r) {
              let t = e.get(a);
              t && ((t.xValues = o), e.set(a, t));
            }
          e.remove(r);
        }
      }
      function U(e) {
        return (
          e === o.Spread.Sheets.Charts.ChartType.pie ||
          e === o.Spread.Sheets.Charts.ChartType.doughnut
        );
      }
      let z = {
          fontSize: 14,
          fontFamily: "Arial",
          color: "#333333",
        },
        G = {
          fontSize: 10,
          fontFamily: "Arial",
        };
      class H {
        applyDefaultStyling(e, t) {
          if (
            (e.title({
              fontSize: z.fontSize,
              fontFamily: z.fontFamily,
              color: z.color,
            }),
            e.legend({
              visible: !0,
              position: o.Spread.Sheets.Charts.LegendPosition.right,
              fontSize: 10,
              fontFamily: "Arial",
            }),
            [
              A.Area,
              A.AreaStacked,
              A.AreaStacked100,
              A.Bar,
              A.BarStacked,
              A.BarStacked100,
              A.ColumnClustered,
              A.ColumnStacked,
              A.ColumnStacked100,
              A.Line,
              A.LineStacked,
              A.LineStacked100,
              A.Waterfall,
              A.XYScatter,
              A.XYScatterLines,
              A.XYScatterLinesNoMarkers,
              A.XYScatterSmooth,
              A.XYScatterSmoothNoMarkers,
            ].includes(t))
          ) {
            let t = e.axes();
            (t.primaryCategory &&
              ((t.primaryCategory.style.fontSize = G.fontSize),
              (t.primaryCategory.style.fontFamily = G.fontFamily)),
              t.primaryValue &&
                ((t.primaryValue.style.fontSize = G.fontSize),
                (t.primaryValue.style.fontFamily = G.fontFamily),
                (t.primaryValue.displayUnit = "none")));
          }
          if (
            (e.colorScheme(
              o.Spread.Sheets.Charts.ColorSchemes.colorfulPalette1,
            ),
            t === A.Pie || t === A.Doughnut)
          )
            e.series()
              .get()
              .forEach((e) => {
                e.dataLabels = {
                  showValue: !1,
                  showPercentage: !0,
                  position: o.Spread.Sheets.Charts.DataLabelPosition.center,
                };
              });
          else if (t === A.Funnel)
            e.dataLabels({
              showValue: !0,
              showPercentage: !1,
              color: "#FFFFFF",
            });
          else if (t === A.Waterfall) {
            let t = e.series(),
              r = t.get(0);
            r && ((r.showConnectorLines = !0), t.set(0, r));
          } else
            t === A.Treemap &&
              e.legend({
                visible: !1,
              });
        }
        setDataLabels(e, t) {
          let r = e.series();
          r &&
            r.get().forEach((e, a) => {
              var n, i, l;
              ((e.dataLabels = {
                showValue:
                  null != (i = null != (n = t.showValue) ? n : t.show) && i,
                showPercentage: null != (l = t.showPercentage) && l,
                position: (function (e) {
                  let t = o.Spread.Sheets.Charts.DataLabelPosition;
                  switch (e) {
                    case "center":
                    default:
                      return t.center;
                    case "above":
                      return t.above;
                    case "below":
                      return t.below;
                    case "left":
                      return t.left;
                    case "right":
                      return t.right;
                  }
                })(t.position),
              }),
                r.set(a, e));
            });
        }
        setSeriesColors(e, t) {
          let r = e.series();
          if (r)
            if (U(e.chartType())) {
              let e = r.get(0);
              if (e) {
                let o = {};
                (t.forEach((e, t) => {
                  o[t] = {
                    backColor: e,
                  };
                }),
                  (e.dataPoints = o),
                  r.set(0, e));
              }
            } else
              t.forEach((e, t) => {
                let o = r.get(t);
                o &&
                  ((o.backColor = e),
                  (o.border = {
                    ...o.border,
                    color: e,
                  }),
                  r.set(t, o));
              });
        }
        setAxes(e, t, r) {
          let o = e.axes();
          if (!o) return;
          let a = !1;
          (t &&
            o.primaryCategory &&
            (void 0 !== t.title &&
              ((o.primaryCategory.title = {
                text: t.title,
              }),
              (a = !0)),
            void 0 !== t.min && ((o.primaryCategory.min = t.min), (a = !0)),
            void 0 !== t.max && ((o.primaryCategory.max = t.max), (a = !0))),
            r &&
              o.primaryValue &&
              (void 0 !== r.title &&
                ((o.primaryValue.title = {
                  text: r.title,
                }),
                (a = !0)),
              void 0 !== r.min && ((o.primaryValue.min = r.min), (a = !0)),
              void 0 !== r.max && ((o.primaryValue.max = r.max), (a = !0)),
              void 0 !== r.numberFormat &&
                ((o.primaryValue.format = r.numberFormat), (a = !0))),
            a && e.axes(o));
        }
        warnUnsupportedProperties(e) {
          let t = new Set([
              "position",
              "size",
              "title",
              "legend",
              "categoryAxis",
              "valueAxis",
              "dataLabels",
              "seriesColors",
              "dataOrientation",
            ]),
            r = [];
          for (let o of Object.keys(e)) t.has(o) || r.push(o);
          (r.length > 0 &&
            console.warn(
              "[Chart.setProperties] Unknown properties ignored: ".concat(
                r.join(", "),
                ". ",
              ) +
                "Supported properties are: ".concat(
                  Array.from(t).join(", "),
                  ". ",
                ) +
                'To set series colors, use seriesColors: ["#color1", "#color2", ...] as a simple array.',
            ),
            e.series &&
              Array.isArray(e.series) &&
              console.warn(
                '[Chart.setProperties] The \'series\' property is not supported. To set series colors, use seriesColors: ["#color1", "#color2", ...]. To set series names, use legend: { seriesNames: ["name1", "name2", ...] }.',
              ),
            e.title &&
              "object" == typeof e.title &&
              console.warn(
                "[Chart.setProperties] Title must be a plain string, not an object. Font styling (bold, size, color) is not supported.",
              ));
        }
      }
      class $ {
        addChart(e, t, r) {
          let a =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : "columns",
            n = arguments.length > 4 ? arguments[4] : void 0;
          if (!e || "" === e.trim()) throw Error("Chart name cannot be empty");
          if (this.sheet.originalSheet.charts.get(e))
            throw Error('Chart with name "'.concat(e, '" already exists'));
          for (let e of r.split(",").map((e) => e.trim())) {
            let t = (0, h.IB)(e);
            if (
              t.sheetName &&
              t.sheetName !== this.sheet.getName() &&
              !this.sheet.workbook.getSheetFromName(t.sheetName)
            )
              throw Error(
                'Referenced sheet "'.concat(t.sheetName, '" not found'),
              );
          }
          let i = this.calculateChartPosition(),
            l = (function (e) {
              let t = o.Spread.Sheets.Charts.ChartType;
              switch (e) {
                case A.Area:
                  return t.area;
                case A.AreaStacked:
                  return t.areaStacked;
                case A.AreaStacked100:
                  return t.areaStacked100;
                case A.Bar:
                  return t.barClustered;
                case A.BarStacked:
                  return t.barStacked;
                case A.BarStacked100:
                  return t.barStacked100;
                case A.ColumnClustered:
                  return t.columnClustered;
                case A.ColumnStacked:
                  return t.columnStacked;
                case A.ColumnStacked100:
                  return t.columnStacked100;
                case A.Doughnut:
                  return t.doughnut;
                case A.Funnel:
                  return t.funnel;
                case A.Line:
                  return t.line;
                case A.LineStacked:
                  return t.lineStacked;
                case A.LineStacked100:
                  return t.lineStacked100;
                case A.Pie:
                  return t.pie;
                case A.Radar:
                  return t.radar;
                case A.Treemap:
                  return t.treemap;
                case A.Waterfall:
                  return t.waterfall;
                case A.XYScatter:
                  return t.xyScatter;
                case A.XYScatterLines:
                  return t.xyScatterLines;
                case A.XYScatterLinesNoMarkers:
                  return t.xyScatterLinesNoMarkers;
                case A.XYScatterSmooth:
                  return t.xyScatterSmooth;
                case A.XYScatterSmoothNoMarkers:
                  return t.xyScatterSmoothNoMarkers;
                default:
                  throw Error("Invalid chart type: ".concat(e));
              }
            })(t),
            s = this.sheet.originalSheet.charts.add(
              e,
              l,
              i.x,
              i.y,
              480,
              288,
              r,
              "rows" === a
                ? o.Spread.Sheets.Charts.RowCol.rows
                : o.Spread.Sheets.Charts.RowCol.columns,
            );
          return (
            "number" == typeof n &&
              this.categoryAxisConfigurator.configure(s, n),
            this.chartPositions.set(e, {
              x: i.x,
              y: i.y,
              width: 480,
              height: 288,
            }),
            this.styler.applyDefaultStyling(s, t),
            s
          );
        }
        removeChart(e) {
          if (!this.sheet.originalSheet.charts.get(e))
            throw Error('Chart with name "'.concat(e, '" not found'));
          (this.sheet.originalSheet.charts.remove(e),
            this.chartPositions.delete(e));
        }
        getChart(e) {
          return this.sheet.originalSheet.charts.get(e) || null;
        }
        listCharts() {
          return Array.from(this.sheet.originalSheet.charts.all()).map((e) =>
            e.name(),
          );
        }
        autoPositionAllCharts() {
          let e = Array.from(this.sheet.originalSheet.charts.all());
          if (0 === e.length) return;
          let t = new Set();
          (this.chartPositions.clear(),
            this.overlapDetector.cacheOccupiedCells());
          try {
            e.forEach((e) => {
              let r = e.width() || 480,
                o = e.height() || 288,
                a = this.positioner.findPositionForChart(
                  r,
                  o,
                  20,
                  this.chartPositions,
                );
              (e.x(a.x),
                e.y(a.y),
                t.add(e.name()),
                this.chartPositions.set(e.name(), {
                  x: a.x,
                  y: a.y,
                  width: r,
                  height: o,
                }));
            });
          } finally {
            this.overlapDetector.clearCache();
          }
        }
        getChartPosition(e) {
          let t = this.chartPositions.get(e);
          if (!t) return null;
          let r = 0,
            o = 0,
            a = 0,
            n = 0,
            i = 0;
          for (let e = 0; e < this.sheet.originalSheet.getColumnCount(); e++) {
            if (i >= t.x) {
              r = e;
              break;
            }
            i += this.sheet.originalSheet.getColumnWidth(e);
          }
          i = 0;
          for (let e = 0; e < this.sheet.originalSheet.getColumnCount(); e++) {
            if (i >= t.x + t.width) {
              a = e;
              break;
            }
            i += this.sheet.originalSheet.getColumnWidth(e);
          }
          let l = 0;
          for (let e = 0; e < this.sheet.originalSheet.getRowCount(); e++) {
            if (l >= t.y) {
              o = e;
              break;
            }
            l += this.sheet.originalSheet.getRowHeight(e);
          }
          l = 0;
          for (let e = 0; e < this.sheet.originalSheet.getRowCount(); e++) {
            if (l >= t.y + t.height) {
              n = e;
              break;
            }
            l += this.sheet.originalSheet.getRowHeight(e);
          }
          return {
            topLeftCell: "".concat((0, h.dE)(r)).concat(o + 1),
            bottomRightCell: "".concat((0, h.dE)(a)).concat(n + 1),
          };
        }
        getChartProperties(e) {
          let t = this.getChart(e);
          if (!t) throw Error('Chart with name "'.concat(e, '" not found'));
          let r = {},
            a = t.x(),
            n = t.y(),
            i = this.positioner.getCellAddressFromPixel(a, n);
          i && (r.position = i);
          let l = t.width(),
            s = t.height();
          (l || s) &&
            (r.size = {
              width: l || void 0,
              height: s || void 0,
            });
          let c = t.title();
          (null == c ? void 0 : c.text) && (r.title = c.text);
          let h = t.legend();
          if (h) {
            r.legend = {
              visible: !1 !== h.visible,
              position: (function (e) {
                if (void 0 === e) return;
                let t = o.Spread.Sheets.Charts.LegendPosition;
                switch (e) {
                  case t.top:
                    return "top";
                  case t.bottom:
                    return "bottom";
                  case t.left:
                    return "left";
                  case t.right:
                    return "right";
                  default:
                    return;
                }
              })(h.position),
            };
            let e = t.series();
            if (e) {
              let t = e.get();
              if (t && t.length > 0) {
                let e = [];
                (t.forEach((t) => {
                  if (t.name) {
                    let r = t.name;
                    (r.startsWith('"') &&
                      r.endsWith('"') &&
                      (r = r.slice(1, -1)),
                      e.push(r));
                  }
                }),
                  e.length > 0 && (r.legend.seriesNames = e));
              }
            }
          }
          let u = t.axes();
          if (u) {
            var d, g;
            if (u.primaryCategory) {
              let e =
                  (null == (d = u.primaryCategory.title) ? void 0 : d.text) ||
                  void 0,
                t = u.primaryCategory.min,
                o = u.primaryCategory.max;
              (e || void 0 !== t || void 0 !== o) &&
                ((r.categoryAxis = {}),
                e && (r.categoryAxis.title = e),
                void 0 !== t && (r.categoryAxis.min = t),
                void 0 !== o && (r.categoryAxis.max = o));
            }
            if (u.primaryValue) {
              let e =
                  (null == (g = u.primaryValue.title) ? void 0 : g.text) ||
                  void 0,
                t = u.primaryValue.min,
                o = u.primaryValue.max,
                a = u.primaryValue.format;
              (e || void 0 !== t || void 0 !== o || a) &&
                ((r.valueAxis = {}),
                e && (r.valueAxis.title = e),
                void 0 !== t && (r.valueAxis.min = t),
                void 0 !== o && (r.valueAxis.max = o),
                a && (r.valueAxis.numberFormat = a));
            }
          }
          let m = t.series();
          if (m) {
            let e = m.get();
            if (e && e.length > 0) {
              let a = t.chartType(),
                n = [];
              if (U(a)) {
                let t = e[0];
                if (null == t ? void 0 : t.dataPoints) {
                  let e = t.dataPoints;
                  Object.keys(e)
                    .map(Number)
                    .sort((e, t) => e - t)
                    .forEach((t) => {
                      var r;
                      (null == (r = e[t]) ? void 0 : r.backColor) &&
                        n.push(e[t].backColor);
                    });
                }
              } else
                e.forEach((e) => {
                  var t;
                  let r =
                    e.backColor || (null == (t = e.border) ? void 0 : t.color);
                  r && n.push(r);
                });
              n.length > 0 && (r.seriesColors = n);
              let i = e[0];
              (null == i ? void 0 : i.dataLabels) &&
                (r.dataLabels = {
                  show: i.dataLabels.showValue || i.dataLabels.showPercentage,
                  showValue: i.dataLabels.showValue,
                  showPercentage: i.dataLabels.showPercentage,
                  position: (function (e) {
                    if (void 0 === e) return;
                    let t = o.Spread.Sheets.Charts.DataLabelPosition;
                    switch (e) {
                      case t.center:
                        return "center";
                      case t.above:
                        return "above";
                      case t.below:
                        return "below";
                      case t.left:
                        return "left";
                      case t.right:
                        return "right";
                      default:
                        return;
                    }
                  })(i.dataLabels.position),
                });
            }
          }
          return r;
        }
        setChartProperties(e, t) {
          this.styler.warnUnsupportedProperties(t);
          let r = this.getChart(e);
          if (!r) throw Error('Chart with name "'.concat(e, '" not found'));
          if ((t.position && this.moveChart(e, t.position), t.size)) {
            var o, a;
            let n = r.width(),
              i = r.height();
            this.resizeChart(
              e,
              null != (o = t.size.width) ? o : n,
              null != (a = t.size.height) ? a : i,
            );
          }
          (void 0 !== t.title && this.setChartTitle(e, t.title),
            t.legend && this.setChartLegend(e, t.legend),
            (t.categoryAxis || t.valueAxis) &&
              this.styler.setAxes(r, t.categoryAxis, t.valueAxis),
            t.dataLabels && this.styler.setDataLabels(r, t.dataLabels),
            t.seriesColors && this.styler.setSeriesColors(r, t.seriesColors),
            void 0 !== t.dataOrientation && r.switchDataOrientation());
        }
        setChartTitle(e, t) {
          let r = this.getChart(e);
          if (!r) throw Error('Chart with name "'.concat(e, '" not found'));
          r.title({
            text: t,
            fontSize: 14,
            fontFamily: "Arial",
            color: "#333333",
          });
        }
        setChartLegend(e, t) {
          let r = this.getChart(e);
          if (!r) throw Error('Chart with name "'.concat(e, '" not found'));
          let a = (function (e) {
            let t = o.Spread.Sheets.Charts.LegendPosition;
            switch (e) {
              case "top":
                return t.top;
              case "bottom":
                return t.bottom;
              case "left":
                return t.left;
              default:
                return t.right;
            }
          })(t.position || "right");
          if (
            (r.legend({
              visible: !1 !== t.visible,
              position: a,
            }),
            t.seriesNames)
          ) {
            let e = r.series();
            e &&
              t.seriesNames.forEach((t, r) => {
                let o = e.get(r);
                o && ((o.name = '"'.concat(t, '"')), e.set(r, o));
              });
          }
        }
        moveChart(e, t) {
          let r = this.getChart(e);
          if (!r) throw Error('Chart with name "'.concat(e, '" not found'));
          let { row: o, col: a } = (0, h.VW)(t),
            n = this.positioner.getCellPosition(o, a),
            i = r.width(),
            l = r.height();
          (r.x(n.x),
            r.y(n.y),
            this.chartPositions.set(e, {
              x: n.x,
              y: n.y,
              width: i,
              height: l,
            }));
        }
        resizeChart(e, t, r) {
          let o = this.getChart(e);
          if (!o) throw Error('Chart with name "'.concat(e, '" not found'));
          let a = o.x(),
            n = o.y();
          (o.width(t),
            o.height(r),
            this.chartPositions.set(e, {
              x: a,
              y: n,
              width: t,
              height: r,
            }));
        }
        calculateChartPosition() {
          let e = Array.from(this.sheet.originalSheet.charts.all()),
            t = new Set();
          return (
            e.forEach((e) => {
              let r = e.name();
              (this.chartPositions.set(r, {
                x: e.x(),
                y: e.y(),
                width: e.width() || 480,
                height: e.height() || 288,
              }),
                t.add(r));
            }),
            this.positioner.findPositionForChart(
              480,
              288,
              10,
              this.chartPositions,
            )
          );
        }
        constructor(e) {
          ((this.sheet = e),
            (this.chartPositions = new Map()),
            (this.overlapDetector = new B(e.originalSheet)),
            (this.positioner = new W(e.originalSheet, this.overlapDetector)),
            (this.categoryAxisConfigurator = new j()),
            (this.styler = new H()));
        }
      }
      class q {
        applyConditionalFormatting(e, t) {
          let r =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          try {
            let {
                startRow: a,
                startCol: n,
                endRow: i,
                endCol: l,
              } = (0, h.IB)(e),
              s = [new o.Spread.Sheets.Range(a, n, i - a + 1, l - n + 1)],
              c = this.getStyleFromOptions(r);
            switch (t) {
              case x.TwoColorScale:
                let u = new o.Spread.Sheets.ConditionalFormatting.ScaleRule(
                  o.Spread.Sheets.ConditionalFormatting.RuleType.threeScaleRule,
                  o.Spread.Sheets.ConditionalFormatting.ScaleValueType
                    .lowestValue,
                  void 0,
                  r.minColor || R.MIN,
                  o.Spread.Sheets.ConditionalFormatting.ScaleValueType
                    .percentile,
                  50,
                  r.minColor || R.MIN,
                  o.Spread.Sheets.ConditionalFormatting.ScaleValueType
                    .highestValue,
                  void 0,
                  r.maxColor || R.MAX,
                );
                (u.ranges(s),
                  this.sheet.originalSheet.conditionalFormats.addRule(u));
                break;
              case x.ThreeColorScale:
                let d = new o.Spread.Sheets.ConditionalFormatting.ScaleRule(
                  o.Spread.Sheets.ConditionalFormatting.RuleType.threeScaleRule,
                  o.Spread.Sheets.ConditionalFormatting.ScaleValueType
                    .lowestValue,
                  void 0,
                  r.minColor || R.MIN,
                  o.Spread.Sheets.ConditionalFormatting.ScaleValueType
                    .percentile,
                  50,
                  r.midColor || R.MID,
                  o.Spread.Sheets.ConditionalFormatting.ScaleValueType
                    .highestValue,
                  void 0,
                  r.maxColor || R.MAX,
                );
                (d.ranges(s),
                  this.sheet.originalSheet.conditionalFormats.addRule(d));
                break;
              case x.DataBar:
                let g = new o.Spread.Sheets.ConditionalFormatting.DataBarRule(
                  o.Spread.Sheets.ConditionalFormatting.ScaleValueType
                    .lowestValue,
                  0,
                  o.Spread.Sheets.ConditionalFormatting.ScaleValueType
                    .highestValue,
                  0,
                  r.barColor || R.BAR,
                  s,
                );
                (g.showBarOnly(r.showBarOnly || !1),
                  this.sheet.originalSheet.conditionalFormats.addRule(g));
                break;
              case x.IconSet:
                let m = r.iconSetType || F.ThreeTrafficLights,
                  p = this.mapIconSetType(m),
                  f = new o.Spread.Sheets.ConditionalFormatting.IconSetRule(
                    p,
                    s,
                  );
                this.sheet.originalSheet.conditionalFormats.addRule(f);
                break;
              case x.AverageRule:
                let S = r.averageType || N.Above,
                  y =
                    o.Spread.Sheets.ConditionalFormatting.AverageConditionType[
                      S
                    ] ||
                    o.Spread.Sheets.ConditionalFormatting.AverageConditionType
                      .above;
                this.sheet.originalSheet.conditionalFormats.addAverageRule(
                  y,
                  c,
                  s,
                );
                break;
              case x.CellValueRule:
                let w = r.operator || _.EqualsTo,
                  v =
                    o.Spread.Sheets.ConditionalFormatting.ComparisonOperators[
                      w
                    ] ||
                    o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
                      .equalsTo;
                this.sheet.originalSheet.conditionalFormats.addCellValueRule(
                  v,
                  r.value1,
                  r.value2,
                  c,
                  s,
                );
                break;
              case x.DateOccurringRule:
                let C = r.dateOccurringType || I.Today,
                  b =
                    o.Spread.Sheets.ConditionalFormatting.DateOccurringType[
                      C
                    ] ||
                    o.Spread.Sheets.ConditionalFormatting.DateOccurringType
                      .today;
                this.sheet.originalSheet.conditionalFormats.addDateOccurringRule(
                  b,
                  c,
                  s,
                );
                break;
              case x.DuplicateRule:
                this.sheet.originalSheet.conditionalFormats.addDuplicateRule(
                  c,
                  s,
                );
                break;
              case x.FormulaRule:
                if (!r.formula)
                  throw Error("Formula is required for formula rule");
                this.sheet.originalSheet.conditionalFormats.addFormulaRule(
                  r.formula,
                  c,
                  s,
                );
                break;
              case x.SpecificTextRule:
                let T = r.textOperator || P.Contains,
                  k =
                    o.Spread.Sheets.ConditionalFormatting
                      .TextComparisonOperators[T] ||
                    o.Spread.Sheets.ConditionalFormatting
                      .TextComparisonOperators.contains;
                this.sheet.originalSheet.conditionalFormats.addSpecificTextRule(
                  k,
                  r.text || "",
                  c,
                  s,
                );
                break;
              case x.Top10Rule:
                let E = r.top10Type || D.Top,
                  A =
                    o.Spread.Sheets.ConditionalFormatting.Top10ConditionType[
                      E
                    ] ||
                    o.Spread.Sheets.ConditionalFormatting.Top10ConditionType
                      .top;
                this.sheet.originalSheet.conditionalFormats.addTop10Rule(
                  A,
                  r.rank || 10,
                  c,
                  s,
                );
                break;
              case x.UniqueRule:
                this.sheet.originalSheet.conditionalFormats.addUniqueRule(c, s);
                break;
              default:
                throw Error("Unknown conditional formatting style: ".concat(t));
            }
          } catch (e) {
            throw (
              console.error("Error applying conditional formatting:", e),
              Error(
                "Failed to apply conditional formatting: ".concat(
                  e instanceof Error ? e.message : "Unknown error",
                ),
              )
            );
          }
        }
        getStyleFromOptions(e) {
          return e.style
            ? this.sheet.createStyle(e.style)
            : this.createDefaultHighlightStyle();
        }
        createDefaultHighlightStyle() {
          let e = new o.Spread.Sheets.Style();
          return ((e.backColor = "#FFEB9C"), e);
        }
        mapIconSetType(e) {
          return (
            {
              [F.ThreeArrows]:
                o.Spread.Sheets.ConditionalFormatting.IconSetType
                  .threeArrowsColored,
              [F.ThreeTriangles]:
                o.Spread.Sheets.ConditionalFormatting.IconSetType
                  .threeTriangles,
              [F.ThreeTrafficLights]:
                o.Spread.Sheets.ConditionalFormatting.IconSetType
                  .threeTrafficLightsUnrimmed,
              [F.FourTrafficLights]:
                o.Spread.Sheets.ConditionalFormatting.IconSetType
                  .fourTrafficLights,
              [F.FiveArrows]:
                o.Spread.Sheets.ConditionalFormatting.IconSetType
                  .fiveArrowsColored,
              [F.FiveRating]:
                o.Spread.Sheets.ConditionalFormatting.IconSetType.fiveRatings,
            }[e] ||
            o.Spread.Sheets.ConditionalFormatting.IconSetType
              .threeTrafficLightsUnrimmed
          );
        }
        removeConditionalFormatting(e) {
          try {
            let {
              startRow: t,
              startCol: r,
              endRow: o,
              endCol: a,
            } = (0, h.IB)(e);
            this.sheet.originalSheet.conditionalFormats.removeRuleByRange(
              t,
              r,
              o - t + 1,
              a - r + 1,
            );
          } catch (e) {
            throw (
              console.error("Error removing conditional formatting:", e),
              Error(
                "Failed to remove conditional formatting: ".concat(
                  e instanceof Error ? e.message : "Unknown error",
                ),
              )
            );
          }
        }
        clearAllConditionalFormatting() {
          try {
            this.sheet.originalSheet.conditionalFormats.clearRule();
          } catch (e) {
            throw (
              console.error("Error clearing conditional formatting:", e),
              Error(
                "Failed to clear conditional formatting: ".concat(
                  e instanceof Error ? e.message : "Unknown error",
                ),
              )
            );
          }
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      let X = {
          [O.Equal]:
            o.Spread.Sheets.ConditionalFormatting.ComparisonOperators.equalsTo,
          [O.NotEqual]:
            o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
              .notEqualsTo,
          [O.GreaterThan]:
            o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
              .greaterThan,
          [O.GreaterThanOrEqual]:
            o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
              .greaterThanOrEqualsTo,
          [O.LessThan]:
            o.Spread.Sheets.ConditionalFormatting.ComparisonOperators.lessThan,
          [O.LessThanOrEqual]:
            o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
              .lessThanOrEqualsTo,
          [O.Between]:
            o.Spread.Sheets.ConditionalFormatting.ComparisonOperators.between,
          [O.NotBetween]:
            o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
              .notBetween,
        },
        Y = Object.fromEntries(
          Object.entries(X).map((e) => {
            let [t, r] = e;
            return [r, t];
          }),
        ),
        Z = (e) => e === O.Between || e === O.NotBetween;
      class J {
        setDataValidation(e, t) {
          let r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : O.Between,
            a =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {},
            n =
              arguments.length > 4 && void 0 !== arguments[4]
                ? arguments[4]
                : L.Stop,
            i = this.buildValidator(t, r, a, n),
            { startRow: l, startCol: s, endRow: c, endCol: u } = (0, h.IB)(e);
          this.sheet.originalSheet.setDataValidator(
            l,
            s,
            c - l + 1,
            u - s + 1,
            i,
            o.Spread.Sheets.SheetArea.viewport,
          );
        }
        removeDataValidation(e) {
          let { startRow: t, startCol: r, endRow: a, endCol: n } = (0, h.IB)(e);
          this.sheet.originalSheet.setDataValidator(
            t,
            r,
            a - t + 1,
            n - r + 1,
            null,
            o.Spread.Sheets.SheetArea.viewport,
          );
        }
        buildValidator(e, t, r, a) {
          let n,
            i = this.createValidationRule(e, t, r);
          switch (i.type) {
            case "list":
              (n = o.Spread.Sheets.DataValidation.createListValidator(
                i.list,
              )) &&
                void 0 !== r.inCellDropdown &&
                n.inCellDropdown(r.inCellDropdown);
              break;
            case "formulaList":
              (n = o.Spread.Sheets.DataValidation.createFormulaListValidator(
                i.formula,
              )) &&
                void 0 !== r.inCellDropdown &&
                n.inCellDropdown(r.inCellDropdown);
              break;
            case "number":
              n = o.Spread.Sheets.DataValidation.createNumberValidator(
                X[t] ||
                  o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
                    .between,
                i.value1,
                i.value2,
                i.isInteger,
              );
              break;
            case "date":
              n = o.Spread.Sheets.DataValidation.createDateValidator(
                X[t] ||
                  o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
                    .between,
                i.date1,
                i.date2,
              );
              break;
            case "time":
              n = o.Spread.Sheets.DataValidation.createTimeValidator(
                X[t] ||
                  o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
                    .between,
                i.time1,
                i.time2,
              );
              break;
            case "textLength":
              n = o.Spread.Sheets.DataValidation.createTextLengthValidator(
                X[t] ||
                  o.Spread.Sheets.ConditionalFormatting.ComparisonOperators
                    .between,
                i.value1,
                i.value2,
              );
              break;
            case "custom":
              n = o.Spread.Sheets.DataValidation.createFormulaValidator(
                i.formula,
              );
              break;
            default:
              n = new o.Spread.Sheets.DataValidation.DefaultDataValidator();
          }
          return (this.applyValidatorSettings(n, r, a), n);
        }
        createValidationRule(e, t, r) {
          var o, a;
          switch (e) {
            case M.List:
              return {
                type: "list",
                list: (null == (o = r.listSource) ? void 0 : o.join(",")) || "",
              };
            case M.FormulaList:
              return {
                type: "formulaList",
                formula: r.formula || "",
              };
            case M.WholeNumber:
            case M.Decimal:
              return {
                type: "number",
                value1: String(null != (a = r.value1) ? a : 0),
                value2: this.getSecondValue(r.value1, r.value2, t),
                isInteger: e === M.WholeNumber,
              };
            case M.Date:
              let n = (e) =>
                e instanceof Date ? e : new Date(e || Date.now());
              return {
                type: "date",
                date1: n(r.startDate),
                date2: Z(t) && r.endDate ? n(r.endDate) : void 0,
              };
            case M.Time:
              return {
                type: "time",
                time1: String(r.startDate || "00:00"),
                time2: this.getSecondValue(
                  r.startDate || "00:00",
                  r.endDate,
                  t,
                ),
              };
            case M.TextLength:
              let { v1: i, v2: l } = this.getTextLengthValues(t, r);
              return {
                type: "textLength",
                value1: i,
                value2: l,
              };
            case M.Custom:
              return {
                type: "custom",
                formula: r.formula || "TRUE",
              };
            default:
              throw Error("Unknown validation type: ".concat(e));
          }
        }
        getSecondValue(e, t, r) {
          return r === O.Equal
            ? String(e)
            : Z(r)
              ? void 0 !== t
                ? String(t)
                : String(e)
              : void 0;
        }
        getTextLengthValues(e, t) {
          var r, o, a;
          if (Z(e))
            return {
              v1: String(null != (r = t.minLength) ? r : 0),
              v2: String(null != (o = t.maxLength) ? o : 0),
            };
          let n = String(
            null !=
              (a =
                e === O.LessThan || e === O.LessThanOrEqual
                  ? t.maxLength
                  : t.minLength)
              ? a
              : 0,
          );
          return {
            v1: n,
            v2: e === O.Equal ? n : void 0,
          };
        }
        applyValidatorSettings(e, t, r) {
          if (!e) return;
          (e.ignoreBlank(!1 !== t.allowBlank),
            e.showInputMessage(!0 === t.showInputMessage),
            e.showErrorMessage(!1 !== t.showErrorAlert),
            t.inputTitle && e.inputTitle(t.inputTitle),
            t.inputMessage && e.inputMessage(t.inputMessage),
            t.errorTitle && e.errorTitle(t.errorTitle),
            t.errorMessage && e.errorMessage(t.errorMessage));
          let a = {
            [L.Stop]: o.Spread.Sheets.DataValidation.ErrorStyle.stop,
            [L.Warning]: o.Spread.Sheets.DataValidation.ErrorStyle.warning,
            [L.Information]:
              o.Spread.Sheets.DataValidation.ErrorStyle.information,
          };
          e.errorStyle(a[r]);
        }
        getDataValidation(e) {
          try {
            var t, r;
            let { row: a, col: n } = (0, h.VW)(e),
              i = this.sheet.originalSheet.getDataValidator(
                a,
                n,
                o.Spread.Sheets.SheetArea.viewport,
              );
            if (!i) return null;
            let l = this.mapBackValidationType(i.type()),
              s = null == (t = i.value1) ? void 0 : t.call(i),
              c = null == (r = i.value2) ? void 0 : r.call(i),
              u = i.comparisonOperator(),
              { validationType: d, operator: g } = this.detectValidationType(
                l,
                s,
                c,
                u,
              ),
              m = this.buildValidationOptions(d, g, i, s, c),
              p = this.getErrorStyle(i.errorStyle());
            return {
              validationType: d,
              operator: g,
              options: m,
              errorStyle: p,
            };
          } catch (e) {
            return (console.error("Error getting data validation:", e), null);
          }
        }
        detectValidationType(e, t, r, o) {
          let a =
              e === M.List &&
              "string" == typeof t &&
              /^[=$]?\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+$/.test(t)
                ? M.FormulaList
                : e,
            n = Y[o] || O.Between;
          return (
            n === O.Between && t === r && (n = O.Equal),
            {
              validationType: a,
              operator: n,
            }
          );
        }
        buildValidationOptions(e, t, r, o, a) {
          let n = {
            inCellDropdown: r.inCellDropdown(),
            allowBlank: r.ignoreBlank(),
            showInputMessage: r.showInputMessage(),
            inputTitle: r.inputTitle(),
            inputMessage: r.inputMessage(),
            showErrorAlert: r.showErrorMessage(),
            errorTitle: r.errorTitle(),
            errorMessage: r.errorMessage(),
          };
          switch (e) {
            case M.List:
              n.listSource = o.split(",");
              break;
            case M.FormulaList:
            case M.Custom:
              n.formula = o;
              break;
            case M.WholeNumber:
            case M.Decimal:
              ((n.value1 = Number(o)), (n.value2 = Z(t) ? Number(a) : void 0));
              break;
            case M.Date:
              ((n.startDate = o instanceof Date ? o : new Date(o)),
                (n.endDate =
                  a && Z(t) ? (a instanceof Date ? a : new Date(a)) : void 0));
              break;
            case M.Time:
              ((n.startDate =
                "string" == typeof o ? o : this.decimalFractionToTime(o)),
                (n.endDate =
                  a && Z(t)
                    ? "string" == typeof a
                      ? a
                      : this.decimalFractionToTime(a)
                    : void 0));
              break;
            case M.TextLength:
              let i = Number(o),
                l = a ? Number(a) : void 0;
              Z(t)
                ? ((n.minLength = i), (n.maxLength = l))
                : t === O.LessThan || t === O.LessThanOrEqual
                  ? (n.maxLength = i)
                  : (n.minLength = i);
              break;
            default:
              ((n.value1 = o), (n.value2 = a));
          }
          return n;
        }
        getErrorStyle(e) {
          return e === o.Spread.Sheets.DataValidation.ErrorStyle.warning
            ? L.Warning
            : e === o.Spread.Sheets.DataValidation.ErrorStyle.information
              ? L.Information
              : L.Stop;
        }
        mapBackValidationType(e) {
          return (
            {
              [o.Spread.Sheets.DataValidation.CriteriaType.list]: M.List,
              [o.Spread.Sheets.DataValidation.CriteriaType.wholeNumber]:
                M.WholeNumber,
              [o.Spread.Sheets.DataValidation.CriteriaType.decimalValues]:
                M.Decimal,
              [o.Spread.Sheets.DataValidation.CriteriaType.date]: M.Date,
              [o.Spread.Sheets.DataValidation.CriteriaType.time]: M.Time,
              [o.Spread.Sheets.DataValidation.CriteriaType.textLength]:
                M.TextLength,
              [o.Spread.Sheets.DataValidation.CriteriaType.custom]: M.Custom,
            }[e] || M.Custom
          );
        }
        decimalFractionToTime(e) {
          let t = 24 * e,
            r = Math.floor(t),
            o = Math.floor((t - r) * 60),
            a = Math.floor(((t - r) * 60 - o) * 60),
            n = (e) => e.toString().padStart(2, "0");
          return a > 0
            ? "".concat(n(r), ":").concat(n(o), ":").concat(n(a))
            : "".concat(n(r), ":").concat(n(o));
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      class K {
        setRangeFormatting(e, t) {
          let { startRow: r, startCol: o, endRow: a, endCol: n } = (0, h.IB)(e);
          for (let e = r; e <= a; e++)
            for (let r = o; r <= n; r++) {
              let o = "".concat((0, h.dE)(r)).concat(e + 1);
              this.sheet.setFormatterAt(o, t);
            }
        }
        detectFormatType(e) {
          if (null == e || "" === e) return "General";
          if ("number" == typeof e)
            if (e % 1 == 0) return "#,##0";
            else return "#,##0.00";
          return e instanceof Date
            ? "yyyy-mm-dd"
            : "string" == typeof e
              ? /^[$€¥£]\d/.test(e)
                ? "$#,##0.00"
                : /\d+%$/.test(e)
                  ? "0.00%"
                  : /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(e)
                    ? "mm/dd/yyyy"
                    : /^\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM)?$/i.test(e)
                      ? "hh:mm:ss"
                      : /^\d+\.?\d*[eE][+-]?\d+$/.test(e)
                        ? "0.00E+00"
                        : "@"
              : "General";
        }
        parseValueForFormat(e) {
          if ("string" != typeof e) return e;
          let t = parseFloat(e.replace(/[$,€¥£%]/g, ""));
          if (!isNaN(t)) return e.includes("%") ? t / 100 : t;
          let r = new Date(e);
          return isNaN(r.getTime()) ? e : r;
        }
        _autoFormatCell(e, t) {
          if ("number" != typeof e || e < 0 || !Number.isInteger(e))
            throw Error(
              "Invalid row: ".concat(e, ". Must be a non-negative integer."),
            );
          if ("number" != typeof t || t < 0 || !Number.isInteger(t))
            throw Error(
              "Invalid col: ".concat(t, ". Must be a non-negative integer."),
            );
          let r = this.sheet.getValue(e, t),
            o = this.detectFormatType(r),
            a = "".concat((0, h.dE)(t)).concat(e + 1);
          this.sheet.setFormatterAt(a, o);
        }
        autoFormatCellAt(e) {
          let { row: t, col: r } = (0, h.VW)(e);
          this._autoFormatCell(t, r);
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      class Q {
        getName() {
          return this.pivotTableName;
        }
        getConfig() {
          return this.delegate.getPivotTableConfig(this.pivotTableName);
        }
        addField(e, t, r) {
          this.delegate.addPivotField(this.pivotTableName, e, t, r);
        }
        addValueField(e, t, r, o) {
          this.delegate.addPivotValueField(this.pivotTableName, e, t, r, o);
        }
        removeField(e) {
          this.delegate.removePivotField(this.pivotTableName, e);
        }
        changeAggregation(e, t) {
          this.delegate.changePivotAggregation(this.pivotTableName, e, t);
        }
        renameValueField(e, t) {
          this.delegate.renamePivotValueField(this.pivotTableName, e, t);
        }
        refresh() {
          this.delegate.refreshPivotTable(this.pivotTableName);
        }
        constructor(e, t) {
          ((this.pivotTableName = e), (this.delegate = t));
        }
      }
      function ee() {
        var e, t;
        return null != (t = o.Pivot) ? t : null == (e = a()) ? void 0 : e.Pivot;
      }
      function et(e) {
        let t = ee().SubtotalType;
        switch (e) {
          case "average":
            return t.average;
          case "count":
            return t.count;
          case "countNums":
            return t.countNums;
          case "max":
            return t.max;
          case "min":
            return t.min;
          case "product":
            return t.product;
          case "stdDev":
            return t.stdDev;
          case "stdDevp":
            return t.stdDevp;
          case "sum":
          default:
            return t.sum;
          case "var":
            return t.varr;
          case "varp":
            return t.varp;
        }
      }
      class er {
        addPivotTable(e) {
          if (!e.name || !e.dataSource)
            throw Error("Pivot table name and dataSource are required");
          let t = e.name.replace(/[^a-zA-Z0-9_]/g, "_"),
            r = e.dataSource;
          if (e.dataSource.includes(":")) {
            if (!e.dataSource.includes("!"))
              throw Error(
                'Range data source must include sheet name (e.g., "Sheet1!A1:H100")',
              );
            let t = e.dataSource.split("!");
            if (2 === t.length) {
              let e = (0, h.Ge)(t[0]),
                o = t[1];
              r = "".concat(e, "!").concat(o);
            }
          }
          if (
            this.sheet.originalSheet.pivotTables &&
            this.sheet.originalSheet.pivotTables.get(t)
          )
            throw Error('Pivot table "'.concat(e.name, '" already exists'));
          let a = e.targetAddress ? (0, h.VW)(e.targetAddress).row : 0,
            n = e.targetAddress ? (0, h.VW)(e.targetAddress).col : 0,
            i = o.Spread.Pivot.PivotTableLayoutType.tabular,
            l = o.Spread.Pivot.PivotTableThemes.light1,
            s = {
              showRowHeader: !0,
              showColumnHeader: !0,
              grandTotalPosition: this.getGrandTotalPosition(!0, !0),
              showDrill: !0,
              showFilter: !0,
              fillDownLabels: !1,
              insertBlankLineAfterEachItem: !1,
              bandRows: !1,
              bandColumns: !1,
              showMissing: !1,
            },
            c = this.sheet.originalSheet.pivotTables.add(t, r, a, n, i, l, s);
          try {
            if (
              (c.suspendLayout(),
              e.rowFields &&
                e.rowFields.length > 0 &&
                e.rowFields.forEach((e, t) => {
                  c.add(
                    e,
                    e,
                    o.Spread.Pivot.PivotTableFieldType.rowField,
                    void 0,
                    t,
                  );
                }),
              e.columnFields &&
                e.columnFields.length > 0 &&
                e.columnFields.forEach((e, t) => {
                  c.add(
                    e,
                    e,
                    o.Spread.Pivot.PivotTableFieldType.columnField,
                    void 0,
                    t,
                  );
                }),
              e.valueFields && e.valueFields.length > 0)
            ) {
              let t = ee();
              e.valueFields.forEach((e, r) => {
                let a = {
                  average: t.SubtotalType.average,
                  count: t.SubtotalType.count,
                  countNums: t.SubtotalType.countNums,
                  max: t.SubtotalType.max,
                  min: t.SubtotalType.min,
                  product: t.SubtotalType.product,
                  stdDev: t.SubtotalType.stdDev,
                  stdDevp: t.SubtotalType.stdDevp,
                  sum: t.SubtotalType.sum,
                  var: t.SubtotalType.varr,
                  varp: t.SubtotalType.varp,
                };
                if (!(e.aggregation in a))
                  throw Error(
                    "Invalid aggregation type: "
                      .concat(e.aggregation, ". Must be one of: ")
                      .concat(Object.keys(a).join(", ")),
                  );
                let n = a[e.aggregation],
                  i =
                    e.label || "".concat(e.aggregation, " of ").concat(e.field);
                c.add(
                  e.field,
                  i,
                  o.Spread.Pivot.PivotTableFieldType.valueField,
                  n,
                  r,
                );
              });
            }
            e.filterFields &&
              e.filterFields.length > 0 &&
              e.filterFields.forEach((e, t) => {
                c.add(
                  e,
                  e,
                  o.Spread.Pivot.PivotTableFieldType.filterField,
                  void 0,
                  t,
                );
              });
          } finally {
            c.resumeLayout();
          }
          let u = c.getRange();
          if (u && u.content) {
            let e = u.content.col,
              t = u.content.col + u.content.colCount - 1;
            for (let r = e; r <= t; r++)
              this.sheet.originalSheet.autoFitColumn(r);
          }
          return this.getPivotTableProperties(c);
        }
        removePivotTable(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          let t = e.replace(/[^a-zA-Z0-9_]/g, "_");
          if (!this.sheet.originalSheet.pivotTables.get(t))
            throw Error('Pivot table "'.concat(e, '" not found'));
          this.sheet.originalSheet.pivotTables.remove(t);
        }
        listPivotTables() {
          return this.sheet.originalSheet.pivotTables
            .all()
            .map((e) => this.getPivotTableProperties(e));
        }
        getPivotTableHandle(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          let t = e.replace(/[^a-zA-Z0-9_]/g, "_");
          if (!this.sheet.originalSheet.pivotTables.get(t))
            throw Error('Pivot table "'.concat(e, '" not found'));
          return new Q(e, this);
        }
        getPivotTableConfig(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          let t = e.replace(/[^a-zA-Z0-9_]/g, "_"),
            r = this.sheet.originalSheet.pivotTables.get(t);
          if (!r) throw Error('Pivot table "'.concat(e, '" not found'));
          let a = r.getFieldsByArea(
              o.Spread.Pivot.PivotTableFieldType.rowField,
            ),
            n = r.getFieldsByArea(
              o.Spread.Pivot.PivotTableFieldType.columnField,
            ),
            i = r.getFieldsByArea(
              o.Spread.Pivot.PivotTableFieldType.filterField,
            ),
            l = r.getFieldsByArea(
              o.Spread.Pivot.PivotTableFieldType.valueField,
            ),
            s = r.getSource() || "",
            { contentArea: c, filterArea: h } = this.getPivotTableProperties(r),
            u = (l || []).map((e) => {
              let t = (function (e) {
                let t = ee().SubtotalType;
                switch (e) {
                  case t.average:
                    return "average";
                  case t.count:
                    return "count";
                  case t.max:
                    return "max";
                  case t.min:
                    return "min";
                  case t.sum:
                  default:
                    return "sum";
                }
              })(r.subtotalType(e.fieldName));
              return {
                field: e.sourceName || e.fieldName,
                label: e.fieldName,
                aggregation: t,
              };
            });
          return {
            name: r.name() || t,
            dataSource: s,
            rowFields: (a || []).map((e) => e.fieldName),
            columnFields: (n || []).map((e) => e.fieldName),
            filterFields: (i || []).map((e) => e.fieldName),
            valueFields: u,
            contentArea: c,
            filterArea: h,
          };
        }
        addPivotField(e, t, r, a) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          if ("string" != typeof t || "" === t.trim())
            throw Error("field must be a non-empty string");
          if (!["row", "column", "filter"].includes(r))
            throw Error("area must be one of: row, column, filter");
          let n = e.replace(/[^a-zA-Z0-9_]/g, "_"),
            i = this.sheet.originalSheet.pivotTables.get(n);
          if (!i) throw Error('Pivot table "'.concat(e, '" not found'));
          let l = (function (e) {
            let t = o.Spread.Pivot.PivotTableFieldType;
            switch (e) {
              case "row":
                return t.rowField;
              case "column":
                return t.columnField;
              case "filter":
                return t.filterField;
            }
          })(r);
          i.suspendLayout();
          try {
            i.add(t, t, l, void 0, a);
          } finally {
            i.resumeLayout();
          }
        }
        addPivotValueField(e, t, r, a, n) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          if ("string" != typeof t || "" === t.trim())
            throw Error("field must be a non-empty string");
          let i = [
            "average",
            "count",
            "countNums",
            "max",
            "min",
            "product",
            "stdDev",
            "stdDevp",
            "sum",
            "var",
            "varp",
          ];
          if (!i.includes(r))
            throw Error(
              "Invalid aggregation type: "
                .concat(r, ". Must be one of: ")
                .concat(i.join(", ")),
            );
          let l = e.replace(/[^a-zA-Z0-9_]/g, "_"),
            s = this.sheet.originalSheet.pivotTables.get(l);
          if (!s) throw Error('Pivot table "'.concat(e, '" not found'));
          let c = a || "".concat(r, " of ").concat(t),
            h = et(r);
          s.suspendLayout();
          try {
            s.add(t, c, o.Spread.Pivot.PivotTableFieldType.valueField, h, n);
          } finally {
            s.resumeLayout();
          }
        }
        removePivotField(e, t) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          if ("string" != typeof t || "" === t.trim())
            throw Error("fieldName must be a non-empty string");
          let r = e.replace(/[^a-zA-Z0-9_]/g, "_"),
            o = this.sheet.originalSheet.pivotTables.get(r);
          if (!o) throw Error('Pivot table "'.concat(e, '" not found'));
          o.remove(t);
        }
        changePivotAggregation(e, t, r) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          if ("string" != typeof t || "" === t.trim())
            throw Error("valueFieldLabel must be a non-empty string");
          let o = ["average", "count", "max", "min", "sum"];
          if (!o.includes(r))
            throw Error(
              "Invalid aggregation type: "
                .concat(r, ". Must be one of: ")
                .concat(o.join(", ")),
            );
          let a = e.replace(/[^a-zA-Z0-9_]/g, "_"),
            n = this.sheet.originalSheet.pivotTables.get(a);
          if (!n) throw Error('Pivot table "'.concat(e, '" not found'));
          let i = et(r);
          n.subtotalType(t, i);
        }
        renamePivotValueField(e, t, r) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          if ("string" != typeof t || "" === t.trim())
            throw Error("currentLabel must be a non-empty string");
          if ("string" != typeof r || "" === r.trim())
            throw Error("newLabel must be a non-empty string");
          let o = e.replace(/[^a-zA-Z0-9_]/g, "_"),
            a = this.sheet.originalSheet.pivotTables.get(o);
          if (!a) throw Error('Pivot table "'.concat(e, '" not found'));
          a.updateFieldName(t, r);
        }
        refreshPivotTable(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          let t = e.replace(/[^a-zA-Z0-9_]/g, "_"),
            r = this.sheet.originalSheet.pivotTables.get(t);
          if (!r) throw Error('Pivot table "'.concat(e, '" not found'));
          r.updateSource();
        }
        getPivotTableProperties(e) {
          let t = e.getRange(),
            r = "",
            o = "";
          if (t) {
            if (t.content && t.content.rowCount > 0 && t.content.colCount > 0) {
              let { row: e, col: o, rowCount: a, colCount: n } = t.content,
                i = (0, h.pC)(e, o),
                l = (0, h.pC)(e + a - 1, o + n - 1);
              r = "".concat(i, ":").concat(l);
            }
            if (t.page && t.page.rowCount > 0 && t.page.colCount > 0) {
              let { row: e, col: r, rowCount: a, colCount: n } = t.page,
                i = (0, h.pC)(e, r),
                l = (0, h.pC)(e + a - 1, r + n - 1);
              o = "".concat(i, ":").concat(l);
            }
          }
          return {
            name: e.name() || "",
            contentArea: r,
            filterArea: o,
          };
        }
        getGrandTotalPosition(e, t) {
          return e && t
            ? o.Spread.Pivot.GrandTotalPosition.both
            : e
              ? o.Spread.Pivot.GrandTotalPosition.row
              : t
                ? o.Spread.Pivot.GrandTotalPosition.col
                : o.Spread.Pivot.GrandTotalPosition.none;
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      class eo {
        addRowsAt(e, t) {
          let r = parseInt(e);
          if (isNaN(r) || r < 1)
            throw Error(
              'Invalid row address: "'.concat(
                e,
                '". Must be a positive integer.',
              ),
            );
          if (!Number.isInteger(t) || t < 1)
            throw Error(
              "Invalid count: ".concat(t, ". Must be a positive integer."),
            );
          (this.sheet.originalSheet.addRows(r - 1, t),
            this.clearInsertChanges());
        }
        clearInsertChanges() {
          this.sheet.originalSheet.clearPendingChanges({
            clearType: o.Spread.Sheets.ClearPendingChangeType.insert,
          });
        }
        deleteRowsAt(e, t) {
          let r = parseInt(e);
          if (isNaN(r) || r < 1)
            throw Error(
              'Invalid row address: "'.concat(
                e,
                '". Must be a positive integer.',
              ),
            );
          if (!Number.isInteger(t) || t < 1)
            throw Error(
              "Invalid count: ".concat(t, ". Must be a positive integer."),
            );
          return this.sheet.originalSheet.deleteRows(r - 1, t);
        }
        addColumnsAt(e, t) {
          if (!e.match(/^[A-Z]+/))
            throw Error("Invalid column letter: ".concat(e));
          let r = (0, h.VW)("".concat(e, "1")).col;
          (this.sheet.originalSheet.addColumns(r, t),
            this.clearInsertChanges());
        }
        deleteColumnsAt(e, t) {
          if (!e.match(/^[A-Z]+/))
            throw Error("Invalid column letter: ".concat(e));
          let r = (0, h.VW)("".concat(e, "1")).col;
          return this.sheet.originalSheet.deleteColumns(r, t);
        }
        autoFitRowAt(e) {
          let t = parseInt(e);
          if (isNaN(t) || t < 1)
            throw Error(
              'Invalid row address: "'.concat(
                e,
                '". Must be a positive integer.',
              ),
            );
          return this.sheet.originalSheet.autoFitRow(t - 1);
        }
        autoFitColumnAt(e) {
          if (!e.match(/^[A-Z]+/))
            throw Error("Invalid column letter: ".concat(e));
          let t = (0, h.VW)("".concat(e, "1")).col;
          return this.sheet.originalSheet.autoFitColumn(t);
        }
        setRowVisibleAt(e, t) {
          let r = parseInt(e);
          if (isNaN(r) || r < 1)
            throw Error(
              'Invalid row address: "'.concat(
                e,
                '". Must be a positive integer.',
              ),
            );
          return this.sheet.originalSheet.setRowVisible(r - 1, t);
        }
        setColumnVisibleAt(e, t) {
          if (!e.match(/^[A-Z]+/))
            throw Error("Invalid column letter: ".concat(e));
          let r = (0, h.VW)("".concat(e, "1")).col;
          return this.sheet.originalSheet.setColumnVisible(r, t);
        }
        addSpanAt(e, t, r) {
          let o, a;
          if (!Number.isInteger(t) || t < 1)
            throw Error(
              "Invalid rowCount: ".concat(t, ". Must be a positive integer."),
            );
          if (!Number.isInteger(r) || r < 1)
            throw Error(
              "Invalid colCount: ".concat(r, ". Must be a positive integer."),
            );
          try {
            let t = (0, h.VW)(e);
            ((o = t.row), (a = t.col));
          } catch (t) {
            throw Error('Invalid address: "'.concat(e, '"'));
          }
          return this.sheet.originalSheet.addSpan(o, a, t, r);
        }
        removeSpanAt(e) {
          let { row: t, col: r } = (0, h.VW)(e);
          return this.sheet.originalSheet.removeSpan(t, r);
        }
        clearData(e) {
          let { startRow: t, startCol: r, endRow: a, endCol: n } = (0, h.IB)(e),
            i = o.Spread.Sheets.SheetArea.viewport,
            l = o.Spread.Sheets.StorageType.data;
          for (let e = t; e <= a; e++)
            for (let t = r; t <= n; t++)
              (this.sheet.originalSheet.conditionalFormats.removeRuleByRange(
                e,
                t,
                1,
                1,
              ),
                this.sheet.originalSheet.clear(e, t, 1, 1, i, l));
          return !0;
        }
        clearFormatting(e) {
          let { startRow: t, startCol: r, endRow: a, endCol: n } = (0, h.IB)(e),
            i = o.Spread.Sheets.SheetArea.viewport,
            l = o.Spread.Sheets.StorageType.style;
          for (let e = t; e <= a; e++)
            for (let t = r; t <= n; t++)
              (this.sheet.originalSheet.conditionalFormats.removeRuleByRange(
                e,
                t,
                1,
                1,
              ),
                this.sheet.originalSheet.clear(e, t, 1, 1, i, l));
          return !0;
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      class ea {
        regexSearch(e, t) {
          var r;
          if (!Array.isArray(e)) throw Error("patterns must be an array");
          if (0 === e.length) throw Error("patterns array cannot be empty");
          let o = null != (r = null == t ? void 0 : t.matchCase) && r,
            a = [],
            n = [];
          for (let t of e) {
            if ("string" != typeof t)
              throw Error(
                "Invalid pattern type: expected string, got ".concat(typeof t),
              );
            try {
              n.push(new RegExp(t, o ? "g" : "gi"));
            } catch (e) {
              throw Error('Invalid regex pattern: "'.concat(t, '"'), {
                cause: e,
              });
            }
          }
          let i = this.sheet.getUsedRangeAsObject();
          if (!i || 0 === i.rowCount || 0 === i.colCount) return a;
          let l = this.sheet.originalSheet.getArray(
            i.row,
            i.col,
            i.rowCount,
            i.colCount,
          );
          for (let e = 0; e < l.length; e++)
            for (let t = 0; t < l[e].length; t++) {
              let r = l[e][t];
              if (null == r || "" === r) continue;
              let o = String(r);
              if (n.some((e) => ((e.lastIndex = 0), e.test(o)))) {
                let o = i.row + e,
                  n = i.col + t,
                  l = "".concat((0, h.dE)(n)).concat(o + 1);
                a.push({
                  address: l,
                  value: r,
                });
              }
            }
          return a;
        }
        getDependentCells(e) {
          let { row: t, col: r } = (0, h.VW)(e),
            o = this.sheet.originalSheet.getDependents(t, r);
          if (0 === o.length) return "";
          let a = o.slice(0, 20).map((e) => {
              let t = "".concat((0, h.dE)(e.col)).concat(e.row + 1),
                r = this.sheet.getCell(t, !1, !0);
              return "".concat(t, ": ").concat(r);
            }),
            n = "The following cell(s) depend on this cell: ".concat(
              a.join(", "),
            );
          return (
            o.length > 20 && (n += "... and ".concat(o.length - 20, " more")),
            n
          );
        }
        getDirtyCells() {
          let e = this.sheet.getUsedRangeAsObject(),
            t = this.sheet.originalSheet.getRowCount(),
            r = this.sheet.originalSheet.getColumnCount(),
            a = e ? Math.min(e.row + e.rowCount + 100, t) : Math.min(1e3, t),
            n = e ? Math.min(e.col + e.colCount + 20, r) : Math.min(100, r),
            i = this.sheet.originalSheet.getDirtyCells(0, 0, a, n);
          if (0 === i.length || i.length > 1e3) return [];
          let l = this.sheet.getName();
          return i.map((e) => {
            let t = e.newValue,
              r =
                void 0 !== t
                  ? t
                  : this.sheet.originalSheet.getValue(e.row, e.col);
            return {
              sheet: l,
              address: "".concat((0, h.dE)(e.col)).concat(e.row + 1),
              value: r,
              displayValue: this.sheet.originalSheet.getText(e.row, e.col),
              oldValue: e.oldValue,
              formula: this.sheet.getFormula(e.row, e.col),
              numberFormat:
                this.sheet.originalSheet.getFormatter(
                  e.row,
                  e.col,
                  o.Spread.Sheets.SheetArea.viewport,
                ) || "",
            };
          });
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      class en {
        extractRegions() {
          let e = this.findDataRegions();
          if (0 === e.length) return "No data chunks found";
          let t = {
            dataChunks: e.map((e) => ({
              range: e.range,
              description: e.description,
              hasHeaders: e.hasHeaders,
              dataType: e.dataType,
              density: e.density,
              sampleCells: e.sampleCells,
            })),
          };
          return this.formatRegionSummary(t);
        }
        findDataRegions() {
          let { values: e, startRow: t, startCol: r } = this.gridData;
          return e && 0 !== e.length && 0 !== e[0].length
            ? (function (e) {
                let t =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : 2,
                  r =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : {},
                  { minCellCount: o = 1, trackCellPositions: a = !1 } = r;
                if (!e.length || !e[0].length) return [];
                let n = (function (e) {
                    let t =
                        arguments.length > 1 && void 0 !== arguments[1]
                          ? arguments[1]
                          : 1,
                      r = e.map((e) => [...e]);
                    for (let e = 0; e < t; e++) {
                      let e = r.map((e) => [...e]);
                      for (let t = 0; t < r.length; t++)
                        for (let o = 0; o < r[0].length; o++)
                          if (1 === r[t][o])
                            for (let a = -1; a <= 1; a++)
                              for (let n = -1; n <= 1; n++) {
                                let i = t + a,
                                  l = o + n;
                                i >= 0 &&
                                  i < r.length &&
                                  l >= 0 &&
                                  l < r[0].length &&
                                  (e[i][l] = 1);
                              }
                      r = e;
                    }
                    return r;
                  })(e, t),
                  i = [];
                return (
                  l(n, (t, r, l) => {
                    let c = t,
                      h = t,
                      u = r,
                      d = r;
                    s(n, l, t, r, (e, t) => {
                      ((c = Math.min(c, e)),
                        (h = Math.max(h, e)),
                        (u = Math.min(u, t)),
                        (d = Math.max(d, t)));
                    });
                    let g = 0,
                      m = [];
                    for (let t = c; t <= h; t++)
                      for (let r = u; r <= d; r++)
                        t >= 0 &&
                          t < e.length &&
                          r >= 0 &&
                          r < e[0].length &&
                          1 === e[t][r] &&
                          (g++,
                          a &&
                            m.push({
                              r: t,
                              c: r,
                            }));
                    if (g >= o) {
                      let e = (h - c + 1) * (d - u + 1),
                        t = e > 0 ? g / e : 0,
                        r = {
                          minRow: c,
                          maxRow: h,
                          minCol: u,
                          maxCol: d,
                          actualCellCount: g,
                          totalCellsInRegion: e,
                          density: t,
                        };
                      (a && (r.actualCells = m), i.push(r));
                    }
                  }),
                  i
                );
              })(
                c(e.length, e[0].length, (t, r) => this.hasValue(e[t][r])),
                this.dilationIterations,
                {
                  minCellCount: 4,
                },
              ).map((e) => {
                let o = this.getRegionData(
                  e.minRow,
                  e.minCol,
                  e.maxRow,
                  e.maxCol,
                );
                return {
                  range: this.formatRange(
                    e.minRow,
                    e.minCol,
                    e.maxRow,
                    e.maxCol,
                    t,
                    r,
                  ),
                  minRow: e.minRow,
                  maxRow: e.maxRow,
                  minCol: e.minCol,
                  maxCol: e.maxCol,
                  cellCount: e.actualCellCount,
                  density: e.density,
                  hasHeaders: this.detectHeaders(o),
                  dataType: this.detectDataType(o),
                  description: this.generateRegionDescription(o, e.density),
                  sampleCells: this.getSampleCells(
                    o,
                    e.minRow + t,
                    e.minCol + r,
                  ),
                };
              })
            : [];
        }
        formatRange(e, t, r, o, a, n) {
          return ""
            .concat((0, h.dE)(t + n))
            .concat(e + a + 1, ":")
            .concat((0, h.dE)(o + n))
            .concat(r + a + 1);
        }
        getRegionData(e, t, r, o) {
          let a = [];
          for (let n = e; n <= r; n++) {
            let e = [];
            for (let r = t; r <= o; r++) e.push(this.gridData.values[n][r]);
            a.push(e);
          }
          return a;
        }
        hasValue(e) {
          return null != e && "" !== e;
        }
        detectHeaders(e) {
          if (e.length < 2) return !1;
          let t = e[0].filter((e) => this.hasValue(e));
          return (
            0 !== t.length &&
            t.filter((e) => "string" == typeof e && isNaN(Number(e))).length /
              t.length >=
              0.6
          );
        }
        detectDataType(e) {
          let t = 0,
            r = 0,
            o = 0,
            a = 0;
          for (let n of e)
            for (let e of n)
              this.hasValue(e) &&
                (a++,
                "number" != typeof e &&
                (isNaN(Number(e)) || "" === String(e).trim())
                  ? e instanceof Date
                    ? o++
                    : r++
                  : t++);
          if (0 === a) return "empty";
          let n = t / a,
            i = o / a,
            l = r / a;
          return n > 0.5
            ? "numeric"
            : l > 0.5
              ? "text"
              : i > 0.3
                ? "mixed_with_dates"
                : "mixed";
        }
        generateRegionDescription(e, t) {
          var r;
          let o = e.length,
            a = (null == (r = e[0]) ? void 0 : r.length) || 0,
            n = this.detectHeaders(e),
            i = this.detectDataType(e),
            l = ["".concat(o, "x").concat(a, " data region")],
            s = Math.round(100 * t);
          if ((l.push("".concat(s, "% filled")), n && e[0])) {
            let t = e[0]
              .filter((e) => this.hasValue(e))
              .slice(0, 3)
              .map((e) => String(e));
            t.length > 0 &&
              l.push(
                "headers: "
                  .concat(t.join(", "))
                  .concat(t.length < a ? "..." : ""),
              );
          }
          return (l.push("type: ".concat(i)), l.join(", "));
        }
        getSampleCells(e, t, r) {
          var o;
          let a =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : 5,
            n = [],
            i = Math.max(
              1,
              Math.floor(
                (e.length * ((null == (o = e[0]) ? void 0 : o.length) || 0)) /
                  a,
              ),
            ),
            l = 0;
          for (let o = 0; o < e.length && n.length < a; o++)
            for (let s = 0; s < e[o].length && n.length < a; s++)
              if (this.hasValue(e[o][s]) && l++ % i == 0) {
                let a = t + o,
                  i = r + s,
                  l = "".concat((0, h.dE)(i)).concat(a + 1);
                n.push({
                  address: l,
                  value: String(e[o][s]),
                });
              }
          return n;
        }
        formatRegionSummary(e) {
          return e && e.dataChunks
            ? e.dataChunks
                .map((e) => {
                  let t = "";
                  return (
                    (t += "range: ".concat(e.range, "\n")),
                    (t += "description: ".concat(e.description, "\n")),
                    e.sampleCells &&
                      e.sampleCells.length > 0 &&
                      ((t += "randomly sampled cells:\n"),
                      e.sampleCells.forEach((e) => {
                        t += "  ".concat(e.address, ": ").concat(e.value, "\n");
                      })),
                    (t += "hasHeaders: ".concat(e.hasHeaders, "\n")),
                    (t += "dataType: ".concat(e.dataType, "\n")),
                    (t += "density: ".concat(Math.round(100 * e.density), "%"))
                  );
                })
                .join("\n\n")
            : "No data chunks found";
        }
        constructor(e, t = 1) {
          ((this.gridData = e), (this.dilationIterations = t));
        }
      }
      class ei {
        getSheetSummary() {
          let e =
              !(arguments.length > 0) ||
              void 0 === arguments[0] ||
              arguments[0],
            t = this.sheet.getUsedRangeAsObject();
          if (!t) return "";
          let r = "".concat((0, h.dE)(t.col)).concat(t.row + 1),
            o = ""
              .concat((0, h.dE)(t.col + t.colCount - 1))
              .concat(t.row + t.rowCount),
            a = "\nSheet Index: "
              .concat(this.sheet.sheetIndex, '\nSheet Name: "')
              .concat(this.sheet.getName(), '"\nUsed Range: ')
              .concat(r, ":")
              .concat(o),
            n = S(
              this.sheet.originalSheet.frozenColumnCount(),
              this.sheet.originalSheet.frozenRowCount(),
              !0,
            );
          if ((n && (a += n), (a += "\n"), e)) {
            let e = new en({
              values: this.sheet.originalSheet.getArray(
                t.row,
                t.col,
                t.rowCount,
                t.colCount,
              ),
              startRow: t.row,
              startCol: t.col,
            }).extractRegions();
            a +=
              "\n\nCoarse summary of the sheet data using regions connected via flood fill and dilation is shown below. This is a good starting point for understanding the data. Note that not all rows and columns may be displayed:\n\n".concat(
                e,
                "\n",
              );
          }
          return a;
        }
        getCellRange(e) {
          let t =
              !(arguments.length > 1) ||
              void 0 === arguments[1] ||
              arguments[1],
            r =
              !(arguments.length > 2) ||
              void 0 === arguments[2] ||
              arguments[2],
            o =
              !(arguments.length > 3) ||
              void 0 === arguments[3] ||
              arguments[3],
            a =
              !(arguments.length > 4) ||
              void 0 === arguments[4] ||
              arguments[4];
          return this.sheet.rangeFormatter.getFormattedRange(e, t, r, o, a);
        }
        traceCell(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("address must be a non-empty string");
          let t = e.split("!").pop() || e;
          try {
            (0, h.VW)(t);
          } catch (e) {
            throw Error('Invalid address format: "'.concat(t, '"'));
          }
          let r = this.sheet.getName(),
            o = "".concat(r, "!").concat(t);
          return this.sheet.workbook.printDagForCell(o);
        }
        getSurroundingFormats(e) {
          let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 1,
            { startRow: r, startCol: o, endRow: a, endCol: n } = (0, h.IB)(e),
            i = new Set();
          for (let e = r; e <= a; e++)
            for (let t = o; t <= n; t++)
              i.add("".concat((0, h.dE)(t)).concat(e + 1));
          let l = this.sheet.rangeFormatter.getStyles(
            e,
            void 0,
            "--- Selected Range Style Patterns (".concat(e, ") ---"),
          );
          if (t > 0) {
            let s = Math.max(0, r - t),
              c = Math.max(0, o - t),
              u = "".concat((0, h.dE)(c)).concat(s + 1),
              d = "".concat((0, h.dE)(n + t)).concat(a + t + 1),
              g = "".concat(u, ":").concat(d),
              m = this.sheet.rangeFormatter.getStyles(
                g,
                i,
                "--- Surrounding Style Patterns (dilated from ".concat(
                  e,
                  ") ---",
                ),
              );
            m && !m.includes("No styles found") && (l += "\n" + m);
          }
          return l;
        }
        getSpecializedCellsRaw(e) {
          let t = new Map();
          Object.values(k).forEach((e) => {
            t.set(e, new Map());
          });
          let { startRow: r, startCol: a, endRow: n, endCol: l } = (0, h.IB)(e);
          for (let e = r; e <= n; e++)
            for (let r = a; r <= l; r++) {
              let a = this.sheet.originalSheet.getValue(e, r),
                n = this.sheet.originalSheet.getFormula(e, r),
                l = this.sheet.originalSheet.getFormatter(
                  e,
                  r,
                  o.Spread.Sheets.SheetArea.viewport,
                );
              if ((0, i.o2)(a, n)) {
                let o = t.get(k.Hardcoded);
                (o.has(e) || o.set(e, []),
                  o.get(e).push({
                    row: e,
                    col: r,
                  }));
              }
              if (n && (0, i.oL)(n)) {
                let o = t.get(k.HardcodedInFormula);
                (o.has(e) || o.set(e, []),
                  o.get(e).push({
                    row: e,
                    col: r,
                  }));
              }
              if ((0, i.hB)(n)) {
                let o = t.get(k.ReferenceOtherSheets);
                (o.has(e) || o.set(e, []),
                  o.get(e).push({
                    row: e,
                    col: r,
                  }));
              }
              if ((0, i.db)(n)) {
                let o = t.get(k.Formula);
                (o.has(e) || o.set(e, []),
                  o.get(e).push({
                    row: e,
                    col: r,
                  }));
              }
              if ((0, i.as)(l)) {
                let o = t.get(k.Percentage);
                (o.has(e) || o.set(e, []),
                  o.get(e).push({
                    row: e,
                    col: r,
                  }));
              }
            }
          return t;
        }
        getSpecializedCells(e, t) {
          let r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 3,
            o = this.getSpecializedCellsRaw(e).get(t);
          if (!o || 0 === o.size)
            return "No cells found with content type: "
              .concat(t, " in range: ")
              .concat(e);
          let a = [],
            n = Array.from(o.values()).reduce((e, t) => e + t.length, 0);
          return (
            a.push(
              "Found "
                .concat(n, ' cells of type "')
                .concat(t, '" in range ')
                .concat(e, ", grouped by ")
                .concat(o.size, " row(s):"),
            ),
            o.forEach((e, t) => {
              let o = Math.min(r, e.length),
                n = this.sampleCells(e, o)
                  .map((e) => {
                    let t = "".concat((0, h.dE)(e.col)).concat(e.row + 1),
                      r = this.sheet.getCell(t, !1, !0);
                    return "".concat(t, ": ").concat(r);
                  })
                  .join(", ");
              a.push(
                "Row "
                  .concat(t + 1, ": ")
                  .concat(e.length, " cell(s) | Samples: ")
                  .concat(n),
              );
            }),
            a.join("\n")
          );
        }
        getAllSpecializedCells(e) {
          let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 3,
            r = this.getSpecializedCellsRaw(e),
            o = [];
          return (
            o.push("Specialized cells analysis for range ".concat(e, ":")),
            o.push(""),
            Object.values(k).forEach((e) => {
              let a = r.get(e);
              if (!a || 0 === a.size) return;
              let n = Array.from(a.values()).reduce((e, t) => e + t.length, 0);
              (o.push(
                "## "
                  .concat(e, " (")
                  .concat(n, " cells in ")
                  .concat(a.size, " rows):"),
              ),
                a.forEach((e, r) => {
                  let a = Math.min(t, e.length),
                    n = this.sampleCells(e, a)
                      .map((e) => {
                        let t = "".concat((0, h.dE)(e.col)).concat(e.row + 1),
                          r = this.sheet.getCell(t, !1, !0);
                        return "".concat(t, ": ").concat(r);
                      })
                      .join(", ");
                  o.push(
                    "  Row "
                      .concat(r + 1, ": ")
                      .concat(e.length, " cell(s) | ")
                      .concat(n),
                  );
                }),
                o.push(""));
            }),
            o.join("\n")
          );
        }
        sampleCells(e, t) {
          if (e.length <= t) return e;
          let r = [],
            o = new Set();
          for (; r.length < t; ) {
            let t = Math.floor(Math.random() * e.length);
            o.has(t) || (o.add(t), r.push(e[t]));
          }
          return r.sort((e, t) =>
            e.row !== t.row ? e.row - t.row : e.col - t.col,
          );
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      function el(e) {
        let t = e.match(/(\d+(?:\.\d+)?)px/);
        if (t) {
          let r = Math.round(0.75 * parseFloat(t[1]) * 10) / 10,
            o = r % 1 == 0 ? r.toString() : r.toFixed(1);
          return e.replace(/\d+(?:\.\d+)?px/, "".concat(o, "pt"));
        }
        return e;
      }
      class es {
        setStyleAt(e, t) {
          let r =
              arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
            { startRow: o, startCol: a, endRow: n, endCol: i } = (0, h.IB)(e);
          for (let e = o; e <= n; e++)
            for (let o = a; o <= i; o++) {
              let a = "".concat((0, h.dE)(o)).concat(e + 1),
                n = this.getStyleAt(a, !0),
                i = r
                  ? t
                  : {
                      ...n,
                      ...t,
                    },
                l = this.sheet.createStyle(i);
              this.sheet.originalSheet.getRange(e, o, 1, 1).setStyle(l);
            }
        }
        setIBTextColors(e) {
          let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : [],
            r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {},
            { startRow: o, startCol: a, endRow: n, endCol: i } = (0, h.IB)(e),
            l = r.inputColor || "#0000FF",
            s = r.formulaColor || "#000000",
            c = r.crossSheetColor || "#008000";
          for (let e = o; e <= n; e++)
            for (let r = a; r <= i; r++) {
              let o = this.sheet.originalSheet.getValue(e, r),
                a = this.sheet.originalSheet.getFormula(e, r);
              if (
                (!a && ("number" != typeof o || isNaN(o))) ||
                (!a && "number" == typeof o && t.includes(o))
              )
                continue;
              let n = s;
              (a
                ? (n = a.includes("!") ? c : s)
                : "number" != typeof o || isNaN(o) || (n = l),
                this.setStyleAt(
                  "".concat((0, h.dE)(r)).concat(e + 1),
                  {
                    foreColor: n,
                  },
                  !1,
                ));
            }
        }
        detectCellContentType(e, t) {
          return null == e || "" === e
            ? "empty"
            : "number" == typeof e
              ? "number"
              : "boolean" == typeof e
                ? "boolean"
                : e instanceof Date
                  ? "date"
                  : "text";
        }
        getExpectedAlignment(e) {
          switch (e) {
            case "text":
            case "empty":
              return C.left;
            case "number":
            case "date":
              return C.right;
            case "boolean":
              return C.center;
            default:
              return C.general;
          }
        }
        getNotableFormatter(e) {
          if (e && "General" !== e) return e;
        }
        simplifyFont(e) {
          let t, r;
          if (!e) return;
          let o = {},
            a = e.split(" "),
            n = !1,
            i = !1;
          for (let e of a)
            "bold" === e
              ? (n = !0)
              : "italic" === e
                ? (i = !0)
                : e.includes("pt") || e.includes("px")
                  ? (t = e)
                  : "normal" === e || e.match(/^\d/) || (r = e);
          return (
            n && (o.bold = !0),
            i && (o.italic = !0),
            t && (o.size = t),
            r && (o.family = r),
            Object.keys(o).length > 0 ? o : void 0
          );
        }
        getStyleAt(e) {
          let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            { row: r, col: o } = (0, h.VW)(e),
            a = this.sheet.originalSheet.getStyle(r, o);
          if (!a) return null;
          if (t) {
            let e = {};
            return (
              void 0 !== a.backColor &&
                "string" == typeof a.backColor &&
                (e.backColor = a.backColor),
              void 0 !== a.foreColor && (e.foreColor = a.foreColor),
              void 0 !== a.font && (e.font = el(a.font)),
              void 0 !== a.hAlign && (e.hAlign = a.hAlign),
              void 0 !== a.vAlign && (e.vAlign = a.vAlign),
              a.borderLeft &&
                (e.borderLeft = {
                  color: a.borderLeft.color || "#000000",
                  style: this.convertToLineStyle(a.borderLeft.style),
                }),
              a.borderTop &&
                (e.borderTop = {
                  color: a.borderTop.color || "#000000",
                  style: this.convertToLineStyle(a.borderTop.style),
                }),
              a.borderRight &&
                (e.borderRight = {
                  color: a.borderRight.color || "#000000",
                  style: this.convertToLineStyle(a.borderRight.style),
                }),
              a.borderBottom &&
                (e.borderBottom = {
                  color: a.borderBottom.color || "#000000",
                  style: this.convertToLineStyle(a.borderBottom.style),
                }),
              void 0 !== a.formatter &&
                "string" == typeof a.formatter &&
                (e.formatter = a.formatter),
              void 0 !== a.textIndent && (e.textIndent = a.textIndent),
              void 0 !== a.wordWrap && (e.wordWrap = a.wordWrap),
              e
            );
          }
          let n = this.sheet.originalSheet.getValue(r, o),
            i = this.sheet.originalSheet.getFormula(r, o),
            l = this.detectCellContentType(n, i),
            s = this.getExpectedAlignment(l),
            c = {};
          if (
            (void 0 !== a.hAlign && a.hAlign !== s && (c.hAlign = a.hAlign),
            a.backColor &&
              "string" == typeof a.backColor &&
              "white" !== a.backColor &&
              "#FFFFFF" !== a.backColor &&
              (c.backColor = a.backColor),
            a.foreColor &&
              "black" !== a.foreColor &&
              "#000000" !== a.foreColor &&
              "Text 1 0" !== a.foreColor &&
              (c.foreColor = a.foreColor),
            a.font)
          ) {
            let e = this.simplifyFont(el(a.font));
            if (e) {
              let t = [];
              (e.bold && t.push("bold"),
                e.italic && t.push("italic"),
                e.size && t.push(e.size),
                e.family && t.push(e.family),
                t.length > 0 && (c.font = t.join(" ")));
            }
          }
          if (a.formatter && "string" == typeof a.formatter) {
            let e = this.getNotableFormatter(a.formatter);
            e && (c.formatter = e);
          }
          if (a.borderLeft || a.borderTop || a.borderRight || a.borderBottom) {
            let e = [a.borderLeft, a.borderTop, a.borderRight, a.borderBottom];
            e.every(
              (t) =>
                t && e[0] && t.color === e[0].color && t.style === e[0].style,
            ) && e[0]
              ? (c.border = {
                  color: e[0].color || "#000000",
                  style: this.convertToLineStyle(e[0].style),
                })
              : (a.borderLeft &&
                  (c.borderLeft = {
                    color: a.borderLeft.color || "#000000",
                    style: this.convertToLineStyle(a.borderLeft.style),
                  }),
                a.borderTop &&
                  (c.borderTop = {
                    color: a.borderTop.color || "#000000",
                    style: this.convertToLineStyle(a.borderTop.style),
                  }),
                a.borderRight &&
                  (c.borderRight = {
                    color: a.borderRight.color || "#000000",
                    style: this.convertToLineStyle(a.borderRight.style),
                  }),
                a.borderBottom &&
                  (c.borderBottom = {
                    color: a.borderBottom.color || "#000000",
                    style: this.convertToLineStyle(a.borderBottom.style),
                  }));
          }
          return (
            a.textIndent && a.textIndent > 0 && (c.textIndent = a.textIndent),
            a.wordWrap && (c.wordWrap = !0),
            Object.keys(c).length > 0 ? c : null
          );
        }
        convertToLineStyle(e) {
          return (
            (e &&
              {
                0: b.empty,
                1: b.thin,
                2: b.medium,
                3: b.dashed,
                4: b.dotted,
                5: b.thick,
                6: b.double,
                7: b.hair,
                8: b.mediumDashed,
                9: b.dashDot,
                10: b.mediumDashDot,
                11: b.dashDotDot,
                12: b.mediumDashDotDot,
                13: b.slantedDashDot,
              }[e]) ||
            b.empty
          );
        }
        setFormatterAt(e, t) {
          if ("string" != typeof t) return;
          let { row: r, col: a } = (0, h.VW)(e);
          if (
            ("string" == typeof t &&
              t.toLowerCase().startsWith("formattype.") &&
              (t = t.substring(11)),
            Object.keys(E)
              .map((e) => e.toLowerCase())
              .includes(t.toLowerCase()))
          ) {
            let e = Object.keys(E).find(
              (e) => e.toLowerCase() === t.toLowerCase(),
            );
            e && (t = E[e]);
          }
          return this.sheet.originalSheet.setFormatter(
            r,
            a,
            t,
            o.Spread.Sheets.SheetArea.viewport,
          );
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      class ec {
        addTable(e, t) {
          let r =
              !(arguments.length > 2) ||
              void 0 === arguments[2] ||
              arguments[2],
            o = arguments.length > 3 ? arguments[3] : void 0;
          try {
            if (!t || "" === t.trim())
              throw Error("Table name cannot be empty");
            let a = t.replace(/\s+/g, "_");
            if (this.sheet.originalSheet.tables.findByName(a))
              throw Error('Table with name "'.concat(t, '" already exists'));
            let {
                startRow: n,
                startCol: i,
                endRow: l,
                endCol: s,
              } = (0, h.IB)(e),
              c = this.sheet.originalSheet.tables.add(
                a,
                n,
                i,
                l - n + 1,
                s - i + 1,
                o,
              );
            return (c.showHeader(r), c);
          } catch (e) {
            throw (
              console.error("Error adding table:", e),
              Error(
                "Failed to add table: ".concat(
                  e instanceof Error ? e.message : "Unknown error",
                ),
              )
            );
          }
        }
        removeTable(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          try {
            let t = e.replace(/\s+/g, "_"),
              r = this.sheet.originalSheet.tables.findByName(t);
            if (!r) throw Error('Table with name "'.concat(e, '" not found'));
            this.sheet.originalSheet.tables.remove(
              r,
              o.Spread.Sheets.Tables.TableRemoveOptions.keepData,
            );
          } catch (e) {
            throw (
              console.error("Error removing table:", e),
              Error(
                "Failed to remove table: ".concat(
                  e instanceof Error ? e.message : "Unknown error",
                ),
              )
            );
          }
        }
        getTable(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          try {
            let t = e.replace(/\s+/g, "_");
            return this.sheet.originalSheet.tables.findByName(t) || null;
          } catch (e) {
            return (console.error("Error getting table:", e), null);
          }
        }
        listTables() {
          let e = [];
          for (let t of this.sheet.originalSheet.tables.all())
            if (t) {
              let r = t.range(),
                o = ""
                  .concat((0, h.dE)(r.col))
                  .concat(r.row + 1, ":")
                  .concat((0, h.dE)(r.col + r.colCount - 1))
                  .concat(r.row + r.rowCount);
              e.push({
                name: t.name(),
                range: o,
              });
            }
          return e;
        }
        clearTableFilters(e) {
          let t = this.getTable(e);
          if (!t) throw Error('Table with name "'.concat(e, '" not found'));
          let r = t.rowFilter();
          r && r.reset();
        }
        constructor(e) {
          this.sheet = e;
        }
      }
      class eh {
        get originalSheet() {
          return this._originalSheet;
        }
        get sheetIndex() {
          return this._sheetIndex;
        }
        get workbook() {
          return this._workbook;
        }
        get rangeFormatter() {
          return this._rangeFormatter;
        }
        get charts() {
          return this._charts;
        }
        get cellSourceTracker() {
          return this._workbook.cellSourceTracker;
        }
        getName() {
          return this.originalSheet.name();
        }
        setName(e) {
          this.originalSheet.name(e);
        }
        createStyle(e) {
          var t, r, a, n;
          let i = new o.Spread.Sheets.Style();
          if (
            (e.backColor && (i.backColor = e.backColor),
            e.foreColor && (i.foreColor = e.foreColor),
            e.font && (i.font = el(e.font)),
            e.hAlign && (i.hAlign = e.hAlign),
            e.vAlign && (i.vAlign = e.vAlign),
            (null == (t = e.borderLeft) ? void 0 : t.style) &&
              (i.borderLeft = new o.Spread.Sheets.LineBorder(
                e.borderLeft.color,
                e.borderLeft.style,
              )),
            (null == (r = e.borderTop) ? void 0 : r.style) &&
              (i.borderTop = new o.Spread.Sheets.LineBorder(
                e.borderTop.color,
                e.borderTop.style,
              )),
            (null == (a = e.borderRight) ? void 0 : a.style) &&
              (i.borderRight = new o.Spread.Sheets.LineBorder(
                e.borderRight.color,
                e.borderRight.style,
              )),
            (null == (n = e.borderBottom) ? void 0 : n.style) &&
              (i.borderBottom = new o.Spread.Sheets.LineBorder(
                e.borderBottom.color,
                e.borderBottom.style,
              )),
            e.formatter && (i.formatter = e.formatter),
            e.textIndent && (i.textIndent = e.textIndent),
            e.border)
          ) {
            let t = e.border.color,
              r = e.border.style;
            ((i.borderLeft = new o.Spread.Sheets.LineBorder(t, r)),
              (i.borderTop = new o.Spread.Sheets.LineBorder(t, r)),
              (i.borderRight = new o.Spread.Sheets.LineBorder(t, r)),
              (i.borderBottom = new o.Spread.Sheets.LineBorder(t, r)));
          }
          return i;
        }
        addTable(e, t) {
          let r =
              !(arguments.length > 2) ||
              void 0 === arguments[2] ||
              arguments[2],
            o = arguments.length > 3 ? arguments[3] : void 0;
          return this._tables.addTable(e, t, r, o);
        }
        removeTable(e) {
          this._tables.removeTable(e);
        }
        getTable(e) {
          return this._tables.getTable(e);
        }
        listTables() {
          return this._tables.listTables();
        }
        clearTableFilters(e) {
          this._tables.clearTableFilters(e);
        }
        applyConditionalFormatting(e, t, r) {
          this._conditionalFormatting.applyConditionalFormatting(e, t, r);
        }
        removeConditionalFormatting(e) {
          this._conditionalFormatting.removeConditionalFormatting(e);
        }
        clearAllConditionalFormatting() {
          this._conditionalFormatting.clearAllConditionalFormatting();
        }
        addPivotTable(e) {
          return this._pivotTables.addPivotTable(e);
        }
        removePivotTable(e) {
          this._pivotTables.removePivotTable(e);
        }
        listPivotTables() {
          return this._pivotTables.listPivotTables();
        }
        getPivotTableHandle(e) {
          return this._pivotTables.getPivotTableHandle(e);
        }
        setDataValidation(e, t, r, o, a) {
          this._dataValidation.setDataValidation(e, t, r, o, a);
        }
        removeDataValidation(e) {
          this._dataValidation.removeDataValidation(e);
        }
        getDataValidation(e) {
          return this._dataValidation.getDataValidation(e);
        }
        setStyleAt(e, t) {
          let r =
            arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          this._styling.setStyleAt(e, t, r);
        }
        getStyleAt(e) {
          let t =
            arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          return this._styling.getStyleAt(e, t);
        }
        setFormatterAt(e, t) {
          return this._styling.setFormatterAt(e, t);
        }
        setIBTextColors(e, t, r) {
          this._styling.setIBTextColors(e, t, r);
        }
        setRangeFormatting(e, t) {
          this._formatting.setRangeFormatting(e, t);
        }
        detectFormatType(e) {
          return this._formatting.detectFormatType(e);
        }
        parseValueForFormat(e) {
          return this._formatting.parseValueForFormat(e);
        }
        autoFormatCellAt(e) {
          this._formatting.autoFormatCellAt(e);
        }
        regexSearch(e, t) {
          return this._search.regexSearch(e, t);
        }
        getDependentCells(e) {
          return this._search.getDependentCells(e);
        }
        getDirtyCells() {
          return this._search.getDirtyCells();
        }
        getSheetSummary() {
          let e =
            !(arguments.length > 0) || void 0 === arguments[0] || arguments[0];
          return this._sheetAnalysis.getSheetSummary(e);
        }
        getCellRange(e) {
          let t =
              !(arguments.length > 1) ||
              void 0 === arguments[1] ||
              arguments[1],
            r =
              !(arguments.length > 2) ||
              void 0 === arguments[2] ||
              arguments[2],
            o =
              !(arguments.length > 3) ||
              void 0 === arguments[3] ||
              arguments[3],
            a =
              !(arguments.length > 4) ||
              void 0 === arguments[4] ||
              arguments[4];
          return this._sheetAnalysis.getCellRange(e, t, r, o, a);
        }
        traceCell(e) {
          return this._sheetAnalysis.traceCell(e);
        }
        getSurroundingFormats(e) {
          let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
          return this._sheetAnalysis.getSurroundingFormats(e, t);
        }
        getSpecializedCells(e, t) {
          let r =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3;
          return this._sheetAnalysis.getSpecializedCells(e, t, r);
        }
        getAllSpecializedCells(e) {
          let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3;
          return this._sheetAnalysis.getAllSpecializedCells(e, t);
        }
        highlightCells(e) {
          (arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            arguments.length > 2 && void 0 !== arguments[2] && arguments[2]);
        }
        highlightRange(e, t) {}
        unhighlightRange(e) {}
        clearAllHighlights() {}
        getIndex() {
          return this.sheetIndex;
        }
        getValue(e, t) {
          return this.originalSheet.getValue(e, t);
        }
        getCell(e) {
          let t =
              !(arguments.length > 1) ||
              void 0 === arguments[1] ||
              arguments[1],
            r =
              !(arguments.length > 2) ||
              void 0 === arguments[2] ||
              arguments[2],
            { row: o, col: a } = (0, h.VW)(e),
            n = this.originalSheet.getText(o, a),
            i = this.originalSheet.getValue(o, a);
          if (null == n) return "";
          let l = n.toString();
          if ((0 === i && "0" !== n && (l += " [0]"), r)) {
            let e = this.originalSheet.getFormula(o, a);
            e && (l = "".concat(n, "(").concat(e, ")"));
          }
          if (t) {
            let t = this.getStyleAt(e);
            t && (l = "".concat(l, " (").concat(JSON.stringify(t), ")"));
          }
          return l;
        }
        getRawCellData(e, t) {
          let { row: r, col: o } = (0, h.VW)(e);
          return this.originalSheet.getArray(r, o, 1, 1, t)[0][0];
        }
        getRawRangeData(e, t) {
          let r = (0, h.IB)(e),
            o = r.startRow,
            a = r.startCol,
            n = r.endRow - o + 1,
            i = r.endCol - a + 1;
          return this.originalSheet.getArray(o, a, n, i, t);
        }
        getCellFormat(e) {
          let { row: t, col: r } = (0, h.VW)(e);
          return this.originalSheet.getFormatter(
            t,
            r,
            o.Spread.Sheets.SheetArea.viewport,
          );
        }
        validateAIFormulaMisUse(e) {
          if ("string" == typeof e && e.trim().toLowerCase().startsWith("=ai("))
            throw Error(
              "AI formulas can only be used when there are range restrictions.",
            );
        }
        setCell(e, t, r, o) {
          var a, n;
          ("string" == typeof (a = t) &&
            ((e, t) => {
              let r = t.match(v),
                o = t.match(w);
              if (r && o)
                throw Error(
                  "Invalid setCell call: "
                    .concat(
                      e,
                      " - Including formats in the cell value is not allowed. You added: ",
                    )
                    .concat(t),
                );
            })(e, a),
          this.validateAIFormulaMisUse(t),
          '""' === t)
            ? (t = "")
            : "number" != typeof t || r
              ? "string" != typeof t || isNaN(Number(t)) || (t = Number(t))
              : ((null == (n = t.toString().split(".")[1])
                  ? void 0
                  : n.length) || 0) > 2 && (r = E.TwoDecimals);
          let { row: i, col: l } = (0, h.VW)(e);
          (("string" == typeof t && t.startsWith("=")) ||
            this.originalSheet.setFormula(i, l, null),
            this._writeCell(i, l, t),
            r && this.setFormatterAt(e, r),
            o && this.addNote(e, o));
        }
        _writeCell(e, t, r) {
          return null == r || "" === r
            ? void this.originalSheet.setValue(e, t, null)
            : (0, i.p1)(r)
              ? void this.setFormula(e, t, r)
              : void this.originalSheet.setValue(e, t, r);
        }
        setFormula(e, t, r) {
          try {
            let o;
            if (((o = r), -1 !== o.indexOf('&"%"')))
              throw Error(
                "Implicit text conversion with formula: ".concat(
                  r,
                  ". This is considered bad practice as it couples formatting with calculation, and can lead to arbitrarily long decimal places. Instead, you should use proper formatting on the cell.",
                ),
              );
            return this.originalSheet.setFormula(e, t, r);
          } catch (t) {
            let e = (0, n.M5)(t);
            throw Error(
              "Invalid formula: "
                .concat(r)
                .concat(e ? " - cause: ".concat(e) : ""),
              {
                cause: t,
              },
            );
          }
        }
        setFormulaByAddress(e, t) {
          let { row: r, col: o } = (0, h.VW)(e);
          return this.setFormula(r, o, t);
        }
        goalSeek(e, t, r) {
          let a = (0, h.VW)(e),
            n = (0, h.VW)(t);
          this.originalSheet.getParent().resumeCalcService();
          let i = o.Spread.Sheets.CalcEngine.goalSeek(
            this.originalSheet,
            a.row,
            a.col,
            this.originalSheet,
            n.row,
            n.col,
            r,
          );
          return (this.originalSheet.getParent().suspendCalcService(), i);
        }
        sensitivityAnalysisTwoVariableTable(e, t, r, o, a) {
          let n = (0, h.IB)(e),
            i = (0, h.IB)(t),
            l = (0, h.VW)(r),
            s = (0, h.VW)(o),
            c = (0, h.VW)(a),
            u = this.originalSheet.getValue(l.row, l.col),
            d = this.originalSheet.getValue(s.row, s.col);
          this.originalSheet.getParent().resumeCalcService();
          for (let e = n.startCol; e <= n.endCol; e++) {
            let t = this.originalSheet.getValue(n.startRow, e);
            this.originalSheet.setValue(l.row, l.col, t);
            for (let t = i.startRow; t <= i.endRow; t++) {
              let r = this.originalSheet.getValue(t, i.startCol);
              this.originalSheet.setValue(s.row, s.col, r);
              let o = this.originalSheet.getValue(c.row, c.col);
              this.originalSheet.setValue(t, e, o);
            }
          }
          (this.originalSheet.setValue(l.row, l.col, u),
            this.originalSheet.setValue(s.row, s.col, d),
            this.originalSheet.getParent().suspendCalcService());
        }
        scrollToCell(e, t) {
          (this.originalSheet.setActiveCell(e, t),
            this.originalSheet.showCell(
              e,
              t,
              o.Spread.Sheets.VerticalPosition.center,
              o.Spread.Sheets.HorizontalPosition.nearest,
            ));
        }
        suspendPaint() {
          return this.originalSheet.suspendPaint();
        }
        resumePaint() {
          return this.originalSheet.resumePaint();
        }
        addRowsAt(e, t) {
          return this._rowColumnOps.addRowsAt(e, t);
        }
        clearInsertChanges() {
          return this._rowColumnOps.clearInsertChanges();
        }
        deleteRowsAt(e, t) {
          return this._rowColumnOps.deleteRowsAt(e, t);
        }
        addColumnsAt(e, t) {
          return this._rowColumnOps.addColumnsAt(e, t);
        }
        deleteColumnsAt(e, t) {
          return this._rowColumnOps.deleteColumnsAt(e, t);
        }
        autoFitRowAt(e) {
          return this._rowColumnOps.autoFitRowAt(e);
        }
        autoFitColumnAt(e) {
          return this._rowColumnOps.autoFitColumnAt(e);
        }
        setRowVisibleAt(e, t) {
          return this._rowColumnOps.setRowVisibleAt(e, t);
        }
        setColumnVisibleAt(e, t) {
          return this._rowColumnOps.setColumnVisibleAt(e, t);
        }
        addSpanAt(e, t, r) {
          return this._rowColumnOps.addSpanAt(e, t, r);
        }
        removeSpanAt(e) {
          return this._rowColumnOps.removeSpanAt(e);
        }
        clearData(e) {
          return this._rowColumnOps.clearData(e);
        }
        clearFormatting(e) {
          return this._rowColumnOps.clearFormatting(e);
        }
        scrollToCellAddress(e) {
          let { row: t, col: r } = (0, h.VW)(e);
          this.scrollToCell(t, r);
        }
        setRowHeightAt(e, t) {
          let r = parseInt(e);
          if (isNaN(r) || r < 1)
            throw Error(
              'Invalid row address: "'.concat(
                e,
                '". Must be a positive integer.',
              ),
            );
          if ("number" != typeof t || isNaN(t) || t <= 0)
            throw Error(
              'Invalid height "'.concat(t, '" - must be a positive number'),
            );
          return this.originalSheet.setRowHeight(r - 1, t);
        }
        setColumnWidthAt(e, t) {
          let r;
          if ("number" != typeof t || isNaN(t) || t <= 0)
            throw Error(
              'Invalid width "'.concat(t, '" - must be a positive number'),
            );
          try {
            r = (0, h.VW)("".concat(e, "1")).col;
          } catch (t) {
            throw Error('Invalid column letter: "'.concat(e, '"'));
          }
          return this.originalSheet.setColumnWidth(r, t);
        }
        getRowHeightAt(e) {
          let t = parseInt(e);
          if (isNaN(t) || t < 1)
            throw Error(
              'Invalid row address: "'.concat(
                e,
                '". Must be a positive integer.',
              ),
            );
          return this.originalSheet.getRowHeight(t - 1);
        }
        getColumnWidthAt(e) {
          let t;
          try {
            t = (0, h.VW)("".concat(e, "1")).col;
          } catch (t) {
            throw Error('Invalid column letter: "'.concat(e, '"'));
          }
          return this.originalSheet.getColumnWidth(t);
        }
        setRowResizableAt(e, t) {
          let r = parseInt(e);
          if (isNaN(r) || r < 1)
            throw Error(
              'Invalid row address: "'.concat(
                e,
                '". Must be a positive integer.',
              ),
            );
          return this.originalSheet.setRowResizable(r - 1, t);
        }
        setColumnResizableAt(e, t) {
          let r = (0, h.VW)("".concat(e, "1")).col;
          return this.originalSheet.setColumnResizable(r, t);
        }
        visible(e) {
          return this.originalSheet.visible(e);
        }
        getUsedRange() {
          let e = this.getUsedRangeAsObject();
          if (!e) return null;
          let t = "".concat((0, h.dE)(e.col)).concat(e.row + 1),
            r = ""
              .concat((0, h.dE)(e.col + e.colCount - 1))
              .concat(e.row + e.rowCount);
          return "".concat(t, ":").concat(r);
        }
        setActiveCellAddress(e) {
          let { row: t, col: r } = (0, h.VW)(e);
          this.originalSheet.setActiveCell(t, r);
        }
        setSelectionRange(e) {
          let { startRow: t, startCol: r, endRow: o, endCol: a } = (0, h.IB)(e);
          this.originalSheet.setSelection(t, r, o - t + 1, a - r + 1);
        }
        addSelectionRange(e) {
          let { startRow: t, startCol: r, endRow: o, endCol: a } = (0, h.IB)(e);
          this.originalSheet.addSelection(t, r, o - t + 1, a - r + 1);
        }
        clearSelection() {
          this.originalSheet.clearSelection();
        }
        getUsedRangeAsObject() {
          try {
            let e = this.originalSheet.getUsedRange(
                o.Spread.Sheets.UsedRangeType.data,
              ),
              t = this.originalSheet.getUsedRange(
                o.Spread.Sheets.UsedRangeType.formula,
              );
            if (!e && !t) return null;
            if (!e) return t;
            if (!t) return e;
            let r = Math.min(e.row, t.row),
              a = Math.min(e.col, t.col),
              n = Math.max(e.row + e.rowCount - 1, t.row + t.rowCount - 1),
              i = Math.max(e.col + e.colCount - 1, t.col + t.colCount - 1);
            return {
              row: r,
              col: a,
              rowCount: n - r + 1,
              colCount: i - a + 1,
            };
          } catch (e) {
            return (console.error("Error getting used range:", e), null);
          }
        }
        getRowCount() {
          let e = this.getUsedRangeAsObject();
          return e ? e.rowCount : 0;
        }
        getColumnCount() {
          let e = this.getUsedRangeAsObject();
          return e ? e.colCount : 0;
        }
        getTotalRowCount() {
          return this.originalSheet.getRowCount();
        }
        getTotalColumnCount() {
          return this.originalSheet.getColumnCount();
        }
        setTotalRowCount(e) {
          if ("number" != typeof e || !Number.isInteger(e) || e < 1)
            throw Error(
              "Invalid count: ".concat(e, ". Must be a positive integer."),
            );
          let t = Math.min(e, y.MAX_ROW_COUNT);
          this.originalSheet.setRowCount(t);
        }
        setTotalColumnCount(e) {
          if ("number" != typeof e || !Number.isInteger(e) || e < 1)
            throw Error(
              "Invalid count: ".concat(e, ". Must be a positive integer."),
            );
          let t = Math.min(e, y.MAX_COLUMN_COUNT);
          this.originalSheet.setColumnCount(t);
        }
        expandSheetToFit(e) {
          let { row: t, col: r } = (0, h.VW)(e),
            o = t + 100,
            a = r + 10,
            n = this.originalSheet.getRowCount(),
            i = this.originalSheet.getColumnCount();
          if (o >= n) {
            let e = Math.min(o + 1, y.MAX_ROW_COUNT);
            this.originalSheet.setRowCount(e);
          }
          if (a >= i) {
            let e = Math.min(a + 1, y.MAX_COLUMN_COUNT);
            this.originalSheet.setColumnCount(e);
          }
        }
        getArray(e, t, r, o) {
          if ("number" != typeof e || e < 0 || !Number.isInteger(e))
            throw Error(
              "Invalid startRow: ".concat(
                e,
                ". Must be a non-negative integer.",
              ),
            );
          if ("number" != typeof t || t < 0 || !Number.isInteger(t))
            throw Error(
              "Invalid startCol: ".concat(
                t,
                ". Must be a non-negative integer.",
              ),
            );
          if ("number" != typeof r || r < 1 || !Number.isInteger(r))
            throw Error(
              "Invalid rowCount: ".concat(r, ". Must be a positive integer."),
            );
          if ("number" != typeof o || o < 1 || !Number.isInteger(o))
            throw Error(
              "Invalid colCount: ".concat(o, ". Must be a positive integer."),
            );
          return this.originalSheet.getArray(e, t, r, o);
        }
        getFormula(e, t) {
          if ("number" != typeof e || e < 0 || !Number.isInteger(e))
            throw Error(
              "Invalid row: ".concat(e, ". Must be a non-negative integer."),
            );
          if ("number" != typeof t || t < 0 || !Number.isInteger(t))
            throw Error(
              "Invalid col: ".concat(t, ". Must be a non-negative integer."),
            );
          return this.originalSheet.getFormula(e, t);
        }
        freezeFirstColumns(e) {
          if ("number" != typeof e || !Number.isInteger(e) || e < 1)
            throw Error(
              "Invalid count: ".concat(e, ". Must be a positive integer."),
            );
          (this.originalSheet.frozenColumnCount(e), console.log(S(e, 0, !1)));
        }
        freezeFirstRows(e) {
          if ("number" != typeof e || !Number.isInteger(e) || e < 1)
            throw Error(
              "Invalid count: ".concat(e, ". Must be a positive integer."),
            );
          (this.originalSheet.frozenRowCount(e), console.log(S(0, e, !1)));
        }
        unfreezeAllPanes() {
          (this.originalSheet.frozenColumnCount(0),
            this.originalSheet.frozenRowCount(0),
            this.originalSheet.frozenTrailingColumnCount(0),
            this.originalSheet.frozenTrailingRowCount(0));
        }
        addChart(e, t, r, o) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          try {
            (0, h.yn)(r);
          } catch (e) {
            throw Error('Invalid dataRange format: "'.concat(r, '"'));
          }
          let a = (null == o ? void 0 : o.dataOrientation) || "columns";
          return this.charts.addChart(
            e,
            t,
            r,
            a,
            null == o ? void 0 : o.categoryIndex,
          );
        }
        autoPositionAllCharts() {
          this.charts.autoPositionAllCharts();
        }
        removeChart(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          this.charts.removeChart(e);
        }
        getChart(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          return this.charts.getChart(e);
        }
        listCharts() {
          return this.charts.listCharts();
        }
        getChartPosition(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("name must be a non-empty string");
          return this.charts.getChartPosition(e);
        }
        getChartProperties(e) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("chartName must be a non-empty string");
          return this.charts.getChartProperties(e);
        }
        setChartProperties(e, t) {
          if ("string" != typeof e || "" === e.trim())
            throw Error("chartName must be a non-empty string");
          if (!t || "object" != typeof t)
            throw Error("properties must be an object");
          this.charts.setChartProperties(e, t);
        }
        autoFill(e, t, r) {
          let a,
            n,
            i = (0, h.IB)(e),
            l = (0, h.IB)(t);
          if (
            !(
              i.startRow >= l.startRow &&
              i.endRow <= l.endRow &&
              i.startCol >= l.startCol &&
              i.endCol <= l.endCol
            )
          )
            throw Error(
              "Source range "
                .concat(e, " must be contained within target range ")
                .concat(t, '. Example: autoFill("A1", "A1:A10")'),
            );
          let s = i.endRow - i.startRow + 1,
            c = i.endCol - i.startCol + 1,
            u = l.endRow - l.startRow + 1,
            d = l.endCol - l.startCol + 1;
          i.startRow === l.startRow && u > s
            ? ((a = "down"), (n = o.Spread.Sheets.Fill.FillSeries.column))
            : i.endRow === l.endRow && u > s
              ? ((a = "up"), (n = o.Spread.Sheets.Fill.FillSeries.column))
              : i.startCol === l.startCol && d > c
                ? ((a = "right"), (n = o.Spread.Sheets.Fill.FillSeries.row))
                : i.endCol === l.endCol && d > c
                  ? ((a = "left"), (n = o.Spread.Sheets.Fill.FillSeries.row))
                  : ((a = "down"),
                    (n = o.Spread.Sheets.Fill.FillSeries.column));
          let g =
              "constant" === r
                ? o.Spread.Sheets.Fill.FillType.direction
                : o.Spread.Sheets.Fill.FillType.auto,
            m = new o.Spread.Sheets.Range(i.startRow, i.startCol, s, c),
            p = new o.Spread.Sheets.Range(l.startRow, l.startCol, u, d);
          this.originalSheet.fillAuto(m, p, {
            fillType: g,
            series: n,
            direction: o.Spread.Sheets.Fill.FillDirection[a],
          });
        }
        addPicture(e, t, r) {
          let o;
          if ("string" != typeof e || "" === e.trim())
            return Promise.reject(Error("name must be a non-empty string"));
          if ("string" != typeof t || "" === t.trim())
            return Promise.reject(
              Error("base64Data must be a non-empty string"),
            );
          let { row: a, col: n } = (0, h.VW)(r),
            i = 0,
            l = 0;
          for (let e = 0; e < n; e++) i += this.originalSheet.getColumnWidth(e);
          for (let e = 0; e < a; e++) l += this.originalSheet.getRowHeight(e);
          return (
            (o = t.startsWith("data:image/")
              ? t
              : t.startsWith("/9j/")
                ? "data:image/jpeg;base64,".concat(t)
                : "data:image/png;base64,".concat(t)),
            new Promise((t, r) => {
              let a = new Image();
              ((a.onload = () => {
                try {
                  (this.originalSheet.shapes.addPictureShape(
                    e,
                    o,
                    i,
                    l,
                    a.naturalWidth,
                    a.naturalHeight,
                  ),
                    t());
                } catch (e) {
                  r(e);
                }
              }),
                (a.onerror = () => {
                  r(
                    Error(
                      "Failed to load image: invalid or corrupted base64 data",
                    ),
                  );
                }),
                (a.src = o));
            })
          );
        }
        addNote(e, t) {
          let { row: r, col: o } = (0, h.VW)(e);
          (this.originalSheet.comments.get(r, o) &&
            this.originalSheet.comments.remove(r, o),
            this.originalSheet.comments.add(r, o, t));
        }
        getNote(e) {
          let { row: t, col: r } = (0, h.VW)(e),
            o = this.originalSheet.comments.get(t, r);
          return (null == o ? void 0 : o.text()) || null;
        }
        removeNote(e) {
          let { row: t, col: r } = (0, h.VW)(e);
          this.originalSheet.comments.remove(t, r);
        }
        constructor(e, t, r) {
          ((this._originalSheet = e),
            (this._sheetIndex = t),
            (this._workbook = r),
            (this._rangeFormatter = new f(this)),
            (this._charts = new $(this)),
            (this._tables = new ec(this)),
            (this._conditionalFormatting = new q(this)),
            (this._pivotTables = new er(this)),
            (this._dataValidation = new J(this)),
            (this._styling = new es(this)),
            (this._formatting = new K(this)),
            (this._search = new ea(this)),
            (this._sheetAnalysis = new ei(this)),
            (this._rowColumnOps = new eo(this)));
        }
      }
      var eu = r(77614);
      class ed {
        destroy() {}
        markAgentEdit(e, t, r) {}
        constructor(e) {}
      }
      var eg = r(57738);
      function em(e) {
        return e
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .trim();
      }
      function ep(e) {
        let t = e.getCustomNames(),
          r = void 0 !== e.sheets;
        return t && 0 !== t.length
          ? t.map((t) => {
              let a = t.getName(),
                n = t.getExpression(),
                i = t.getRow(),
                l = t.getColumn(),
                s = t.getComment() || "";
              return {
                name: a,
                reference: o.Spread.Sheets.CalcEngine.expressionToFormula(
                  e,
                  n,
                  i,
                  l,
                ),
                scope: r ? "workbook" : e.name(),
                comment: s,
              };
            })
          : [];
      }
      function ef(e, t, r, a) {
        if (!t.includes("!"))
          throw Error(
            'Source range must include sheet name (e.g., "Sheet1!A1:D10")',
          );
        if (!a.includes("!"))
          throw Error(
            'Target range must include sheet name (e.g., "Sheet2!B2")',
          );
        let [n, i] = t.split("!"),
          l = e.getSheetFromName(n);
        if (!l) throw Error("Source sheet not found: ".concat(n));
        let [s, c] = a.split("!"),
          u = r.getSheetFromName(s);
        if (!u) throw Error("Target sheet not found: ".concat(s));
        let d = (0, h.IB)(i),
          g = d.endRow - d.startRow + 1,
          m = d.endCol - d.startCol + 1,
          p = (0, h.IB)(c),
          f = p.startRow,
          S = p.startCol,
          y = l.originalSheet,
          w = u.originalSheet;
        for (let e = 0; e < g; e++)
          for (let t = 0; t < m; t++) {
            let r = d.startRow + e,
              a = d.startCol + t,
              n = f + e,
              i = S + t,
              l = y.getFormula(r, a);
            if (l) w.setFormula(n, i, l);
            else {
              let e = y.getValue(r, a);
              w.setValue(n, i, e);
            }
            let s = y.getStyle(r, a);
            s && w.setStyle(n, i, s);
            let c = y.getFormatter(r, a, o.Spread.Sheets.SheetArea.viewport);
            if (
              (c && w.setFormatter(n, i, c, o.Spread.Sheets.SheetArea.viewport),
              0 === t)
            ) {
              let e = y.getRowHeight(r);
              w.setRowHeight(n, e);
            }
            if (0 === e) {
              let e = y.getColumnWidth(a);
              w.setColumnWidth(i, e);
            }
          }
      }
      class eS {
        setupSelectAllHandler() {
          let e = !1;
          this.originalWorkbook.bind(
            o.Spread.Sheets.Events.SelectionChanging,
            (t, r) => {
              if (e) return;
              let a = r.sheet,
                n = r.newSelections;
              if (!n || 0 === n.length) return;
              let i = n[0],
                l = a.getRowCount(),
                s = a.getColumnCount(),
                c = -1 === i.row && -1 === i.col,
                h =
                  0 === i.row &&
                  0 === i.col &&
                  i.rowCount === l &&
                  i.colCount === s;
              if (!(c || h)) return;
              let u = a.getUsedRange(o.Spread.Sheets.UsedRangeType.data),
                d = a.getUsedRange(o.Spread.Sheets.UsedRangeType.formula),
                g = a.getUsedRange(o.Spread.Sheets.UsedRangeType.style);
              if (!u && !d && !g) {
                ((r.cancel = !0), (e = !0));
                try {
                  a.setSelection(0, 0, eu.FO, eu.X4);
                } finally {
                  e = !1;
                }
                return;
              }
              let m = -1,
                p = -1,
                f = (e) => {
                  e &&
                    ((m = Math.max(m, e.row + e.rowCount - 1)),
                    (p = Math.max(p, e.col + e.colCount - 1)));
                };
              if ((f(u), f(d), f(g), -1 === m)) {
                ((r.cancel = !0), (e = !0));
                try {
                  a.setSelection(0, 0, eu.FO, eu.X4);
                } finally {
                  e = !1;
                }
                return;
              }
              r.cancel = !0;
              let S = Math.max(m + 1, eu.FO),
                y = Math.max(p + 1, eu.X4);
              e = !0;
              try {
                a.setSelection(0, 0, S, y);
              } finally {
                e = !1;
              }
            },
          );
        }
        get cellSourceTracker() {
          return this._cellSourceTracker;
        }
        calculate() {
          if (this.beforeCalculateCallback)
            try {
              this.beforeCalculateCallback();
            } catch (e) {}
          if (
            (this.originalWorkbook.resumeCalcService(),
            this.originalWorkbook.calculate(
              o.Spread.Sheets.CalculationType.minimal,
            ),
            this.afterCalculateCallback)
          )
            try {
              this.afterCalculateCallback();
            } catch (e) {}
          this.originalWorkbook.suspendCalcService();
        }
        resizeOnNewSheet() {
          this.originalWorkbook.bind(
            o.Spread.Sheets.Events.SheetChanged,
            (e, t) => {
              "insertSheet" === t.propertyName &&
                this.makeSheetFullSize(
                  this.originalWorkbook.getSheet(t.sheetIndex),
                );
            },
          );
        }
        setupDynamicExpansion() {
          let {
            EXPANSION_BUFFER: e,
            EXPANSION_INCREMENT_ROWS: t,
            EXPANSION_INCREMENT_COLS: r,
            MAX_ROW_COUNT: a,
            MAX_COLUMN_COUNT: n,
          } = y;
          (this.originalWorkbook.bind(
            o.Spread.Sheets.Events.TopRowChanged,
            (r, o) => {
              let n = o.sheet,
                i = n.getRowCount();
              if (n.getViewportBottomRow(1) + e > i && i < a) {
                let e = Math.min(t, a - i);
                e > 0 && n.addRows(i, e);
              }
            },
          ),
            this.originalWorkbook.bind(
              o.Spread.Sheets.Events.LeftColumnChanged,
              (t, o) => {
                let a = o.sheet,
                  i = a.getColumnCount();
                if (a.getViewportRightColumn(1) + e > i && i < n) {
                  let e = Math.min(r, n - i);
                  e > 0 && a.addColumns(i, e);
                }
              },
            ));
        }
        getCircularReference() {
          return this.originalWorkbook.getCircularReference();
        }
        makeAllSheetsFullSize() {
          for (let e = 0; e < this.originalWorkbook.getSheetCount(); e++) {
            let t = this.originalWorkbook.getSheet(e);
            t && this.makeSheetFullSize(t);
          }
        }
        makeSheetFullSize(e) {
          let t = e || this.originalWorkbook.getActiveSheet();
          t.suspendPaint();
          try {
            let e = t.getRowCount(),
              r = t.getColumnCount(),
              o = Math.min(Math.max(e, y.MIN_ROW_COUNT), y.MAX_ROW_COUNT),
              a = Math.min(Math.max(r, y.MIN_COLUMN_COUNT), y.MAX_COLUMN_COUNT);
            (t.setRowCount(o),
              t.setColumnCount(a),
              (this.originalWorkbook.options.scrollbarShowMax = !1));
          } finally {
            (t.resumePaint(), t.repaint());
          }
        }
        getDirtyCells() {
          let e = this.originalWorkbook.getSheetCount(),
            t = [];
          for (let r = 0; r < e; r++) {
            let e = this.getSheet(r),
              o = null == e ? void 0 : e.getDirtyCells();
            if (o) for (let e of o) t.push(e);
          }
          return t;
        }
        async getDirtyCellsAsync() {
          let e = this.originalWorkbook.getSheetCount(),
            t = [];
          for (let r = 0; r < e; r++) {
            let o = this.getSheet(r),
              a = null == o ? void 0 : o.getDirtyCells();
            if (a) for (let e of a) t.push(e);
            r < e - 1 && (await new Promise((e) => setTimeout(e, 0)));
          }
          return t;
        }
        clearPendingChanges() {
          let e = this.originalWorkbook.getSheetCount();
          for (let t = 0; t < e; t++) {
            let e = this.originalWorkbook.getSheet(t);
            e &&
              e.clearPendingChanges({
                clearType: 1,
              });
          }
        }
        save() {}
        onCellChanged(e) {
          let t = this.originalWorkbook;
          return (
            t.bind(o.Spread.Sheets.Events.CellChanged, function (t, r) {
              e(r);
            }),
            () => {
              t.unbind(o.Spread.Sheets.Events.CellChanged, e);
            }
          );
        }
        onSelectionChanged(e) {
          let t = this.originalWorkbook,
            r = (r, a) => {
              let n,
                i = a.sheet,
                l = a.newSelections[0];
              if (0 === l.rowCount && 0 === l.colCount) return void e(null);
              let s = o.Spread.Sheets.CalcEngine.rangeToFormula(l).replace(
                /\$/g,
                "",
              );
              if (l.rowCount > eu.Bs || l.colCount > eu.Bs)
                n = {
                  x: -1,
                  y: -1,
                };
              else {
                let e = i.getCellRect(l.row + l.rowCount, l.col + l.colCount);
                n = {
                  x: e.x + e.width,
                  y: e.y + e.height,
                };
              }
              e({
                range: l,
                rangeStr: s,
                pos: n,
                sheetIndex: t.getActiveSheetIndex(),
              });
            };
          return (
            t.bind(o.Spread.Sheets.Events.SelectionChanged, r),
            () => {
              t.unbind(o.Spread.Sheets.Events.SelectionChanged, r);
            }
          );
        }
        getActiveSheet() {
          let e = this.originalWorkbook.getActiveSheetIndex();
          return this.getSheet(e);
        }
        clearAllHighlights() {
          try {
            this.originalWorkbook.suspendPaint();
            for (let e = 0; e < this.originalWorkbook.getSheetCount(); e++) {
              let t = this.getSheet(e);
              null == t || t.clearAllHighlights();
            }
          } catch (e) {
          } finally {
            (this.originalWorkbook.resumePaint(),
              this.originalWorkbook.repaint());
          }
        }
        addSheet(e, t) {
          if (!Number.isInteger(e) || e < 0)
            throw Error("invalid index: must be a non-negative integer");
          if ("string" != typeof t || "" === t.trim())
            throw Error("name must be a non-empty string");
          for (let e = 0; e < this.originalWorkbook.getSheetCount(); e++) {
            let r = this.originalWorkbook.getSheet(e);
            if (r && r.name() === t) return this.getSheet(e);
          }
          return (
            this.originalWorkbook.addSheet(e),
            this.originalWorkbook.getSheet(e).name(t),
            this.makeSheetFullSize(this.originalWorkbook.getSheet(e)),
            this.getSheet(e)
          );
        }
        removeSheet(e) {
          if (e < 0)
            throw Error("invalid index ".concat(e, ": must be non-negative"));
          let t = this.getSheetCount();
          if (e >= t)
            throw Error(
              "invalid index "
                .concat(e, ": must be less than sheet count (")
                .concat(t, ")"),
            );
          this.originalWorkbook.removeSheet(e);
        }
        getSheetCount() {
          return this.originalWorkbook.getSheetCount();
        }
        setActiveSheetIndex(e) {
          if (e < 0)
            throw Error("invalid index ".concat(e, ": must be non-negative"));
          let t = this.getSheetCount();
          if (e >= t)
            throw Error(
              "invalid index "
                .concat(e, ": must be less than sheet count (")
                .concat(t, ")"),
            );
          this.originalWorkbook.setActiveSheetIndex(e);
        }
        setGridlinesForAllSheets(e) {
          let t = this.originalWorkbook.getSheetCount();
          for (let o = 0; o < t; o++) {
            let t = this.originalWorkbook.getSheet(o);
            if (t) {
              var r;
              t.options.gridline = {
                showVerticalGridline: e,
                showHorizontalGridline: e,
                color: null == (r = t.options.gridline) ? void 0 : r.color,
              };
            }
          }
        }
        fromJSON(e) {
          (this.originalWorkbook.fromJSON(e),
            this.originalWorkbook.suspendPaint(),
            (this.originalWorkbook.options.calcOnDemand = !1),
            this.originalWorkbook.calculate(1),
            this.originalWorkbook.resumePaint(),
            this.makeAllSheetsFullSize());
        }
        getSheet(e) {
          let t = this.originalWorkbook.getSheet(e);
          return t ? new eh(t, e, this) : null;
        }
        moveSheet(e, t) {
          let r = this.getSheetCount();
          if (t < 0) throw Error("invalid index (negative)");
          if (t >= r)
            throw Error("invalid index (greater than or equal to sheet count)");
          if (!e || 0 === e.trim().length) throw Error("invalid name (empty)");
          let o = this.getSheetFromName(e);
          if (!o) throw Error("sheet not found: ".concat(e));
          if (o.getIndex() === t) return;
          if (r <= 1)
            throw Error("cannot move sheet when there is only one sheet");
          let a = o.getName();
          this.originalWorkbook.changeSheetIndex(a, t);
        }
        getSheetFromName(e) {
          let t = null;
          try {
            t = (function (e, t, r) {
              let {
                fuzzyMatch: o = !0,
                threshold: a = 0.3,
                returnDetails: n = !1,
              } = r || {};
              if (t.includes("/")) return null;
              let i = e.getSheetIndex(t);
              if (-1 !== i)
                return n
                  ? {
                      index: i,
                      name: e.getSheet(i).name(),
                      matchType: "exact",
                      confidence: 1,
                    }
                  : i;
              let l = e.getSheetCount(),
                s = [];
              for (let t = 0; t < l; t++) {
                let r = e.getSheet(t);
                if (r) {
                  let e = r.name();
                  s.push({
                    index: t,
                    name: e,
                    normalized: em(e),
                  });
                }
              }
              let c = em(t),
                h = s.find((e) => e.name.toLowerCase() === t.toLowerCase());
              if (h)
                return n
                  ? {
                      index: h.index,
                      name: h.name,
                      matchType: "case-insensitive",
                      confidence: 0.95,
                    }
                  : h.index;
              if ((h = s.find((e) => e.normalized === c)))
                return n
                  ? {
                      index: h.index,
                      name: h.name,
                      matchType: "normalized",
                      confidence: 0.9,
                    }
                  : h.index;
              if (
                (h = s.find(
                  (e) => e.normalized.includes(c) || c.includes(e.normalized),
                ))
              ) {
                let e =
                  Math.min(c.length, h.normalized.length) /
                  Math.max(c.length, h.normalized.length);
                return n
                  ? {
                      index: h.index,
                      name: h.name,
                      matchType: "partial",
                      confidence: 0.8 * e,
                    }
                  : h.index;
              }
              for (let e of (function (e) {
                let t = [];
                for (let [r, o] of (t.push(e.replace(/(\d+)/g, " $1 ").trim()),
                t.push(e.replace(/\s+(\d+)/g, "$1")),
                t.push(e.replace(/(\d+)\s+/g, "$1")),
                [
                  ["sheet", "Sheet"],
                  ["data", "Data"],
                  ["summary", "Summary"],
                  ["report", "Report"],
                  ["table", "Table"],
                  ["chart", "Chart"],
                  ["pivot", "Pivot"],
                  ["dashboard", "Dashboard"],
                ]))
                  e.toLowerCase().includes(r.toLowerCase()) &&
                    t.push(e.replace(RegExp(r, "gi"), o));
                return (
                  t.push(e.replace(/_/g, " ")),
                  t.push(e.replace(/-/g, " ")),
                  t.push(e.replace(/\s+/g, "_")),
                  t.push(e.replace(/\s+/g, "-")),
                  t.push(e.replace(/\s+/g, "")),
                  t.push(e.replace(/['']s\b/g, "")),
                  t.push(e.replace(/s['']$/g, "s")),
                  [...new Set(t)]
                );
              })(t))
                if (
                  (h = s.find((t) => t.name.toLowerCase() === e.toLowerCase()))
                )
                  return n
                    ? {
                        index: h.index,
                        name: h.name,
                        matchType: "variation",
                        confidence: 0.85,
                      }
                    : h.index;
              if (o) {
                let e = s
                  .map((e) => ({
                    ...e,
                    distance: (0, eg.I)(c, e.normalized),
                    originalDistance: (0, eg.I)(
                      t.toLowerCase(),
                      e.name.toLowerCase(),
                    ),
                  }))
                  .filter(
                    (e) =>
                      Math.min(e.distance, e.originalDistance) <=
                      Math.min(3, Math.ceil(e.normalized.length * a)),
                  )
                  .sort(
                    (e, t) =>
                      Math.min(e.distance, e.originalDistance) -
                      Math.min(t.distance, t.originalDistance),
                  );
                if (e.length > 0) {
                  let r = e[0],
                    o = Math.min(r.distance, r.originalDistance),
                    a = Math.max(t.length, r.name.length);
                  if (
                    1 === e.length ||
                    (e.length > 1 &&
                      Math.min(e[0].distance, e[0].originalDistance) <
                        Math.min(e[1].distance, e[1].originalDistance) - 1)
                  )
                    return n
                      ? {
                          index: r.index,
                          name: r.name,
                          matchType: "fuzzy",
                          confidence: (1 - o / a) * 0.7,
                        }
                      : r.index;
                }
              }
              return null;
            })(this.originalWorkbook, e, {
              fuzzyMatch: !0,
              threshold: 0.3,
              returnDetails: !0,
            });
          } catch (e) {
            return null;
          }
          return t && "object" == typeof t ? this.getSheet(t.index) : null;
        }
        selectCellRange(e) {
          let { startRow: t, startCol: r, endRow: o, endCol: a } = (0, h.IB)(e);
          this.originalWorkbook
            .getActiveSheet()
            .setSelection(t, r, o - t + 1, a - r + 1);
        }
        selectCell(e) {
          let { row: t, col: r } = (0, h.VW)(e);
          this.originalWorkbook.getActiveSheet().setActiveCell(t, r);
        }
        indexToAddress(e, t) {
          let r = (0, h.dE)(t);
          return "".concat(r).concat(e + 1);
        }
        rangeToExcelRange(e, t, r, o) {
          let a = this.indexToAddress(e, t),
            n = this.indexToAddress(r, o);
          return "".concat(a, ":").concat(n);
        }
        getRowRange(e) {
          return "".concat(e + 1, ":").concat(e + 1);
        }
        getColumnRange(e) {
          let t = (0, h.dE)(e);
          return "".concat(t, ":").concat(t);
        }
        addressToIndex(e) {
          return (0, h.VW)(e);
        }
        excelRangeToRange(e) {
          return (0, h.IB)(e);
        }
        importOnce(e, t, r, o) {
          if (this.hasImportedFile) throw Error(T);
          ((this.hasImportedFile = !0),
            this.originalWorkbook.import(e, t, r, o));
        }
        getFilePath() {
          return this.filePath;
        }
        resetImportFlag() {
          this.hasImportedFile = !1;
        }
        cutAndPasteRange(e, t) {
          let {
              startRow: r,
              startCol: a,
              endRow: n,
              endCol: i,
              sheetName: l,
            } = (0, h.IB)(e),
            { row: s, col: c, sheetName: u } = (0, h.VW)(t);
          if (!l)
            throw Error(
              "Must include sheet name when moving range fromRange: ".concat(e),
            );
          let d = this.getSheetFromName(l);
          if (!d) throw Error("Source sheet not found for range: ".concat(e));
          let g = u ? this.getSheetFromName(u) : d;
          if (!g) throw Error("Target sheet not found for range: ".concat(t));
          let m = n - r + 1,
            p = i - a + 1;
          this.originalWorkbook.commandManager().execute({
            cmd: "clipboardPaste",
            sheetName: g.getName(),
            fromSheet: d.originalSheet,
            fromRanges: [
              {
                row: r,
                col: a,
                rowCount: m,
                colCount: p,
              },
            ],
            pastedRanges: [
              {
                row: s,
                col: c,
                rowCount: m,
                colCount: p,
              },
            ],
            isCutting: !0,
            clipboardText: "",
            pasteOption: o.Spread.Sheets.ClipboardPasteOptions.all,
          });
        }
        getNamedRangeInfo() {
          var e;
          let t =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : 200;
          return (function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 200;
            if (0 === e.length) return "";
            let r = e.length > t,
              o = r ? e.slice(0, t) : e,
              a = [
                "=== Named Ranges ===",
                "Total: ".concat(e.length, " named range(s), CSV:"),
                "--------------------------------------------",
              ];
            a.push(
              (function (e) {
                if (0 === e.length) return "";
                let t = Object.keys(e[0]);
                return [
                  t.join(","),
                  ...e.map((e) =>
                    t
                      .map((t) => {
                        let r;
                        return (
                          (r = e[t]),
                          '"'.concat(
                            String(null != r ? r : "").replace(/"/g, '""'),
                            '"',
                          )
                        );
                      })
                      .join(","),
                  ),
                ].join("\n");
              })(o),
            );
            let n = a.join("\n").trim();
            return (
              r &&
                (n += "\n... and ".concat(
                  e.length - t,
                  ' more named range(s). Please use the "getNamedRangeInfo" method if you need the full list.',
                )),
              n
            );
          })(
            [
              ...ep((e = this.originalWorkbook)),
              ...e.sheets.map((e) => ep(e)).flat(),
            ],
            t,
          );
        }
        addNamedRange(e, t, r) {
          !(function (e, t, r, o) {
            let a =
              arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
            if (!r.includes("$"))
              throw Error(
                "Named range must be an absolute reference. Relative references are not supported.",
              );
            let n = r;
            (n.startsWith("=") || (n = "=" + r),
              e.addCustomName(t, n, 0, 0, o, a));
          })(this.originalWorkbook, e, t, r);
        }
        removeNamedRange(e, t) {
          var r = this.originalWorkbook;
          let o = r;
          if (t && "workbook" !== t) {
            let a = r.sheets.find((e) => e.name() === t);
            if (!a)
              throw Error(
                'Sheet "'
                  .concat(t, '" not found when removing named range "')
                  .concat(e, '"'),
              );
            o = a;
          }
          if (!o.getCustomName(e))
            throw Error(
              'Named range "'
                .concat(e, '" not found for scope "')
                .concat(t, '"'),
            );
          o.removeCustomName(e);
        }
        buildDag() {
          return null;
        }
        getDagForCell(e) {
          return null;
        }
        printDagForRange(e) {
          return "";
        }
        printDagForCell(e) {
          return "";
        }
        constructor(e, t) {
          ((this.hasImportedFile = !1),
            (this.beforeCalculateCallback = null),
            (this.afterCalculateCallback = null),
            (this.originalWorkbook = e),
            (this.filePath = t),
            (this.originalWorkbook.options.allowExtendPasteRange = !0),
            (this._cellSourceTracker = new ed(e)),
            this.makeAllSheetsFullSize(),
            this.resizeOnNewSheet(),
            this.setupSelectAllHandler(),
            this.setupDynamicExpansion());
        }
      }
      function ey(e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : new Map(),
          r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
          o = new Set(),
          a = (e) => {
            let r = e;
            for (let [e, a] of t)
              -1 !== r.indexOf(e) && ((r = r.replace(e, a)), o.add(e));
            return r;
          },
          n = new Map();
        for (let [t, r] of e.nodeMap) {
          let e = Array.from(r.toEdges).map(a).sort().join(","),
            o = n.get(e) || [];
          (o.push(t), n.set(e, o));
        }
        let i = [],
          l = [];
        for (let [e, t] of Array.from(n.entries()).sort()) {
          if ("" === e) continue;
          let r = t.map(a).sort().join(",");
          l.push("".concat(r, "→").concat(e));
        }
        if (0 === l.length) return "";
        if (
          (r && (i.push(""), i.push("----  Formula Precedents  ----")),
          t.size > 0)
        ) {
          let e = [];
          for (let [r, a] of t) {
            if (!o.has(r)) continue;
            let t = "" === a ? '""' : '"'.concat(a, '"');
            e.push('  "'.concat(r, '" = ').concat(t));
          }
          e.length > 0 &&
            (i.push(""), i.push("Legend:"), i.push(...e), i.push(""));
        }
        i.push(...l);
        let s = i.slice(0, 500);
        return (
          i.length > 500 && s.push("... (and " + (i.length - 500) + " more)"),
          s.join("\n")
        );
      }
      var ew = r(90242);
      class ev {
        add(e, t) {
          let r = this._getOrCreateNode(e);
          if (!t) return;
          let o = this._getOrCreateNode(t);
          if (this._hasPath(t, e))
            throw Error("Cycle detected: ".concat(e, " -> ").concat(t));
          this._addEdge(r, o);
        }
        clearOutboundEdges(e) {
          let t = this.nodeMap.get(e);
          if (t) {
            for (let r of (null == t ? void 0 : t.toEdges) || []) {
              let t = this.nodeMap.get(r);
              t && t.fromEdges.delete(e);
            }
            t.toEdges.clear();
          }
        }
        _hasPath(e, t) {
          if (e === t) return !0;
          let r = new Set(),
            o = [e];
          for (; o.length; ) {
            let e = o.pop();
            if (r.has(e)) continue;
            if ((r.add(e), e === t)) return !0;
            let a = this.nodeMap.get(e);
            if (a) for (let e of a.toEdges) o.push(e);
          }
          return !1;
        }
        _getOrCreateNode(e) {
          let t = this.nodeMap.get(e) || {
            value: e,
            fromEdges: new Set(),
            toEdges: new Set(),
            isStart: !0,
          };
          return (this.nodeMap.set(e, t), t);
        }
        _addEdge(e, t) {
          (e.toEdges.add(t.value), t.fromEdges.add(e.value), (t.isStart = !1));
        }
        constructor() {
          this.nodeMap = new Map();
        }
      }
      function eC(e, t) {
        let r = new ev(),
          o = {
            ancestors: new Set(),
            descendants: new Set(),
          };
        for (let a of t)
          e.nodeMap.has(a) &&
            (r.add(a),
            o.ancestors.add(a),
            o.descendants.add(a),
            eb(e, r, a, "ancestors", o),
            eb(e, r, a, "descendants", o));
        return r;
      }
      function eb(e, t, r, o, a) {
        let n = e.nodeMap.get(r);
        if (!n) return;
        let i = "ancestors" === o ? n.fromEdges : n.toEdges,
          l = a[o];
        for (let n of i)
          (t.add(n),
            "ancestors" === o ? t.add(n, r) : t.add(r, n),
            l.has(n) || (l.add(n), eb(e, t, n, o, a)));
      }
      class eT {
        build() {
          this.dag.nodeMap.clear();
          let e = this.workbook.getSheetCount();
          for (let t = 0; t < e; t++) {
            let e = this.workbook.getSheet(t);
            e && this.addSheetToDag(e);
          }
          return this.dag;
        }
        dagForRange(e) {
          let t = this._rangeToCells(e);
          return eC(this.dag, t);
        }
        createPrintLegend() {
          let e = new Map();
          for (let t = 0; t < this.workbook.getSheetCount(); t++) {
            let r = this.workbook.getSheet(t);
            r && e.set(r.getName(), "".concat(t));
          }
          return e;
        }
        _rangeToCells(e) {
          if (!e.includes("!"))
            throw Error("Cannot recalculate cell - no sheet name: ".concat(e));
          let t = e.split("!")[0],
            { startRow: r, startCol: o, endRow: a, endCol: n } = (0, h.IB)(e),
            i = [];
          for (let e = r; e <= a; e++)
            for (let r = o; r <= n; r++) i.push((0, h.K7)(t, e, r));
          return i;
        }
        dagForCell(e) {
          return eC(this.dag, [e]);
        }
        updateDagForCell(e) {
          let { sheetName: t } = (0, h.VW)(e);
          if (!t)
            throw Error("Cannot recalculate cell - no sheet name: ".concat(e));
          let r = this.workbook.getSheetFromName(t);
          if (!r)
            throw Error(
              "Cannot recalculate cell - sheet not found: ".concat(e),
            );
          (this.dag.clearOutboundEdges(e), this.addCellPrecedentsToDag(e, r));
        }
        addSheetToDag(e) {
          let t = e.getUsedRange();
          if (!t) return;
          let { startRow: r, startCol: o, endRow: a, endCol: n } = (0, h.IB)(t),
            i = e.getName();
          for (let t = r; t <= a; t++)
            for (let r = o; r <= n; r++) {
              if (!e.getFormula(t, r)) continue;
              let o = (0, h.K7)(i, t, r);
              this.addCellPrecedentsToDag(o, e);
            }
        }
        addCellPrecedentsToDag(e, t) {
          let { sheetName: r, row: o, col: a } = (0, h.VW)(e);
          if (!r)
            throw Error("Sheet name not found for cell address: ".concat(e));
          let n = t.originalSheet.getPrecedents(o, a);
          for (let t of (this.dag.add(e), n))
            try {
              this.addPrecedentEdge(t, e);
            } catch (e) {
              (0, ew.gg)("failed to add precedent edge", e);
            }
        }
        addPrecedentEdge(e, t) {
          let r = e.row,
            o = e.col,
            a = e.sheetName;
          if (!this.workbook.getSheetFromName(a)) return;
          let n = e.rowCount || 1,
            i = e.colCount || 1,
            l =
              n > 1 || i > 1
                ? (0, h.zj)(a, r, o, r + n, o + i)
                : (0, h.K7)(a, r, o);
          try {
            this.dag.add(t, l);
          } catch (e) {
            console.error("Error adding precedent to DAG: ".concat(e));
          }
        }
        constructor(e) {
          ((this.dag = new ev()), (this.workbook = e));
        }
      }
      var ek = r(15376);
      class eE extends eh {
        isCellInViewport(e) {
          let t = this.originalSheet.getViewportBottomRow(1),
            r = this.originalSheet.getViewportLeftColumn(1),
            o = this.originalSheet.getViewportRightColumn(1),
            a = this.originalSheet.getViewportTopRow(1);
          return e.row >= a && e.row <= t && e.col >= r && e.col <= o;
        }
        setHoverHighlightCallbacks(e, t) {}
        highlightCellsHover(e) {
          (arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            arguments.length > 2 && void 0 !== arguments[2] && arguments[2]);
        }
        clearHoverHighlights() {}
        constructor(e, t, r) {
          super(e, t, r);
        }
      }
      class eA extends eS {
        getSheet(e) {
          let t = this.originalWorkbook.getSheet(e);
          return t ? new eE(t, e, this) : null;
        }
        getActiveSheet() {
          let e = this.originalWorkbook.getActiveSheetIndex();
          return this.getSheet(e);
        }
        getSheetFromName(e) {
          return super.getSheetFromName(e);
        }
        fromJSON(e) {
          (super.fromJSON(e), (0, ek.kO)(this.originalWorkbook));
        }
        buildDag() {
          return this.workbookDAG.build();
        }
        getDagForCell(e) {
          return this.workbookDAG.dagForCell(e);
        }
        printDagForRange(e) {
          return ey(
            this.workbookDAG.dagForRange(e),
            this.workbookDAG.createPrintLegend(),
            !0,
          );
        }
        printDagForCell(e) {
          return ey(
            this.workbookDAG.dagForRange(e),
            this.workbookDAG.createPrintLegend(),
          );
        }
        constructor(e, t) {
          (super(e, t),
            (this.workbookDAG = new eT(this)),
            (0, ek.kO)(this.originalWorkbook));
        }
      }
    },
    10705: (e, t, r) => {
      r.d(t, {
        S: () => C,
        j: () => v,
      });
      var o = r(77434);
      class a {}
      var n = r(59981);
      class i extends a {
        async uploadFile(e, t) {
          let r =
            arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          try {
            let {
              uploadUrl: a,
              path: i,
              token: l,
            } = await (0, n.d5)({
              fileName: e,
              fileType: t.type,
              fileSize: t.size,
              usePublicBucket: r,
            });
            if ((await (0, n.lp)(t, a, l), r))
              return "".concat(o._.NEXT_PUBLIC_SUPABASE_CDN_URL, "/").concat(i);
            {
              let { signedUrl: e } = await (0, n.SX)({
                path: i,
                expiresIn: 43200,
              });
              return e;
            }
          } catch (e) {
            throw (console.error("Error uploading file:", e), e);
          }
        }
        async uploadJSON(e, t) {
          let r =
            !(arguments.length > 2) || void 0 === arguments[2] || arguments[2];
          try {
            let o = JSON.stringify(t, null, 2),
              a = new Blob([o], {
                type: "application/json",
              }),
              n = new File([a], e, {
                type: "application/json",
              });
            return await this.uploadFile(e, n, r);
          } catch (e) {
            throw (console.error("Error uploading JSON:", e), e);
          }
        }
        constructor() {
          super();
        }
      }
      var l = r(90242),
        s = r(97871),
        c = r(77313),
        h = r(91096),
        u = r(78014),
        d = r(37944),
        g = r(79474),
        m = r(34602),
        p = r(98614),
        f = r(44948),
        S = r(41762),
        y = r(80257),
        w = (function (e) {
          return ((e.V1 = "v1"), e);
        })({});
      let v = () => {
          let e = (0, c.f)((e) => e.workbook),
            { client: t } = (0, g.As)(),
            r = (0, m.useThreadStore)((e) => e.getActiveThreadId());
          return {
            createShareLink: (0, f.useCallback)(
              async (o) => {
                if (!e)
                  throw Error(
                    "No workbook proxy found when creating share link",
                  );
                return await C(e, o, t, r);
              },
              [e, t, r],
            ),
          };
        },
        C = async (e, t, r, o) => {
          let a = await A(e, t, r, o),
            n = await b(a);
          return (
            (0, h.r)(u.gI.SHARE_LINK_CREATED),
            {
              link: "".concat(window.location.origin, "/share/").concat(n.id),
              withPermissions: n,
            }
          );
        },
        b = async (e) => {
          let t = await (0, d.authenticatedFetch)("/api/share-links/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contentId: e,
              originalFileId: s.x.getState().activeFileId || "",
            }),
          });
          if (!t.ok)
            throw Error(
              "Failed to create share link: "
                .concat(t.status, " ")
                .concat(t.statusText),
            );
          return await t.json();
        },
        T = async (e, t) => {
          try {
            let r = await (0, y.R)(e, t),
              o = new i(),
              a = await o.uploadFile(t, r, !1);
            return ((0, l.gg)("Workbook uploaded to:", a), a);
          } catch (e) {
            throw (console.error("Error uploading workbook file:", e), e);
          }
        },
        k = async (e, t) => {
          try {
            let e = document.getElementById("excel-display");
            if (!e) throw Error("App container not found for screenshot");
            await new Promise((e) => setTimeout(e, 500));
            let { width: r, height: o } = ((e) => {
                let t = e.getBoundingClientRect(),
                  r = t.width,
                  o = t.height,
                  a = r / o;
                if (a < 1 || a > 2)
                  return {
                    width: 1200,
                    height: 800,
                  };
                let n = r,
                  i = o;
                return (
                  n > 1600 && ((i = (1600 * i) / n), (n = 1600)),
                  i > 1200 && ((n = (1200 * n) / i), (i = 1200)),
                  {
                    width: Math.round(n),
                    height: Math.round(i),
                  }
                );
              })(e),
              a = await (0, p.$E)(e, {
                quality: 1,
                skipAutoScale: !0,
                pixelRatio: 1,
                backgroundColor: "#ffffff",
                width: r,
                height: o,
                style: {
                  transform: "scale(1)",
                  transformOrigin: "top left",
                },
              });
            if (!a || !a.startsWith("data:image/"))
              throw Error("Invalid screenshot data URL generated");
            let n = "".concat(t, ".png"),
              s = ((e, t) => {
                var r;
                let o = e.split(","),
                  a =
                    (null == (r = o[0].match(/:(.*?);/)) ? void 0 : r[1]) ||
                    "image/png",
                  n = atob(o[1]),
                  i = n.length,
                  l = new Uint8Array(i);
                for (; i--; ) l[i] = n.charCodeAt(i);
                return new File([l], t, {
                  type: a,
                });
              })(a, n),
              c = new i(),
              h = await c.uploadFile(n, s, !1);
            return ((0, l.gg)("Screenshot uploaded to:", h), h);
          } catch (e) {
            return (
              console.error("Error taking screenshot and uploading:", e),
              S.toast.warning("Could not generate image preview", {
                description: "The share link will be created without an image.",
              }),
              null
            );
          }
        },
        E = async (e, t) => {
          if (!t)
            return (
              (0, l.gg)("No active thread to share conversation from"),
              null
            );
          try {
            let r = await e.threads.getHistory(t, {
              limit: 1,
            });
            if (!r || 0 === r.length)
              return ((0, l.gg)("No history found for thread:", t), null);
            let o = r[0],
              a = null == o ? void 0 : o.values,
              n = null == a ? void 0 : a.messages;
            if (!n || !Array.isArray(n) || 0 === n.length)
              return ((0, l.gg)("No messages found in thread history"), null);
            return (
              (0, l.gg)(
                "Sharing ".concat(n.length, " messages from thread ").concat(t),
              ),
              {
                threadId: t,
                messages: n,
              }
            );
          } catch (e) {
            return (
              console.error("Error fetching conversation for share:", e),
              S.toast.warning("Could not include conversation history", {
                description:
                  "The share link will be created without conversation data.",
              }),
              null
            );
          }
        },
        A = async (e, t, r, o) => {
          try {
            let a = crypto.randomUUID(),
              n = "".concat(a, ".xlsx"),
              [l, s, c] = await Promise.all([
                T(e.originalWorkbook, n),
                k(e, a),
                E(r, o),
              ]),
              h = {
                shareVersion: w.V1,
                shareImageUrl: s,
                spreadSheetFileUrl: l,
                sharedConversation: c,
                shareFileName: t,
              },
              u = new i(),
              d = "".concat(a, ".json");
            return (await u.uploadJSON(d, h, !1), a);
          } catch (e) {
            throw (console.error("Error creating share snapshot:", e), e);
          }
        };
    },
    11420: (e, t, r) => {
      r.d(t, {
        qO: () => l,
        S6: () => i,
      });
      var o = r(35033);
      let a = [
        {
          id: "free-upgrade-pro",
          text: "Upgrade to Pro for more credits and messages",
          conditions: {
            accountTypes: ["free"],
          },
          category: "upgrade",
          action: o.vS.PRICING_MODAL,
          achievement: "upgrade_pro",
        },
        {
          id: "upgrade-team",
          text: "Create a Team to share templates and AI rules across your org",
          conditions: {
            accountTypes: ["free", "pro"],
          },
          category: "upgrade",
          action: o.vS.PRICING_MODAL,
          achievement: "upgrade_team",
        },
        {
          id: "admin-invite",
          text: "Invite team members to collaborate on shared resources",
          conditions: {
            accountTypes: ["team_admin"],
          },
          category: "team",
          action: o.vS.SETTINGS_TEAM,
          achievement: "team_invite",
        },
        {
          id: "admin-shared-rules",
          text: "Create shared AI rules that apply to your whole team",
          conditions: {
            accountTypes: ["team_admin"],
          },
          category: "team",
          action: o.vS.SETTINGS_AI_RULES,
          achievement: "team_ai_rules",
        },
        {
          id: "team-templates",
          text: "Upload shared templates your whole team can use",
          conditions: {
            accountTypes: ["team_admin"],
          },
          category: "team",
          action: o.vS.TEAM_SHARED_RESOURCES,
          achievement: "team_templates",
        },
        {
          id: "team-prompts",
          text: "Save shared prompts for your whole team to use",
          conditions: {
            accountTypes: ["team_admin"],
          },
          category: "team",
          action: o.vS.TEAM_SHARED_RESOURCES,
          achievement: "team_prompts",
        },
        {
          id: "first-prompt",
          text: "Send your first prompt to get started with Shortcut",
          conditions: {
            hideIfAchievement: ["first_prompt"],
          },
          category: "feature_discovery",
          action: o.vS.CHAT_INPUT,
          achievement: "first_prompt",
        },
        {
          id: "ai-rules",
          text: "Set your AI rules so Shortcut saves your preferences",
          textIfUsed:
            "Revise your AI rules to fine-tune how Shortcut works for you",
          usedCondition: "ai_rules",
          conditions: {},
          category: "feature_discovery",
          action: o.vS.AI_PREFERENCES,
          achievement: "ai_preferences",
        },
        {
          id: "saved-prompts",
          text: "Save prompts to your library for quick reuse",
          textIfUsed: "Add more saved prompts to speed up your workflow",
          usedCondition: "saved_prompts",
          conditions: {},
          category: "feature_discovery",
          action: o.vS.PROMPT_LIBRARY,
          achievement: "prompt_library",
        },
        {
          id: "reuse-prompts",
          text: "Use saved prompts from your library to speed up your workflow",
          conditions: {},
          category: "power_user",
          action: o.vS.PROMPT_LIBRARY,
          achievement: "prompt_reuse",
        },
        {
          id: "try-ask-mode",
          text: "Try Ask mode to get answers without changing your sheet",
          conditions: {},
          category: "feature_discovery",
          action: o.vS.AGENT_MODE_SELECTOR,
          achievement: "ask_mode",
        },
        {
          id: "try-checkpoints",
          text: "Restore to any checkpoint to undo agent changes",
          conditions: {},
          category: "feature_discovery",
          achievement: "checkpoint_restore",
        },
        {
          id: "edit-message",
          text: "Edit a message to refine your prompt and get better results",
          conditions: {},
          category: "feature_discovery",
          achievement: "edit_message",
        },
        {
          id: "try-multi-conversation",
          text: "Run multiple agents at a time with multiple chats",
          conditions: {},
          category: "feature_discovery",
          action: o.vS.MULTI_CONVERSATION,
          achievement: "multi_conversation",
        },
        {
          id: "try-attachments",
          text: "Attach a file in chat to provide the agent with more context",
          conditions: {},
          category: "feature_discovery",
          action: o.vS.FILE_UPLOAD,
          achievement: "use_attachments",
        },
        {
          id: "add-template",
          text: "Save a spreadsheet as a template to reuse it later",
          conditions: {},
          category: "feature_discovery",
          action: o.vS.NEW_FILE_TEMPLATES,
          achievement: "add_template",
        },
        {
          id: "use-template",
          text: "Choose a saved template to get started from an existing model",
          conditions: {},
          category: "feature_discovery",
          action: o.vS.NEW_FILE_TEMPLATES,
          achievement: "use_template",
        },
        {
          id: "try-web-scraper",
          text: "Give Shortcut a URL to fetch data from",
          conditions: {},
          category: "power_user",
          action: o.vS.CHAT_INPUT,
          achievement: "web_scraper",
        },
        {
          id: "try-formula-trace",
          text: 'Click the "Trace" button on cells with formulas to trace them',
          conditions: {},
          category: "feature_discovery",
          action: o.vS.FORMULA_TRACING,
          achievement: "formula_tracer",
        },
        {
          id: "plan-mode",
          text: "Use plan mode for complicated or open-ended tasks",
          conditions: {},
          category: "power_user",
          action: o.vS.AGENT_MODE_SELECTOR,
          achievement: "plan_mode",
        },
        {
          id: "share-links",
          text: "Generate a share link to send files anywhere",
          conditions: {},
          category: "power_user",
          action: o.vS.SHARE,
          achievement: "share_link",
        },
        {
          id: "streak-3",
          text: "Use Shortcut 3 days in a row to unlock the Streak achievement",
          conditions: {},
          category: "power_user",
          action: o.vS.CHAT_INPUT,
          achievement: "streak_3_day",
        },
        {
          id: "formula-expert",
          text: "Trace 10 formulas to become a Formula Expert",
          conditions: {},
          category: "power_user",
          action: o.vS.FORMULA_TRACING,
          achievement: "formula_expert",
        },
      ];
      function n(e, t) {
        let { conditions: r } = e;
        return (
          !r.accountTypes ||
          !(r.accountTypes.length > 0) ||
          !!r.accountTypes.includes(t.accountType)
        );
      }
      function i(e) {
        return a
          .filter((t) =>
            (function (e, t) {
              if (!n(e, t)) return !1;
              let { conditions: r } = e;
              if (
                r.hideIfAchievement &&
                r.hideIfAchievement.length > 0 &&
                r.hideIfAchievement.every((e) =>
                  t.unlockedAchievements.includes(e),
                )
              )
                return !1;
              if (r.showIf && r.showIf.length > 0) {
                var o;
                let e =
                  null != (o = t.teamResources)
                    ? o
                    : {
                        has_team_templates: !1,
                        has_team_ai_rules: !1,
                      };
                if (!r.showIf.every((t) => e[t])) return !1;
              }
              return !0;
            })(t, e),
          )
          .map((t) => ({
            id: t.id,
            text: (function (e, t) {
              if (e.usedCondition && e.textIfUsed) {
                var r;
                if (
                  (null != (r = t.featureUsage)
                    ? r
                    : {
                        ai_rules: !1,
                        saved_prompts: !1,
                        templates: !1,
                      })[e.usedCondition]
                )
                  return e.textIfUsed;
              }
              return e.text;
            })(t, e),
            action: t.action,
          }));
      }
      function l(e) {
        var t;
        let r = a
            .filter((t) => !!t.action && n(t, e))
            .map((t) => ({
              id: t.id,
              text: t.text,
              action: t.action,
              category: t.category,
              achievement: t.achievement,
              isCompleted: e.unlockedAchievements.includes(t.achievement),
            })),
          o = new Map();
        for (let e of r) {
          let r = null != (t = o.get(e.category)) ? t : [];
          (r.push(e), o.set(e.category, r));
        }
        return ["feature_discovery", "power_user", "team", "upgrade"]
          .filter((e) => o.has(e))
          .map((e) => ({
            category: e,
            tips: o.get(e),
          }));
      }
    },
    14377: (e, t, r) => {
      r.d(t, {
        dE: () => o.dE,
        zh: () => u,
        db: () => l,
        oL: () => h,
        as: () => s,
        hB: () => i,
        p1: () => c,
        o2: () => n,
        p: () => o.p,
        VW: () => o.VW,
      });
      var o = r(2845),
        a = r(90123);
      function n(e, t) {
        return "number" == typeof e && !t;
      }
      function i(e) {
        return !!e && e.includes("!");
      }
      function l(e) {
        return "string" == typeof e && "" !== e;
      }
      function s(e) {
        return "string" == typeof e && e.includes("%");
      }
      function c(e) {
        return (
          "string" == typeof e &&
          !!isNaN(Number(e)) &&
          (e.startsWith("=") || e.startsWith("+") || e.startsWith("-"))
        );
      }
      function h(e) {
        if (!e || "string" != typeof e) return !1;
        let t = RegExp(
            "(?<![A-Z$!])(?<![A-Z]\\d*)\\b\\d+\\.?\\d*\\b(?![A-Z])",
            "gi",
          ),
          r = e.replace(/"[^"]*"/g, "");
        return t.test(r);
      }
      function u(e) {
        let t = e.reduce((e, t) => {
            let r = t.sheet,
              a = t.address,
              n = a;
            a.includes(":") || (n = "".concat(a, ":").concat(a));
            let { startRow: i, startCol: l } = (0, o.tS)(n);
            return (
              e[r] || (e[r] = []),
              e[r].push({
                row: i,
                col: l,
              }),
              e
            );
          }, {}),
          r = [];
        for (let [e, n] of Object.entries(t))
          for (let { startRow: t, startCol: i, endRow: l, endCol: s } of (0,
          a.T)(n)) {
            let a =
              t === l && i === s ? (0, o.pC)(t, i) : (0, o.lJ)(t, i, l, s);
            r.push("".concat(e, "!").concat(a));
          }
        return r;
      }
    },
    15376: (e, t, r) => {
      r.d(t, {
        kO: () => N,
      });
      var o = r(77313),
        a = r(60395),
        n = r(39924),
        i = r(46462);
      async function l(e) {
        return (0, i.Sr)(e, (0, i.i5)((0, n.$)()));
      }
      var s = r(90242),
        c = r(65903),
        h = r(44968);
      let u = "ai_formula_tracking",
        d = () =>
          ""
            .concat(Date.now(), "-")
            .concat(Math.random().toString(36).substring(2, 9)),
        g = !1;
      function m() {
        let e = sessionStorage.getItem(u);
        if (e)
          try {
            let t = JSON.parse(e),
              r = Date.now() - t.startTimestamp;
            (c.analytics.track(c.EVENTS.AI_FORMULA_SUCCESS, {
              feature: "ai_formula",
              sessionId: t.sessionId,
              executionCount: t.executionCount,
              webSearchUsedCount: t.webSearchUsedCount,
              totalInputTokens: t.totalInputTokens,
              totalOutputTokens: t.totalOutputTokens,
              totalTokens: t.totalTokens,
              sessionDurationMs: r,
              avgTokensPerCall:
                t.executionCount > 0
                  ? Math.round(t.totalTokens / t.executionCount)
                  : 0,
            }),
              sessionStorage.removeItem(u),
              (0, s.gg)("AI Cell: Flushed tracking stats", t));
          } catch (e) {}
      }
      let p = async (e) => {
        try {
          let t = await l(e);
          if (!t)
            throw Error("Failed to get response from AI formula endpoint");
          (0, s.gg)("AI Cell: LLM response", {
            text: t.text,
            metadata: t.metadata,
          });
          let { text: r, metadata: o } = t,
            {
              webSearchUsed: a,
              inputTokens: n,
              outputTokens: i,
              totalTokens: c,
            } = o;
          return (
            (0, s.gg)(
              "AI Cell Token Usage: "
                .concat(n, " input + ")
                .concat(i, " output = ")
                .concat(c, " total tokens"),
            ),
            !(function (e, t) {
              let r;
              g ||
                (window.addEventListener("beforeunload", m),
                document.addEventListener("visibilitychange", () => {
                  "hidden" === document.visibilityState && m();
                }),
                (g = !0));
              let o = sessionStorage.getItem(u),
                a = Date.now();
              if (o)
                try {
                  let a = JSON.parse(o);
                  r = {
                    ...a,
                    executionCount: a.executionCount + 1,
                    webSearchUsedCount: a.webSearchUsedCount + +!!e,
                    totalInputTokens: a.totalInputTokens + t.input,
                    totalOutputTokens: a.totalOutputTokens + t.output,
                    totalTokens: a.totalTokens + t.total,
                  };
                } catch (o) {
                  r = {
                    sessionId: d(),
                    startTimestamp: a,
                    executionCount: 1,
                    webSearchUsedCount: +!!e,
                    totalInputTokens: t.input,
                    totalOutputTokens: t.output,
                    totalTokens: t.total,
                  };
                }
              else
                r = {
                  sessionId: d(),
                  startTimestamp: a,
                  executionCount: 1,
                  webSearchUsedCount: +!!e,
                  totalInputTokens: t.input,
                  totalOutputTokens: t.output,
                  totalTokens: t.total,
                };
              sessionStorage.setItem(u, JSON.stringify(r));
            })(a, {
              input: n,
              output: i,
              total: c,
            }),
            r || "No response generated"
          );
        } catch (t) {
          throw (
            c.analytics.track(c.EVENTS.AGENT_ERROR_AI_FORMULA_MODEL, {
              prompt: e.substring(0, 100),
              promptLength: e.length,
              model: h.ag,
              error: t instanceof Error ? t.message : String(t),
              errorType: t instanceof Error ? t.name : "unknown",
              timestamp: Date.now(),
            }),
            (0, s.gg)("AI Cell: Error executing LLM query", t),
            t
          );
        }
      };
      var f = r(44685);
      let S = new Map(),
        y = new Map(),
        w = 0,
        v = [],
        C = 0,
        b = new Set();
      function T() {
        if (w >= f.eX || 0 === v.length) return;
        let e = v.shift();
        e && E(e.cacheKey, e.context, e.apiCall);
      }
      function k(e, t) {
        let r = Number(t);
        t && !isNaN(r) && /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(t)
          ? e.setAsyncResult(r)
          : e.setAsyncResult(t);
      }
      function E(e, t, r) {
        let o = "".concat(C, "-").concat(Date.now(), "-").concat(Math.random());
        (b.add(o), w++);
        try {
          var a, n, i, l;
          let s = r(),
            c =
              ((a = f.wq),
              new Promise((e, t) => {
                setTimeout(() => {
                  t(Error("Request timed out after ".concat(a, "ms")));
                }, a);
              })),
            h = Promise.race([s, c]);
          (S.set(e, {
            promise: h,
            contexts: [t],
          }),
            t.setAsyncResult(f.Bi.PROCESSING),
            (n = h),
            (i = e),
            (l = o),
            n
              .then((e) => {
                var t;
                let r = S.get(i),
                  o = null != (t = null == r ? void 0 : r.contexts) ? t : [],
                  a = (null != e ? e : "").trim();
                (y.set(i, {
                  value: a,
                  timestamp: Date.now(),
                }),
                  S.delete(i),
                  b.has(l) && (b.delete(l), w--),
                  o.forEach((e) => {
                    e && "function" == typeof e.setAsyncResult && k(e, a);
                  }),
                  T());
              })
              .catch((e) => {
                var t, r;
                let o,
                  a = S.get(i),
                  n = null != (r = null == a ? void 0 : a.contexts) ? r : [];
                ((o = (
                  null == e || null == (t = e.message)
                    ? void 0
                    : t.includes("timed out")
                )
                  ? f.Bi.TIMEOUT
                  : /rate|quota/i.test(
                        (null == e ? void 0 : e.message) || String(e),
                      )
                    ? f.Bi.RATE_LIMIT
                    : f.Bi.ERROR),
                  n.forEach((e) => {
                    e &&
                      "function" == typeof e.setAsyncResult &&
                      e.setAsyncResult(o);
                  }),
                  S.delete(i),
                  b.has(l) && (b.delete(l), w--),
                  T());
              }));
        } catch (e) {
          (console.error("Error creating pending request:", e),
            b.delete(o),
            w--,
            t &&
              "function" == typeof t.setAsyncResult &&
              t.setAsyncResult(f.Bi.ERROR));
        }
      }
      function A(e) {
        let t = [];
        try {
          if ("toArray" in e && "function" == typeof e.toArray) t = e.toArray();
          else if (
            "count" in e &&
            "number" == typeof e.count &&
            "get" in e &&
            "function" == typeof e.get
          ) {
            t = [];
            for (let r = 0; r < e.count; r++) t.push(e.get(r));
          }
        } catch (e) {
          t = [];
        }
        return t;
      }
      function R(e) {
        try {
          if (!Array.isArray(e) || 0 === e.length)
            return "[range with 0 values: ]";
          let t = (e) => (null == e ? "" : String(e));
          if (e.length > f.eD) {
            let r = e.slice(0, f.eD).map(t);
            return "[range with "
              .concat(e.length, " values (showing first ")
              .concat(f.eD, "): ")
              .concat(r.join(", "), "...]");
          }
          let r = e.map(t);
          return "[range with "
            .concat(e.length, " values: ")
            .concat(r.join(", "), "]");
        } catch (r) {
          var t;
          return "[range with ".concat(
            null != (t = null == e ? void 0 : e.length) ? t : 0,
            " values]",
          );
        }
      }
      function x(e) {
        return (
          "object" == typeof e && null !== e && ("toArray" in e || "count" in e)
        );
      }
      class F extends a.Spread.CalcEngine.Functions.AsyncFunction {
        defaultValue() {
          return f.Bi.PROCESSING;
        }
        isArrayFunction() {
          return !1;
        }
        getArrayFunction() {
          return !1;
        }
        acceptsReference(e) {
          return !0;
        }
        evaluateAsync(e) {
          for (
            var t, r, a = arguments.length, n = Array(a > 1 ? a - 1 : 0), i = 1;
            i < a;
            i++
          )
            n[i - 1] = arguments[i];
          if (e && "function" == typeof e.setAsyncResult)
            try {
              o.f.getState().setHasAIFormulas(!0);
              let a = (function (e) {
                try {
                  if (!e || 0 === e.length) return "";
                  return e
                    .map((e) => {
                      try {
                        if (!x(e))
                          return (function e(t) {
                            if (null == t) return "";
                            if (Array.isArray(t))
                              return t.map((t) => e(t)).join(" ");
                            if (
                              "object" == typeof t &&
                              null !== t &&
                              ("toArray" in t || "count" in t)
                            ) {
                              let r = A(t);
                              if (r.length > 0) return R(r.map((t) => e(t)));
                            }
                            return String(t);
                          })(e);
                        {
                          let t = A(e);
                          return R(t);
                        }
                      } catch (t) {
                        return (
                          console.warn("Error processing argument:", e, t),
                          ""
                        );
                      }
                    })
                    .filter((e) => e && e.trim())
                    .map((e) => e.trim())
                    .join(" ")
                    .trim();
                } catch (e) {
                  return (console.error("Error building prompt:", e), "");
                }
              })(n);
              if (!a) return void e.setAsyncResult(f.Bi.MISSING_PROMPT);
              let i = (function (e) {
                  try {
                    if (!e || !Array.isArray(e)) return 0;
                    return e.filter(x).length;
                  } catch (e) {
                    return (console.warn("Error counting ranges:", e), 0);
                  }
                })(n),
                l =
                  a.length > f.Xb
                    ? {
                        isValid: !1,
                        error: "Prompt too long ("
                          .concat(a.length, " chars). Max: ")
                          .concat(f.Xb),
                      }
                    : i > f.fS
                      ? {
                          isValid: !1,
                          error: "Too many ranges ("
                            .concat(i, "). Max: ")
                            .concat(f.fS),
                        }
                      : {
                          isValid: !0,
                        };
              if (!l.isValid)
                return void ((
                  null == (t = l.error)
                    ? void 0
                    : t.includes(f.NH.PROMPT_TOO_LONG)
                )
                  ? e.setAsyncResult(f.Bi.INPUT_TOO_LARGE)
                  : (
                        null == (r = l.error)
                          ? void 0
                          : r.includes(f.NH.TOO_MANY_RANGES)
                      )
                    ? e.setAsyncResult(f.Bi.TOO_MANY_RANGES)
                    : e.setAsyncResult(f.Bi.ERROR));
              if (
                (function (e, t) {
                  try {
                    if (!t || "function" != typeof t.setAsyncResult)
                      return (
                        console.warn("Invalid context in checkCachedResult"),
                        !1
                      );
                    let r = y.get(e);
                    if (r) return (k(t, r.value), !0);
                    return !1;
                  } catch (e) {
                    return (
                      console.error("Error checking cached result:", e),
                      !1
                    );
                  }
                })(a, e) ||
                (function (e, t) {
                  try {
                    if (!t || "function" != typeof t.setAsyncResult)
                      return (
                        console.warn("Invalid context in joinPendingRequest"),
                        !1
                      );
                    let r = S.get(e);
                    if (r)
                      return (
                        r.contexts.push(t),
                        t.setAsyncResult(f.Bi.PROCESSING),
                        !0
                      );
                    return !1;
                  } catch (e) {
                    return (
                      console.error("Error joining pending request:", e),
                      !1
                    );
                  }
                })(a, e)
              )
                return;
              !(function (e, t, r) {
                try {
                  if (!t || "function" != typeof t.setAsyncResult)
                    return void console.warn(
                      "Invalid context in createPendingRequest",
                    );
                  if (w >= f.eX) {
                    (v.push({
                      cacheKey: e,
                      context: t,
                      apiCall: r,
                    }),
                      t.setAsyncResult(f.Bi.PROCESSING));
                    return;
                  }
                  E(e, t, r);
                } catch (e) {
                  (console.error("Error creating pending request:", e),
                    t &&
                      "function" == typeof t.setAsyncResult &&
                      t.setAsyncResult(f.Bi.ERROR));
                }
              })(a, e, () => p(a));
            } catch (t) {
              (console.error("AI function evaluation error:", t),
                e.setAsyncResult(f.Bi.ERROR));
            }
        }
        constructor() {
          super("AI", 1, 255, {
            description: f.I$,
            parameters: f.Iw,
          });
        }
      }
      function N(e) {
        try {
          let t = new F();
          (e.addCustomFunction(t),
            e.__AI_REGISTERED ||
              (S.clear(),
              y.clear(),
              (w = 0),
              (v.length = 0),
              C++,
              b.clear(),
              (e.__AI_REGISTERED = !0)));
        } catch (e) {
          console.error("Failed to register AI custom function:", e);
        }
      }
    },
    25323: (e, t, r) => {
      r.d(t, {
        BE: () => a,
        BM: () => s,
        LU: () => l,
        nS: () => h,
        v7: () => c,
      });
      var o = r(14377);
      function a(e) {
        if ("number" == typeof e)
          return Number.isInteger(e) && e >= 1900 && e <= 2100;
        if ("string" == typeof e) {
          let t = parseInt(e, 10);
          return !isNaN(t) && String(t) === e.trim() && t >= 1900 && t <= 2100;
        }
        return !1;
      }
      let n = "([\\s'''']?\\d{2,4})?",
        i = [
          RegExp(
            "^"
              .concat(
                "(january|february|march|april|may|june|july|august|september|october|november|december)",
              )
              .concat(n, "$"),
            "i",
          ),
          RegExp(
            "^"
              .concat(
                "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)",
                "\\.?",
              )
              .concat(n, "$"),
            "i",
          ),
          /^Q[1-4]([\s'''']?\d{2,4})?$/i,
        ];
      function l(e) {
        if (null == e) return !1;
        let t = String(e).trim();
        return i.some((e) => e.test(t));
      }
      function s(e, t, r, a, n, i, l, s) {
        if (e <= 0 || i <= 0 || !n) return null;
        let c = [];
        for (let u = 0; u < e; u++) {
          let e = [],
            d = 0;
          for (let l = r - 1; l >= a; l--) {
            var h;
            let r = null == (h = n[u]) ? void 0 : h[l - a];
            if (null == r || "" === r || (0, o.p)(r)) continue;
            let c = "".concat((0, o.dE)(l)).concat(t + u + 1),
              { text: g, indent: m } = s(t + u, l);
            if (
              (e.push({
                col: l,
                text: g,
                indent: m,
                addr: c,
              }),
              ++d >= Math.max(1, 0 | i))
            )
              break;
          }
          if (0 === e.length) {
            c.push("");
            continue;
          }
          e.sort((e, t) => e.col - t.col);
          let g = e.map((e) =>
            ""
              .concat(l.repeat(Math.max(0, e.indent)))
              .concat(e.addr, ":")
              .concat(e.text),
          );
          c.push(g.join(" | "));
        }
        return c;
      }
      function c(e, t, r, a, n, i, l) {
        let s = new Map(),
          c = Math.max(t, r - n + 1);
        for (let t = r; t >= c; t--) {
          let r = null,
            n = 0;
          for (let l = e - 1; l >= 0 && n < a; l--) {
            n++;
            let e = i(l, t);
            if (null != e && "" !== e && !(0, o.p)(e)) {
              r = l;
              break;
            }
          }
          null != r && s.set(r, (s.get(r) || 0) + 1);
        }
        if (0 === s.size) return null;
        let h = -1,
          u = -1;
        for (let [e, t] of s.entries())
          t > u ? ((u = t), (h = e)) : t === u && l && l(e) > l(h) && (h = e);
        return h >= 0 ? h : null;
      }
      function h(e, t, r, a, n) {
        let i = [],
          l = !1;
        for (let s = t; s <= r; s++) {
          let t = a(e, s);
          if (null == t || "" === t) continue;
          if ((0, o.p)(t)) {
            l = !0;
            continue;
          }
          let r = "".concat((0, o.dE)(s)).concat(e + 1),
            c = n(e, s);
          (i.length > 0 && l && i.push("..."),
            i.push("".concat(r, ":").concat(c)),
            (l = !1));
        }
        return i.length > 0 ? i.join(" | ") : null;
      }
    },
    33335: (e, t, r) => {
      r.d(t, {
        default: () => f,
      });
      var o = r(77240),
        a = r(65903),
        n = r(16994),
        i = r(76607),
        l = r(13694),
        s = r(41476),
        c = r(18689),
        h = r(34918),
        u = r(13947),
        d = r(44948);
      function g(e) {
        let { error: t, resetErrorBoundary: r, stateResetCallback: a } = e;
        return (
          (0, d.useEffect)(() => {
            n.vF.error("App error boundary triggered:", t);
          }, [t]),
          (0, o.jsx)("div", {
            className:
              "flex h-screen w-full items-center justify-center bg-[#F5F0E8] p-4",
            children: (0, o.jsxs)(s.Zp, {
              className:
                "w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg",
              children: [
                (0, o.jsxs)(s.aR, {
                  className: "pt-8 pb-6 text-center",
                  children: [
                    (0, o.jsx)("div", {
                      className:
                        "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100",
                      children: (0, o.jsx)(c.A, {
                        className: "h-6 w-6 text-amber-600",
                      }),
                    }),
                    (0, o.jsx)(s.ZB, {
                      className: "text-lg font-semibold text-gray-900",
                      children: "App encountered an error",
                    }),
                    (0, o.jsx)(s.BT, {
                      className: "text-gray-600",
                      children:
                        "The add-in hit a snag, but we can get you back on track.",
                    }),
                  ],
                }),
                (0, o.jsxs)(s.Wu, {
                  className: "space-y-4 pb-8",
                  children: [
                    (0, o.jsxs)("div", {
                      className: "space-y-3",
                      children: [
                        (0, o.jsxs)(l.$, {
                          onClick: () => {
                            (a(), r());
                          },
                          className:
                            "w-full bg-green-600 text-white hover:bg-green-700",
                          children: [
                            (0, o.jsx)(h.A, {
                              className: "mr-2 h-4 w-4",
                            }),
                            "Try again",
                          ],
                        }),
                        (0, o.jsxs)(l.$, {
                          onClick: () => {
                            try {
                              (localStorage.removeItem("thread-store"),
                                localStorage.removeItem("user-store"));
                            } catch (e) {
                              n.vF.error("Error clearing localStorage:", e);
                            }
                            r();
                          },
                          variant: "outline",
                          className: "w-full",
                          children: [
                            (0, o.jsx)(u.A, {
                              className: "mr-2 h-4 w-4",
                            }),
                            "Start fresh",
                          ],
                        }),
                      ],
                    }),
                    !1,
                  ],
                }),
              ],
            }),
          })
        );
      }
      function m(e) {
        let { error: t, resetErrorBoundary: r, stateResetCallback: a } = e;
        return (0, o.jsx)("div", {
          className:
            "flex min-h-[400px] w-full items-center justify-center border-2 border-red-500 bg-red-100 p-4",
          children: (0, o.jsxs)("div", {
            className: "max-w-md text-center",
            children: [
              (0, o.jsx)("div", {
                className:
                  "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100",
                children: (0, o.jsx)(c.A, {
                  className: "h-5 w-5 text-gray-600",
                }),
              }),
              (0, o.jsx)("h3", {
                className: "text-lg font-semibold text-gray-900",
                children: "Something went wrong",
              }),
              (0, o.jsx)("p", {
                className: "mt-2 text-sm text-gray-600",
                children:
                  "This component encountered an error and couldn't render properly.",
              }),
              (0, o.jsx)(l.$, {
                onClick: () => {
                  (a(), r());
                },
                variant: "outline",
                size: "sm",
                className: "mt-4",
                children: "Try again",
              }),
              !1,
            ],
          }),
        });
      }
      function p(e) {
        let { error: t, resetErrorBoundary: r, stateResetCallback: i } = e;
        return (0, o.jsx)("div", {
          className:
            "flex min-h-screen items-center justify-center bg-[#F5F0E8] p-4",
          children: (0, o.jsxs)(s.Zp, {
            className:
              "w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg",
            children: [
              (0, o.jsxs)(s.aR, {
                className: "pt-8 pb-6 text-center",
                children: [
                  (0, o.jsx)("div", {
                    className:
                      "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100",
                    children: (0, o.jsx)(c.A, {
                      className: "h-8 w-8 text-red-600",
                    }),
                  }),
                  (0, o.jsx)(s.ZB, {
                    className: "text-xl font-semibold text-gray-900",
                    children: "Oops! The add-in ran into a problem",
                  }),
                  (0, o.jsx)(s.BT, {
                    className: "text-gray-600",
                    children:
                      "Don't worry - we can help you get back on track safely.",
                  }),
                ],
              }),
              (0, o.jsxs)(s.Wu, {
                className: "space-y-4 pb-8",
                children: [
                  (0, o.jsx)("div", {
                    className: "space-y-3",
                    children: (0, o.jsxs)(l.$, {
                      onClick: () => {
                        try {
                          a.analytics.track(
                            a.EVENTS.CLIENT_ERROR_RETRY_CLICKED,
                            {},
                          );
                        } catch (e) {
                          n.vF.error(
                            "Error capturing error page retry clicked:",
                            e,
                          );
                        }
                        (i(), r());
                      },
                      variant: "outline",
                      className: "w-full",
                      children: [
                        (0, o.jsx)(h.A, {
                          className: "mr-2 h-4 w-4",
                        }),
                        "Try again",
                      ],
                    }),
                  }),
                  !1,
                ],
              }),
            ],
          }),
        });
      }
      function f(e) {
        let {
          children: t,
          errorBoundaryType: r,
          stateResetCallback: l = () => {},
        } = e;
        return (0, o.jsx)(i.tH, {
          fallbackRender: (() => {
            switch (r) {
              case "root":
                let e = (e) => {
                  let { error: t, resetErrorBoundary: r } = e;
                  return (0, o.jsx)(p, {
                    error: t,
                    resetErrorBoundary: r,
                    stateResetCallback: l,
                  });
                };
                return ((e.displayName = "RootFallbackWrapper"), e);
              case "app":
                let t = (e) => {
                  let { error: t, resetErrorBoundary: r } = e;
                  return (0, o.jsx)(g, {
                    error: t,
                    resetErrorBoundary: r,
                    stateResetCallback: l,
                  });
                };
                return ((t.displayName = "AppFallbackWrapper"), t);
              default:
                let a = (e) => {
                  let { error: t, resetErrorBoundary: r } = e;
                  return (0, o.jsx)(m, {
                    error: t,
                    resetErrorBoundary: r,
                    stateResetCallback: l,
                  });
                };
                return ((a.displayName = "ComponentFallbackWrapper"), a);
            }
          })(),
          onError: (e, t) => {
            n.vF.error("".concat(r, " error boundary caught error:"), e, t);
            try {
              let o =
                {
                  root: a.EVENTS.CLIENT_ERROR_BOUNDARY_ROOT,
                  app: a.EVENTS.CLIENT_ERROR_BOUNDARY_APP,
                  component: a.EVENTS.CLIENT_ERROR_BOUNDARY_COMPONENT,
                }[r] || a.EVENTS.CLIENT_ERROR_BOUNDARY_COMPONENT;
              a.analytics.trackError(e, {
                event: o,
                error_message: e.message,
                error_stack: e.stack,
                error_boundary: r,
                component_stack: t.componentStack || "",
                timestamp: new Date().toISOString(),
              });
            } catch (e) {
              n.vF.error("Failed to track error in PostHog:", e);
            }
          },
          children: t,
        });
      }
    },
    35033: (e, t, r) => {
      r.d(t, {
        iM: () => l,
        vS: () => o,
        y7: () => i,
      });
      var o = (function (e) {
        return (
          (e.CHAT_INPUT = "chat_input"),
          (e.AGENT_MODE_SELECTOR = "agent_mode_selector"),
          (e.PROMPT_LIBRARY = "prompt_library"),
          (e.FILE_UPLOAD = "file_upload"),
          (e.SHARE = "share"),
          (e.FORMULA_TRACING = "formula_tracing"),
          (e.AI_PREFERENCES = "ai_preferences"),
          (e.MULTI_CONVERSATION = "multi_conversation"),
          (e.TUTORIAL = "tutorial"),
          (e.SETTINGS_PERMISSION = "settings_permission"),
          (e.SETTINGS_TEAM = "settings_team"),
          (e.PRICING_MODAL = "pricing_modal"),
          (e.NEW_FILE_TEMPLATES = "new_file_templates"),
          (e.SETTINGS_AI_RULES = "settings_ai_rules"),
          (e.TEAM_SHARED_RESOURCES = "team_shared_resources"),
          e
        );
      })({});
      let a = new Set([
          "chat_input",
          "agent_mode_selector",
          "prompt_library",
          "file_upload",
          "share",
          "ai_preferences",
          "formula_tracing",
          "multi_conversation",
          "tutorial",
        ]),
        n = {
          chat_input: "chat-input",
          agent_mode_selector: "action-ask-mode",
          prompt_library: "prompt-library",
          file_upload: "file-upload",
          share: "share",
          ai_preferences: "ai-preferences",
          formula_tracing: "formula-tracing",
          multi_conversation: "multi-conversation",
          tutorial: "tutorial",
        };
      function i(e) {
        return a.has(e);
      }
      function l(e) {
        return n[e];
      }
    },
    39924: (e, t, r) => {
      function o() {
        return window.location.origin;
      }
      (r.d(t, {
        $: () => o,
      }),
        r(77434));
    },
    41476: (e, t, r) => {
      r.d(t, {
        BT: () => s,
        Wu: () => c,
        ZB: () => l,
        Zp: () => n,
        aR: () => i,
      });
      var o = r(77240);
      r(44948);
      var a = r(36473);
      function n(e) {
        let { className: t, ...r } = e;
        return (0, o.jsx)("div", {
          "data-slot": "card",
          className: (0, a.cn)(
            "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
            t,
          ),
          ...r,
        });
      }
      function i(e) {
        let { className: t, ...r } = e;
        return (0, o.jsx)("div", {
          "data-slot": "card-header",
          className: (0, a.cn)("flex flex-col gap-1.5 px-6", t),
          ...r,
        });
      }
      function l(e) {
        let { className: t, ...r } = e;
        return (0, o.jsx)("div", {
          "data-slot": "card-title",
          className: (0, a.cn)("leading-none font-semibold", t),
          ...r,
        });
      }
      function s(e) {
        let { className: t, ...r } = e;
        return (0, o.jsx)("div", {
          "data-slot": "card-description",
          className: (0, a.cn)("text-muted-foreground text-sm", t),
          ...r,
        });
      }
      function c(e) {
        let { className: t, ...r } = e;
        return (0, o.jsx)("div", {
          "data-slot": "card-content",
          className: (0, a.cn)("px-6", t),
          ...r,
        });
      }
    },
    44685: (e, t, r) => {
      r.d(t, {
        Bi: () => o,
        I$: () => h,
        Iw: () => u,
        NH: () => a,
        Xb: () => n,
        eD: () => i,
        eX: () => s,
        fS: () => l,
        wq: () => c,
      });
      var o = (function (e) {
          return (
            (e.PROCESSING = "AI processing..."),
            (e.MISSING_PROMPT = "#AI_PROMPT?"),
            (e.RATE_LIMIT = "#AI_RATE_LIMIT"),
            (e.ERROR = "#AI_ERROR"),
            (e.INPUT_TOO_LARGE = "#AI_INPUT_TOO_LARGE"),
            (e.TOO_MANY_RANGES = "#AI_TOO_MANY_RANGES"),
            (e.TIMEOUT = "#AI_TIMEOUT"),
            e
          );
        })({}),
        a = (function (e) {
          return (
            (e.PROMPT_TOO_LONG = "Prompt too long"),
            (e.TOO_MANY_RANGES = "Too many ranges"),
            e
          );
        })({});
      let n = 1e4,
        i = 1e3,
        l = 100,
        s = 50,
        c = 9e4,
        h = 'Process a prompt with AI. Ex: =AI("Summarize", A5)',
        u = [
          {
            name: "prompt",
            repeatable: !1,
            optional: !1,
            description: "The question or instruction for the AI (required)",
          },
          {
            name: "data",
            repeatable: !0,
            optional: !0,
            description:
              "Optional cell ranges, text, or numbers for the AI to analyze",
          },
        ];
    },
    46462: (e, t, r) => {
      r.d(t, {
        HF: () => g,
        Sr: () => h,
        i5: () => d,
      });
      var o = r(23657),
        a = r(88100),
        n = r(37944),
        i = r(58788);
      async function l(e, t, r, a, i, l) {
        try {
          var s;
          let a = r.platformType
              ? {
                  ...t,
                  platformType: r.platformType,
                }
              : t,
            c = await (0, n.authenticatedFetch)(
              "".concat(r.apiBaseUrl).concat(e),
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(a),
              },
            );
          if (!c.ok) {
            let t = await c.json().catch(() => ({
              error: "Unknown error",
            }));
            return (
              o.XU.error("llm_request_failed", {
                endpoint: e,
                status_code: c.status,
                error: t,
                user_id: t.userId,
              }),
              l
            );
          }
          let h = await c.json();
          return (null == (s = r.onSuccess) || s.call(r), i(h));
        } catch (t) {
          return (
            o.XU.error("llm_request_failed", {
              endpoint: e,
              errorMessage: t instanceof Error ? t.message : String(t),
              errorName: t instanceof Error ? t.name : "Unknown",
            }),
            l
          );
        }
      }
      async function s(e, t) {
        return l(
          "/api/proxy/sentiment-analyze",
          e,
          t,
          "[Sentiment]",
          (e) => e.sentiment || "neutral",
          "neutral",
        );
      }
      async function c(e, t) {
        return l(
          "/api/proxy/summarize",
          {
            text: e,
          },
          t,
          "[Summarize]",
          (e) => e.summary || null,
          null,
        );
      }
      async function h(e, t) {
        return l(
          "/api/proxy/ai-formula",
          {
            prompt: e,
          },
          t,
          "[AIFormula]",
          (e) => ({
            text: e.text || "No response generated",
            metadata: e.metadata || {
              webSearchUsed: !1,
              inputTokens: 0,
              outputTokens: 0,
              totalTokens: 0,
            },
          }),
          null,
        );
      }
      async function u(e, t) {
        return l(
          "/api/proxy/file-naming",
          {
            userQuery: e,
          },
          t,
          "[FileNaming]",
          (e) => e.fileName || null,
          null,
        );
      }
      function d(e) {
        return {
          apiBaseUrl: e,
          auth: {
            includeCredentials: !0,
          },
          platformType: a.TT.WEB,
        };
      }
      function g(e) {
        ((0, i.OS)((t) => s(t, e)),
          (0, i.i)((t) => c(t, e)),
          (0, i.pe)((t) => h(t, e)),
          (0, i.zN)((t) => u(t, e)),
          console.log(
            "[LLMService] Initialized with authenticatedFetch (automatic token management)",
          ));
      }
    },
    48701: (e, t, r) => {
      r.d(t, {
        Le: () => n,
        nM: () => i,
        pd: () => a,
      });
      let o = null;
      function a(e) {
        o = e;
      }
      function n() {
        if (!o)
          throw Error(
            "FeedbackService not initialized. Make sure to call setFeedbackService() during platform initialization.",
          );
        return o;
      }
      function i() {
        return null !== o;
      }
    },
    59858: (e, t, r) => {
      r.d(t, {
        m: () => o,
      });
      let o = {
        accountType: "free",
        featureUsage: {
          ai_rules: !1,
          saved_prompts: !1,
          templates: !1,
        },
        teamResources: {
          has_team_templates: !1,
          has_team_ai_rules: !1,
        },
        unlockedAchievements: [],
      };
    },
    59981: (e, t, r) => {
      r.d(t, {
        SX: () => i,
        d5: () => a,
        lp: () => n,
      });
      var o = r(37944);
      async function a(e) {
        let t = await (0, o.authenticatedFetch)("/api/createPresignedUrl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(e),
        });
        if (!t.ok)
          throw Error((await t.json()).error || "Failed to get upload URL");
        return await t.json();
      }
      async function n(e, t, r) {
        let o = await fetch(t, {
          method: "PUT",
          body: e,
          headers: {
            "Content-Type": e.type,
            ...(r && {
              Authorization: "Bearer ".concat(r),
            }),
          },
        });
        if (!o.ok)
          throw Error(
            "Upload failed: ".concat(o.status, " ").concat(o.statusText),
          );
      }
      async function i(e) {
        let t = await (0, o.authenticatedFetch)("/api/files/signed-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(e),
        });
        if (!t.ok)
          throw Error((await t.json()).error || "Failed to create signed URL");
        return await t.json();
      }
    },
    67120: (e, t, r) => {
      r.d(t, {
        L: () => l,
      });
      class o {
        register(e) {
          if (this.sources.size >= this.maxAttachments)
            throw Error(
              "Maximum of ".concat(this.maxAttachments, " attachments allowed"),
            );
          let t = this.generateId(e.name),
            r = {
              id: t,
              filename: e.name,
              sizeMB: this.formatSizeMB(e.size),
            };
          return (this.sources.set(t, e), this.metadataMap.set(t, r), t);
        }
        async select(e) {
          let t = this.sources.get(e);
          if (!t) throw Error("Attachment not found: ".concat(e));
          if (this.activeId === e && this.activeWorkbook) return;
          let r = ++this.loadGeneration,
            o = await this.loadWorkbook(t);
          if (r !== this.loadGeneration) {
            o && this.disposeWorkbook(o);
            return;
          }
          if (!o) throw Error("Failed to load workbook: ".concat(t.name));
          (this.disposeActive(),
            (this.activeId = e),
            (this.activeWorkbook = o));
        }
        list() {
          return Array.from(this.metadataMap.values());
        }
        get workbook() {
          return this.activeWorkbook;
        }
        get activeAttachmentId() {
          return this.activeId;
        }
        getActiveMetadata() {
          var e;
          return this.activeId &&
            null != (e = this.metadataMap.get(this.activeId))
            ? e
            : null;
        }
        hasAttachments() {
          return this.sources.size > 0;
        }
        findIdByFilename(e) {
          for (let [t, r] of this.metadataMap) if (r.filename === e) return t;
          return null;
        }
        unregister(e) {
          return (
            !!this.sources.has(e) &&
            (this.activeId === e && this.disposeActive(),
            this.sources.delete(e),
            this.metadataMap.delete(e),
            !0)
          );
        }
        unregisterByFilename(e) {
          let t = this.findIdByFilename(e);
          return !!t && this.unregister(t);
        }
        disposeAll() {
          (this.disposeActive(),
            this.sources.clear(),
            this.metadataMap.clear());
        }
        disposeActive() {
          this.activeWorkbook &&
            (this.disposeWorkbook(this.activeWorkbook),
            (this.activeWorkbook = null),
            (this.activeId = null));
        }
        generateId(e) {
          let t =
              e
                .replace(/\.[^/.]+$/, "")
                .normalize("NFC")
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(RegExp("[^\\p{L}\\p{N}_-]", "gu"), "")
                .replace(/[_-]+/g, "_")
                .replace(/^[_-]+|[_-]+$/g, "") || "attachment",
            r = t,
            o = 1;
          for (; this.sources.has(r); )
            ((r = "".concat(t, "_").concat(o)), o++);
          return r;
        }
        formatSizeMB(e) {
          let t = e / 1048576;
          return t < 0.1 ? "< 0.1 MB" : "".concat(t.toFixed(1), " MB");
        }
        constructor(e, t, r = {}) {
          var o;
          ((this.loadWorkbook = e),
            (this.disposeWorkbook = t),
            (this.sources = new Map()),
            (this.metadataMap = new Map()),
            (this.activeId = null),
            (this.activeWorkbook = null),
            (this.loadGeneration = 0),
            (this.maxAttachments = null != (o = r.maxAttachments) ? o : 10));
        }
      }
      var a = r(7922),
        n = r(90242),
        i = r(60395);
      let l = new o(
        async function e(e) {
          try {
            let t = new i.Spread.Sheets.Workbook(),
              r = new a.zu(t, e.name),
              o = (function (e) {
                let t = e.lastIndexOf(".");
                return (t >= 0 ? e.slice(t).toLowerCase() : "") === ".csv"
                  ? i.Spread.Sheets.FileType.csv
                  : i.Spread.Sheets.FileType.excel;
              })(e.name);
            return new Promise((a) => {
              t.import(
                e,
                () => {
                  ((0, n.gg)("Successfully loaded attached workbook:", e.name),
                    r.makeAllSheetsFullSize(),
                    a(r));
                },
                (e) => {
                  ((0, n.gg)("Error loading attached workbook:", e),
                    t.destroy(),
                    a(null));
                },
                {
                  fileType: o,
                },
              );
            });
          } catch (e) {
            return ((0, n.gg)("Error creating attached workbook:", e), null);
          }
        },
        function (e) {
          try {
            (e.originalWorkbook.clearSheets(),
              e.originalWorkbook.destroy(),
              (0, n.gg)("Disposed attached workbook"));
          } catch (e) {
            (0, n.gg)("Error disposing attached workbook:", e);
          }
        },
      );
    },
    70062: (e, t, r) => {
      r.d(t, {
        n: () => m,
        p: () => g,
      });
      var o = r(44948),
        a = r(62706),
        n = r(11420),
        i = r(59858),
        l = r(37944),
        s = r(36473),
        c = r(16994),
        h = r(10687);
      let u = {
        accountType: null,
        unlockedAchievements: [],
        isInitialized: !1,
        isLoading: !1,
        error: null,
      };
      function d(e) {
        return e.is_team_user
          ? e.is_team_admin
            ? "team_admin"
            : "team_member"
          : e.is_subscription_active
            ? "pro"
            : "free";
      }
      let g = (0, a.v)()((e, t) => ({
        ...u,
        initialize: async () => {
          let r = t();
          if (!r.isInitialized && !r.isLoading) {
            e({
              isLoading: !0,
              error: null,
            });
            try {
              let [t, r] = await Promise.all([p(), f()]),
                o = t ? d(t) : "free",
                a = null != r ? r : [];
              (e({
                accountType: o,
                unlockedAchievements: a,
                isInitialized: !0,
                isLoading: !1,
              }),
                c.w4.debug("[ProTipStore] Initialized:", {
                  accountType: o,
                  achievements: a,
                }));
            } catch (r) {
              let t = r instanceof Error ? r.message : "Failed to initialize";
              (console.error("[ProTipStore] Initialization error:", r),
                e({
                  error: t,
                  isLoading: !1,
                  isInitialized: !0,
                }));
            }
          }
        },
        refresh: async () => {
          e({
            isLoading: !0,
            error: null,
          });
          try {
            let [t, r] = await Promise.all([p(), f()]),
              o = t ? d(t) : "free",
              a = null != r ? r : [];
            (e({
              accountType: o,
              unlockedAchievements: a,
              isLoading: !1,
            }),
              c.w4.debug("[ProTipStore] Refreshed:", {
                accountType: o,
                achievements: a,
              }));
          } catch (r) {
            let t = r instanceof Error ? r.message : "Failed to refresh";
            (console.error("[ProTipStore] Refresh error:", r),
              e({
                error: t,
                isLoading: !1,
              }));
          }
        },
        reset: () => {
          e(u);
        },
      }));
      function m() {
        let e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          t = g((e) => e.accountType),
          r = g((e) => e.unlockedAchievements),
          a = (0, h.useUserStore)((e) => e.hasSetPreferences),
          l = (0, h.useUserStore)((e) => e.prompts),
          s = (0, h.useUserStore)((e) => e.aiRules),
          {
            hasTeamTemplates: c = !1,
            hasTeamAiRules: u = !1,
            hasTemplates: d = !1,
          } = e;
        return (0, o.useMemo)(() => {
          let e = {
            accountType: null != t ? t : i.m.accountType,
            featureUsage: {
              ai_rules: a || s.length > 0,
              saved_prompts: l.length > 0,
              templates: d,
            },
            teamResources: {
              has_team_templates: c,
              has_team_ai_rules: u,
            },
            unlockedAchievements: null != r ? r : i.m.unlockedAchievements,
          };
          return (0, n.S6)(e);
        }, [t, a, s, l, r, c, u, d]);
      }
      async function p() {
        try {
          let e = await (0, l.authenticatedFetch)(
            "".concat(s.Pu, "/api/user/me"),
          );
          if (!e.ok) {
            if (401 === e.status) return null;
            throw Error("Failed to fetch user: ".concat(e.statusText));
          }
          return await e.json();
        } catch (e) {
          return (
            console.error("[ProTipStore] Failed to fetch user data:", e),
            null
          );
        }
      }
      async function f() {
        try {
          var e;
          let t = await (0, l.authenticatedFetch)(
            "".concat(s.Pu, "/api/achievements/user"),
          );
          if (!t.ok) {
            if (401 === t.status) return null;
            throw Error("Failed to fetch achievements: ".concat(t.statusText));
          }
          return (null != (e = (await t.json()).achievements) ? e : [])
            .map((e) => {
              var t;
              return null == (t = e.achievement) ? void 0 : t.key;
            })
            .filter(Boolean);
        } catch (e) {
          return (
            console.error("[ProTipStore] Failed to fetch achievements:", e),
            null
          );
        }
      }
    },
    76720: (e, t, r) => {
      r.d(t, {
        OZ: () => c,
        iY: () => l,
        n_: () => h,
      });
      var o = r(90242),
        a = r(97871),
        n = r(77313),
        i = r(34602);
      async function l(e) {
        try {
          let t = n.f.getState(),
            r = i.useThreadStore.getState(),
            l = a.x.getState(),
            c = t.workbook;
          if (!c) return ((0, o.gg)("[dev-snapshot] No workbook found"), null);
          let h = r.getActiveTab(),
            u = null == h ? void 0 : h.threadId;
          if (!u) return ((0, o.gg)("[dev-snapshot] No active thread"), null);
          let d = (await l.getActiveFileName()) || "unknown.xlsx",
            g = await s(e, u),
            m = JSON.stringify(c.originalWorkbook.toJSON()),
            p = {
              version: "dev-v1",
              timestamp: new Date().toISOString(),
              platform: "web",
              workbookJson: m,
              fileName: d,
              threadId: u,
              messages: g,
              threadMetadata: h
                ? {
                    agentMode: h.agentMode,
                    selectedModel: h.selectedModel,
                  }
                : void 0,
            };
          return (
            (0, o.gg)("[dev-snapshot] Snapshot captured:", {
              fileName: d,
              threadId: u,
              messageCount: g.length,
              workbookJsonSize: m.length,
            }),
            p
          );
        } catch (e) {
          return (
            console.error("[dev-snapshot] Failed to capture snapshot:", e),
            null
          );
        }
      }
      async function s(e, t) {
        try {
          let r = await e.threads.getHistory(t, {
            limit: 1,
          });
          if (!r || 0 === r.length)
            return (
              (0, o.gg)("[dev-snapshot] No history found for thread:", t),
              []
            );
          let a = r[0],
            n = null == a ? void 0 : a.values,
            i = null == n ? void 0 : n.messages;
          if (!i || !Array.isArray(i))
            return (
              (0, o.gg)("[dev-snapshot] No messages found in thread history"),
              []
            );
          return i;
        } catch (e) {
          return (
            console.error("[dev-snapshot] Error fetching thread messages:", e),
            []
          );
        }
      }
      function c(e) {
        let t =
            "data:application/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(e, null, 2)),
          r = e.fileName.replace(/[^a-zA-Z0-9.-]/g, "_"),
          a = e.timestamp.replace(/[:.]/g, "-"),
          n = "dev-snapshot-".concat(r, "-").concat(a, ".json"),
          i = document.createElement("a");
        (i.setAttribute("href", t),
          i.setAttribute("download", n),
          i.click(),
          (0, o.gg)("[dev-snapshot] Exported snapshot to:", n));
      }
      async function h(e) {
        try {
          let t,
            r = await e.text(),
            a = JSON.parse(r);
          if ("dev-v1" === a.version)
            ((t = a),
              (0, o.gg)("[dev-snapshot] Loading direct DevSnapshot format"));
          else {
            if (!a.devSnapshot || "dev-v1" !== a.devSnapshot.version)
              return (
                console.error(
                  '[dev-snapshot] Unknown snapshot format. Expected version "dev-v1" at root or in devSnapshot field.',
                ),
                console.error("[dev-snapshot] Found keys:", Object.keys(a)),
                null
              );
            ((t = a.devSnapshot),
              (0, o.gg)(
                "[dev-snapshot] Loading from FeedbackUploadData wrapper",
              ));
          }
          if (!t.workbookJson || !t.messages)
            return (
              console.error(
                "[dev-snapshot] Invalid snapshot structure - missing workbookJson or messages",
              ),
              null
            );
          return (
            (0, o.gg)("[dev-snapshot] Imported snapshot:", {
              fileName: t.fileName,
              messageCount: t.messages.length,
              timestamp: t.timestamp,
            }),
            t
          );
        } catch (e) {
          return (
            console.error("[dev-snapshot] Failed to import snapshot:", e),
            null
          );
        }
      }
    },
    77313: (e, t, r) => {
      r.d(t, {
        f: () => l,
      });
      var o = r(67120),
        a = r(7922),
        n = r(90242),
        i = r(60395);
      let l = (0, r(62706).v)()((e, t) => ({
        workbook: null,
        hasAIFormulas: !1,
        dirtyCellsRevision: 0,
        isFileLoaded: !1,
        setWorkbook: (t, r) => {
          if (((0, n.gg)("Setting workbook", t, r), !t))
            return void console.error("No workbook found");
          let o = new a.zu(t, r);
          return (
            e({
              workbook: o,
            }),
            o
          );
        },
        clearWorkbook: () => {
          ((0, n.gg)("Clearing workbook"),
            o.L.disposeAll(),
            e({
              workbook: null,
            }));
        },
        setHasAIFormulas: (r) => {
          t().hasAIFormulas !== r &&
            e({
              hasAIFormulas: r,
            });
        },
        bumpDirtyCellsRevision: () =>
          e((e) => ({
            dirtyCellsRevision: e.dirtyCellsRevision + 1,
          })),
        setIsFileLoaded: (t) => {
          e({
            isFileLoaded: t,
          });
        },
        focusCell: (e, r) => {
          var o;
          let a = t().workbook;
          if (!a) return;
          let n = null == (o = a.getSheet(0)) ? void 0 : o.originalSheet;
          n &&
            (n.setActiveCell(e, r),
            n.showCell(
              e,
              r,
              i.Spread.Sheets.VerticalPosition.center,
              i.Spread.Sheets.HorizontalPosition.center,
            ));
        },
        focusCells: (e, r) => {
          var o;
          let a = t().workbook;
          if (!a) return;
          let n = null == (o = a.getSheet(0)) ? void 0 : o.originalSheet;
          n &&
            (n.setActiveCell(e[0], r[0]),
            n.showCell(
              e[0],
              r[0],
              i.Spread.Sheets.VerticalPosition.center,
              i.Spread.Sheets.HorizontalPosition.center,
            ));
        },
      }));
    },
    77614: (e, t, r) => {
      r.d(t, {
        Bs: () => a,
        FO: () => n,
        GT: () => l,
        OA: () => o,
        X4: () => i,
      });
      let o = 330,
        a = 30,
        n = 100,
        i = 50;
      function l(e) {
        let {
          selectionRange: t,
          workbook: r,
          chatPanelLayout: n,
          isChatPanelCollapsed: i,
        } = e;
        if (!t || !r) return null;
        try {
          let e = r.originalWorkbook.getActiveSheet(),
            t = e.getSelections();
          if (!t || 0 === t.length) return null;
          let s = t[0],
            c = i ? 0 : (window.innerWidth * n[1]) / 100,
            h = window.innerWidth - c,
            u = e.getRowCount(),
            d = e.getColumnCount(),
            g = s.rowCount === u && s.colCount < a,
            m = s.colCount === d && s.rowCount < a;
          if (g)
            return (function (e, t, r, a) {
              let n = e.getCellRect(0, t.col + t.colCount - 1),
                i = r.getHost().getBoundingClientRect(),
                l = i.left + n.x + n.width + 16,
                s = Math.max(16, (window.innerHeight - 80) / 2);
              return {
                x: l + o + 16 <= a ? l : Math.max(16, i.left + n.x - o - 16),
                y: s,
                isVisible: !0,
              };
            })(e, s, r.originalWorkbook, h);
          if (m)
            return (function (e, t, r, a) {
              let n = e.getCellRect(t.row + t.rowCount - 1, 0),
                i = r.getHost().getBoundingClientRect(),
                l = Math.max(16, (a - 16 - o) / 2),
                s = i.top + n.y + n.height + 16;
              return {
                x: l,
                y:
                  s + 80 <= window.innerHeight - 16
                    ? s
                    : Math.max(16, i.top + n.y - 80 - 16),
                isVisible: !0,
              };
            })(e, s, r.originalWorkbook, h);
          if (s.rowCount > a || s.colCount > a) {
            var l;
            return (
              (l = h),
              {
                x: Math.max(16, (l - 16 - o) / 2),
                y: Math.max(16, (window.innerHeight - 80) / 2),
                isVisible: !0,
              }
            );
          }
          return (function (e, t, r) {
            let o = e.getCellRect(
                t.row + t.rowCount - 1,
                t.col + t.colCount - 1,
              ),
              a = r.getHost().getBoundingClientRect(),
              n = a.left + o.x + o.width,
              i = a.top + o.y + o.height,
              l =
                n >= 0 &&
                i >= 0 &&
                n <= window.innerWidth &&
                i <= window.innerHeight;
            return {
              x: n,
              y: i,
              isVisible: l,
            };
          })(e, s, r.originalWorkbook);
        } catch (e) {
          return (
            console.warn("Failed to calculate bubble position:", e),
            null
          );
        }
      }
    },
    80257: (e, t, r) => {
      r.d(t, {
        R: () => n,
      });
      var o = r(195),
        a = r(60395);
      let n = async function (e) {
        let t =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "spreadsheet.xlsx";
        return new Promise((r, n) => {
          try {
            e.export(
              (e) => {
                let a = new File([e], t, {
                  type: o.Gm,
                });
                r(a);
              },
              (e) => {
                (console.error("Error exporting workbook to file:", e), n(e));
              },
              {
                fileType: a.Spread.Sheets.FileType.excel,
              },
            );
          } catch (e) {
            (console.error("Error creating workbook file:", e), n(e));
          }
        });
      };
    },
    90123: (e, t, r) => {
      function o(e) {
        if (0 === e.length) return [];
        let t = new Set(e.map((e) => "".concat(e.row, ",").concat(e.col))),
          r = new Set(),
          o = [];
        for (let a of [...e].sort((e, t) => e.row + e.col - (t.row + t.col))) {
          let e = "".concat(a.row, ",").concat(a.col);
          if (r.has(e)) continue;
          let n = (function (e, t, r) {
            let o = e.row,
              a = e.col;
            for (;;) {
              let n = (function (e, t, r, o, a) {
                  let n = r + 1;
                  for (let r = e.row; r <= t; r++) {
                    let e = "".concat(r, ",").concat(n);
                    if (!o.has(e) || a.has(e)) return !1;
                  }
                  return !0;
                })(e, o, a, t, r),
                i = (function (e, t, r, o, a) {
                  let n = t + 1;
                  for (let t = e.col; t <= r; t++) {
                    let e = "".concat(n, ",").concat(t);
                    if (!o.has(e) || a.has(e)) return !1;
                  }
                  return !0;
                })(e, o, a, t, r);
              if ((n && a++, i && o++, !n && !i)) break;
            }
            return {
              startRow: e.row,
              startCol: e.col,
              endRow: o,
              endCol: a,
            };
          })(a, t, r);
          o.push(n);
          for (let e = n.startRow; e <= n.endRow; e++)
            for (let t = n.startCol; t <= n.endCol; t++)
              r.add("".concat(e, ",").concat(t));
        }
        return o;
      }
      r.d(t, {
        T: () => o,
      });
    },
  },
]);
//# chunkId=019c0cd3-ceb1-79c0-a5ab-b9767f0bc46e
