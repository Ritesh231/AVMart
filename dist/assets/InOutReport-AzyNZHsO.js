import{r as g,j as e,p as F,q as T,o as M,n as A}from"./index-waVYHeq7.js";import{d as z,O as v}from"./ReportTab-BKeswnm3.js";import{S as L}from"./StatCard-DYkg85cm.js";import{S as _}from"./statcardskeleton-BAOo0gOa.js";import{D as U}from"./download-DXMxHqQC.js";import{C as V}from"./chevron-down-PXfH6KUi.js";function W(){const[i,O]=g.useState({filterType:"monthly",fromDate:"",toDate:""}),{data:d,isLoading:R}=z(i,{refetchOnMountOrArgChange:!0}),[k,c]=g.useState(!1),x=10,D=({currentPage:t,totalPages:s,onPageChange:r})=>{if(s<=1)return null;const n=()=>{const a=[];if(s<=5)for(let l=1;l<=s;l++)a.push(l);else{let l=Math.max(1,t-2),u=Math.min(s,l+5-1);u-l<4&&(l=Math.max(1,u-5+1));for(let b=l;b<=u;b++)a.push(b)}return a};return e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-4 py-4 bg-white border-t",children:[e.jsxs("p",{className:"text-sm text-gray-600",children:["Page ",t," of ",s]}),e.jsxs("div",{className:"flex items-center gap-2 flex-wrap justify-center",children:[e.jsx("button",{onClick:()=>r(t-1),disabled:t===1,className:`px-4 py-2 rounded-lg text-sm font-medium transition ${t===1?"bg-gray-200 text-gray-400 cursor-not-allowed":"bg-[#1E264F] text-white hover:bg-opacity-90"}`,children:"Prev"}),n().map(a=>e.jsx("button",{onClick:()=>r(a),className:`px-4 py-2 rounded-lg text-sm font-semibold transition ${t===a?"bg-gradient-to-r from-[#FD610D] to-[#FF8800] text-white":"bg-gray-100 text-[#1E264F] hover:bg-gray-200"}`,children:a},a)),e.jsx("button",{onClick:()=>r(t+1),disabled:t===s,className:`px-4 py-2 rounded-lg text-sm font-medium transition ${t===s?"bg-gray-200 text-gray-400 cursor-not-allowed":"bg-[#1E264F] text-white hover:bg-opacity-90"}`,children:"Next"})]})]})};i.filterType;const[m,f]=g.useState(1),j=d?.Data||[],I=Math.ceil(j.length/x),y=[...j].reverse().slice((m-1)*x,m*x),p=(t,s)=>{O(r=>({...r,[t]:s}))},h=()=>{const t=d?.Data||[];return t.length?[...t].reverse().map((s,r)=>({"S.No":r+1,"Product Name":s.productName||"-",Quantity:s.quantity||0,InRate:`₹${Number(s.InRate||0).toFixed(2)}`,OutRate:`₹${Number(s.OutRate||0).toFixed(2)}`,Margin:`₹${Number(s.margin||0).toFixed(2)}`,Stock:s.stock||0,Date:s.date?new Date(s.date).toLocaleDateString("en-IN"):"-"})):(toast.info("No in/out rate report data available to export"),[])},N=(t,s,r)=>{const n=new Blob([t],{type:r}),a=URL.createObjectURL(n),o=document.createElement("a");o.href=a,o.download=s,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(a)},C=()=>{const t=h();if(!t.length)return;const s=Object.keys(t[0]),r=[s.join(","),...t.map(n=>s.map(a=>`"${String(n[a]??"").replace(/"/g,'""')}"`).join(","))].join(`
`);N(r,`inrate-outrate-report-${new Date().toISOString().split("T")[0]}.csv`,"text/csv;charset=utf-8;"),c(!1)},$=()=>{const t=h();if(!t.length)return;const s=Object.keys(t[0]),r=s.map(o=>`<th>${o}</th>`).join(""),n=t.map(o=>`<tr>${s.map(l=>`<td>${o[l]??"-"}</td>`).join("")}</tr>`).join(""),a=`
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Inrate Outrate Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
          }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h2>Inrate Outrate Report</h2>
        <table>
          <thead>
            <tr>${r}</tr>
          </thead>
          <tbody>
            ${n}
          </tbody>
        </table>
      </body>
    </html>
  `;N(a,`inrate-outrate-report-${new Date().toISOString().split("T")[0]}.doc`,"application/msword"),c(!1)},S=()=>{const t=h();if(!t.length)return;const s=Object.keys(t[0]),r=s.map(o=>`<th>${o}</th>`).join(""),n=t.map(o=>`<tr>${s.map(l=>`<td>${o[l]??"-"}</td>`).join("")}</tr>`).join(""),a=window.open("","_blank");a&&(a.document.write(`
    <html>
      <head>
        <title>Inrate Outrate Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { margin-bottom: 20px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>Inrate Outrate Report</h2>
        <table>
          <thead>
            <tr>${r}</tr>
          </thead>
          <tbody>
            ${n}
          </tbody>
        </table>
      </body>
    </html>
  `),a.document.close(),a.focus(),a.print(),c(!1))},E=[{title:"Total Records",number:d?.totalRecords||0,icon:e.jsx(F,{size:24}),variant:"special"},{title:"Total InRate",number:`₹${Number(d?.totalInRate||0).toFixed(2)}`,icon:e.jsx(T,{size:24}),variant:"normal"},{title:"Total OutRate",number:`₹${Number(d?.totalOutRate||0).toFixed(2)}`,icon:e.jsx(M,{size:24}),variant:"normal"},{title:"Total Profit",number:`₹${Number(d?.totalProfit||0).toFixed(2)}`,icon:e.jsx(A,{size:24}),variant:"normal"}],w=({rows:t=7,columns:s=7})=>e.jsx("div",{className:"overflow-x-auto animate-pulse",children:e.jsxs("table",{className:"min-w-full",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsx("tr",{children:Array.from({length:s}).map((r,n)=>e.jsx("th",{className:"px-6 py-4",children:e.jsx("div",{className:"h-4 bg-gray-300 rounded w-24 mx-auto"})},n))})}),e.jsx("tbody",{children:Array.from({length:t}).map((r,n)=>e.jsx("tr",{className:"border-b",children:Array.from({length:s}).map((a,o)=>e.jsx("td",{className:"px-6 py-4",children:e.jsx("div",{className:"h-4 bg-gray-200 rounded"})},o))},n))})]})});return R?e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsx("section",{children:e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4",children:[...Array(3)].map((t,s)=>e.jsx(_,{},s))})}),e.jsx(v,{}),e.jsxs("div",{className:"flex justify-between items-center bg-white shadow rounded-2xl p-4",children:[e.jsx("div",{className:"h-8 w-40 bg-gray-300 rounded animate-pulse"}),e.jsx("div",{className:"h-10 w-72 bg-gray-200 rounded-xl animate-pulse"})]}),e.jsxs("div",{className:"bg-white shadow rounded-2xl p-4",children:[e.jsx("div",{className:"h-7 w-56 bg-gray-300 rounded mb-6 animate-pulse"}),e.jsx(w,{rows:5,columns:3})]}),e.jsxs("div",{className:"bg-white shadow rounded-2xl p-4",children:[e.jsx("div",{className:"h-7 w-32 bg-gray-300 rounded mb-6 animate-pulse"}),e.jsx(w,{rows:6,columns:5})]})]}):e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsx("section",{className:"stat-card-sec",children:e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",children:E.map((t,s)=>e.jsx(L,{title:t.title,number:t.number,icon:t.icon,variant:t.variant},s))})}),e.jsx(v,{}),e.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",children:[e.jsx("h2",{className:"text-xl font-bold",children:"In Out Report"}),e.jsxs("div",{className:"flex flex-col sm:flex-row sm:items-center gap-3",children:[e.jsxs("select",{value:i.filterType,onChange:t=>{p("filterType",t.target.value),f(1)},className:"outline-none bg-transparent text-sm font-medium cursor-pointer px-2 py-1 min-w-[140px]",children:[e.jsx("option",{value:"",children:"All"}),e.jsx("option",{value:"week",children:"Week"}),e.jsx("option",{value:"monthly",children:"Monthly"}),e.jsx("option",{value:"custom",children:"Custom Range"})]}),i.filterType==="custom"&&e.jsxs("div",{className:"flex items-center gap-2 flex-wrap",children:[e.jsx("input",{type:"date",value:i.fromDate,onChange:t=>p("fromDate",t.target.value),className:"border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"}),e.jsx("span",{className:"text-gray-400 text-sm",children:"to"}),e.jsx("input",{type:"date",value:i.toDate,onChange:t=>p("toDate",t.target.value),className:"border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"})]}),e.jsxs("div",{className:"relative",children:[e.jsxs("button",{onClick:()=>c(t=>!t),className:"bg-brand-navy px-5 py-3 rounded-xl flex items-center gap-2 text-white font-semibold hover:bg-opacity-90 transition-all whitespace-nowrap",children:[e.jsx(U,{size:18}),"Export",e.jsx(V,{size:16})]}),k&&e.jsxs("div",{className:"absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden",children:[e.jsx("button",{onClick:C,className:"w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors",children:"Export Excel"}),e.jsx("button",{onClick:S,className:"w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors",children:"Export PDF"}),e.jsx("button",{onClick:$,className:"w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors",children:"Export DOC"})]})]})]})]}),e.jsx("div",{className:"bg-white shadow rounded-2xl p-4",children:e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full border text-sm ",children:[e.jsx("thead",{className:"bg-gray-100",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-2 border text-left",children:"Product"}),e.jsx("th",{className:"p-2 border",children:"Qty"}),e.jsx("th",{className:"p-2 border",children:"InRate"}),e.jsx("th",{className:"p-2 border",children:"OutRate"}),e.jsx("th",{className:"p-2 border",children:"Margin"}),e.jsx("th",{className:"p-2 border",children:"Stock"}),e.jsx("th",{className:"p-2 border",children:"Date"})]})}),e.jsx("tbody",{children:y.length?y.map(t=>e.jsxs("tr",{className:"text-center",children:[e.jsx("td",{className:"p-2 border text-left",children:t.productName}),e.jsx("td",{className:"p-2 border",children:t.quantity}),e.jsxs("td",{className:"p-2 border",children:["₹ ",Number(t.InRate).toFixed(2)]}),e.jsxs("td",{className:"p-2 border",children:["₹ ",Number(t.OutRate).toFixed(2)]}),e.jsxs("td",{className:"p-2 border font-semibold text-green-600",children:["₹ ",Number(t.margin).toFixed(2)]}),e.jsx("td",{className:"p-2 border",children:t.stock}),e.jsx("td",{className:"p-2 border",children:new Date(t.date).toLocaleDateString()})]},t.variantId)):e.jsx("tr",{children:e.jsx("td",{colSpan:"7",className:"p-4 text-center text-gray-500",children:"No records found"})})})]})})}),e.jsx(D,{currentPage:m,totalPages:I,onPageChange:f})]})}export{W as default};
