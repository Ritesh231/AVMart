import { r as l, j as e } from "./index-CeWgiyge.js"; import { c as q } from "./index-DQ30nXuM.js"; import { B as J, O as Q } from "./OrderdetailedModal-WW0FQbNd.js"; import { a as V } from "./index-CLw9dPAy.js"; import { u as K, a as X } from "./ordersApi-CV2eJfZm.js"; import { S as Y, D as Z } from "./search-a9bTS5zy.js"; import { C as ee } from "./chevron-down-BuCFJmjU.js"; function ie() {
  const { data: F, isLoading: i, isError: j } = K("Delivered"), p = F?.orders || [], [g, A] = l.useState(""), [x, B] = l.useState("All"), [y, u] = l.useState([]), [I, n] = l.useState(!1), N = l.useRef(null), r = (x === "All" ? p : p.filter(t => t.paymentMethod?.toLowerCase() === x.toLowerCase())).filter(t => JSON.stringify(t || {}).toLowerCase().includes(g.toLowerCase())), [o, m] = l.useState(1), b = 6, f = Math.ceil(r.length / b), v = o * b, O = v - b, M = r.slice(O, v); l.useEffect(() => { m(1) }, [p.length, x, g]), l.useEffect(() => { u([]) }, [p.length, x, g]); const [L, S] = l.useState(null), [R, { data: $, isLoading: se }] = X(), C = r.filter(t => y.includes(t._id)).length, E = r.length > 0 && C === r.length, P = C > 0 && !E; l.useEffect(() => { N.current && (N.current.indeterminate = P) }, [P]); const U = t => { u(s => s.includes(t) ? s.filter(a => a !== t) : [...s, t]) }, T = t => { if (t) { u(r.map(s => s._id)); return } u([]) }, k = () => { const t = r.filter(a => y.includes(a._id)), s = t.length > 0 ? t : r; return s.length ? s.map(a => ({ "Order ID": a._id || "-", "Shop Name": a.shopInfo?.name || "-", Price: a.price ?? "-", "Placed On": a.placedOn || "-", Items: a.itemsPreview?.length || a.itemsSummary?.length || 0, "Payment Method": a.paymentMethod || "-", "Delivery Boy": a.deliveryBoy?.name || "Not Assigned", Status: a.OrderStatus || "-" })) : [] }, D = (t, s, a) => { const h = new Blob([t], { type: a }), c = URL.createObjectURL(h), d = document.createElement("a"); d.href = c, d.download = s, d.click(), URL.revokeObjectURL(c) }, z = () => {
    const t = k(); if (!t.length) { n(!1); return } const s = Object.keys(t[0]), a = [s.join(","), ...t.map(h => s.map(c => `"${String(h[c]).replace(/"/g, '""')}"`).join(","))].join(`
`); D(a, "delivered_orders_export.csv", "text/csv;charset=utf-8;"), n(!1)
  }, w = t => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"), _ = t => {
    const s = k(); if (!s.length) return ""; const a = Object.keys(s[0]), h = a.map(d => `<th>${w(d)}</th>`).join(""), c = s.map(d => `<tr>${a.map(W => `<td>${w(d[W])}</td>`).join("")}</tr>`).join(""); return `
      <html>
        <head><meta charset="utf-8" /></head>
        <body>
          <h2>${w(t)}</h2>
          <table border="1" cellspacing="0" cellpadding="6">
            <thead><tr>${h}</tr></thead>
            <tbody>${c}</tbody>
          </table>
        </body>
      </html>`}, H = () => { const t = _("Delivered Orders Export"); if (!t) { n(!1); return } D(t, "delivered_orders_export.doc", "application/msword"), n(!1) }, G = () => {
      const t = _("Delivered Orders Export"); if (!t) { n(!1); return } const s = window.open("", "_blank"); if (!s) { n(!1); return } s.document.write(`
      <html>
        <head>
          <title>Delivered Orders Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 12px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          ${t.match(/<body>([\s\S]*)<\/body>/)?.[1] || ""}
        </body>
      </html>
    `), s.document.close(), s.focus(), s.print(), n(!1)
    }; return e.jsxs(e.Fragment, {
      children: [e.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 mb-8", children: [e.jsx("div", { className: "w-full lg:w-[40%] md:w-[50%]", children: e.jsxs("div", { className: "flex items-center gap-2 bg-white border-2 border-brand-soft rounded-2xl p-3 focus-within:border-brand-teal transition-all", children: [e.jsx(Y, { className: "text-brand-gray", size: 20 }), e.jsx("input", { className: "w-full bg-transparent border-none focus:ring-0 focus:outline-none text-brand-navy placeholder:text-brand-gray", value: g, onChange: t => A(t.target.value), type: "text", placeholder: "Search By Orders" })] }) }), e.jsxs("div", { className: "flex justify-evenly gap-2 items-center", children: [e.jsxs("div", { className: "relative", children: [e.jsxs("select", { value: x, onChange: t => { B(t.target.value), m(1) }, className: "appearance-none border border-brand-cyan font-semibold text-brand-navy px-5 py-3 pr-10 rounded-2xl bg-white cursor-pointer focus:outline-none", children: [e.jsx("option", { value: "All", children: "All Payments" }), e.jsx("option", { value: "Online", children: "Online" }), e.jsx("option", { value: "Cash", children: "Cash On Delivery" }), e.jsx("option", { value: "Partial", children: "Partial" })] }), e.jsx(ee, { size: 18, className: "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-navy" })] }), e.jsxs("div", { className: "relative", children: [e.jsxs("button", { className: "bg-brand-navy px-6 py-3 rounded-2xl flex justify-center gap-2 items-center text-white font-bold hover:bg-opacity-90 transition-all", onClick: () => n(t => !t), children: [e.jsx(Z, { size: 20 }), " Export"] }), I && e.jsxs("div", { className: "absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border z-20", children: [e.jsx("button", { onClick: G, className: "w-full text-left px-4 py-2 text-sm hover:bg-gray-100", children: "PDF" }), e.jsx("button", { onClick: H, className: "w-full text-left px-4 py-2 text-sm hover:bg-gray-100", children: "DOC" }), e.jsx("button", { onClick: z, className: "w-full text-left px-4 py-2 text-sm hover:bg-gray-100", children: "Excel" })] })] })] })] }), e.jsxs("div", {
        className: "bg-white rounded-xl border overflow-x-auto", children: [e.jsxs("table", {
          className: "min-w-[900px] w-full text-sm", children: [e.jsx("thead", { className: "bg-[#F1F5F9] text-gray-600", children: e.jsxs("tr", { children: [e.jsx("th", { className: "p-3", children: e.jsx("input", { ref: N, type: "checkbox", checked: E, onChange: t => T(t.target.checked) }) }), e.jsx("th", { className: "p-3 text-left", children: "Order ID" }), e.jsx("th", { className: "p-3 text-left", children: "Shop Info" }), e.jsx("th", { className: "p-3 text-left", children: "Price" }), e.jsx("th", { className: "p-3 text-left", children: "Placed On" }), e.jsx("th", { className: "p-3 text-left", children: "Items" }), e.jsx("th", { className: "p-3 text-left", children: "Payment" }), e.jsx("th", { className: "p-3 text-left", children: "Delivery Boy" }), e.jsx("th", { className: "p-3 text-left", children: "Action" })] }) }), e.jsxs("tbody", {
            children: [i && Array.from({ length: 6 }).map((t, s) => e.jsxs("tr", { className: "border-t animate-pulse", children: [e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "h-4 w-4 bg-gray-200 rounded" }) }), e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "h-4 w-32 bg-gray-200 rounded" }) }), e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "h-4 w-40 bg-gray-200 rounded" }) }), e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "h-4 w-20 bg-gray-200 rounded" }) }), e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "h-4 w-24 bg-gray-200 rounded" }) }), e.jsx("td", { className: "p-3", children: e.jsxs("div", { className: "flex gap-2", children: [e.jsx("div", { className: "h-8 w-8 bg-gray-200 rounded-md" }), e.jsx("div", { className: "h-8 w-8 bg-gray-200 rounded-md" }), e.jsx("div", { className: "h-8 w-8 bg-gray-200 rounded-md" })] }) }), e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "h-6 w-28 bg-gray-200 rounded-xl" }) }), e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "h-6 w-32 bg-gray-200 rounded" }) }), e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "h-6 w-6 bg-gray-200 rounded-full" }) })] }, s)), j && !i && e.jsx("tr", { children: e.jsx("td", { colSpan: "9", className: "text-center p-6 text-red-500 font-semibold", children: "Failed to load delivered orders. Please try again." }) }), !i && !j && r.length === 0 && e.jsx("tr", { children: e.jsx("td", { colSpan: "9", className: "text-center p-6 text-gray-500", children: "No delivered orders found." }) }), !i && !j && M.map(t => e.jsxs("tr", {
              className: "border-t hover:bg-gray-50", children: [e.jsx("td", { className: "p-3", children: e.jsx("input", { type: "checkbox", checked: y.includes(t._id), onChange: () => U(t._id) }) }), e.jsx("td", { className: "p-3 font-medium", children: t._id }), e.jsx("td", { className: "p-3 font-medium", children: t.shopInfo?.name }), e.jsx("td", { className: "p-3", children: t.price }), e.jsx("td", { className: "p-3", children: t.placedOn || "-" }), e.jsx("td", { className: "p-3", children: e.jsx("div", { className: "flex items-center gap-2", children: t.itemsPreview?.slice(0, 3).map((s, a) => e.jsx("img", { src: s.image, alt: "item", className: "w-8 h-8 rounded-md object-cover border" }, a)) }) }), e.jsx("td", {
                className: "p-3", children: e.jsxs("span", {
                  className: `inline-flex items-center gap-2 px-3 py-1.5 rounded-xl
            bg-[#57FB6830] border border-[#03C616] text-[#03C616] text-sm font-semibold`, children: [e.jsx(J, { className: "text-[#03C616]" }), t.paymentMethod]
                })
              }), e.jsx("td", { className: "p-3", children: e.jsxs("div", { className: "flex items-center gap-2 text-[#1A2550] text-sm", children: [e.jsx(V, { className: "text-xl" }), t.deliveryBoy?.name || "Not Assigned"] }) }), e.jsx("td", { className: "p-3", children: e.jsx("button", { className: "p-1 text-blue-900", title: "View", onClick: async () => { S(t._id), await R(t._id) }, children: e.jsx(q, { size: 18 }) }) })]
            }, t._id))]
          })]
        }), L && e.jsx(Q, { order: $?.order, loading: i, onClose: () => S(null) }), r.length > b && e.jsxs("div", {
          className: "flex justify-between items-center mt-6 px-4 py-4 bg-white border-t", children: [e.jsxs("p", { className: "text-sm text-gray-600", children: ["Showing ", O + 1, " to", " ", Math.min(v, r.length), " of", " ", r.length, " orders"] }), e.jsxs("div", {
            className: "flex items-center gap-2", children: [e.jsx("button", {
              onClick: () => m(t => Math.max(t - 1, 1)), disabled: o === 1, className: `px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${o === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1E264F] text-white hover:bg-opacity-90"}`, children: "Prev"
            }), [...Array(f)].map((t, s) => {
              const a = s + 1; return e.jsx("button", {
                onClick: () => m(a), className: `px-3 py-2 rounded-lg text-sm font-semibold transition-all
              ${o === a ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white shadow-md" : "bg-gray-100 text-[#1E264F] hover:bg-gray-200"}`, children: a
              }, a)
            }), e.jsx("button", {
              onClick: () => m(t => Math.min(t + 1, f)), disabled: o === f, className: `px-3 py-2 rounded-lg text-sm font-medium transition-all
          ${o === f ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#1E264F] text-white hover:bg-opacity-90"}`, children: "Next"
            })]
          })]
        })]
      })]
    })
} export { ie as default };
