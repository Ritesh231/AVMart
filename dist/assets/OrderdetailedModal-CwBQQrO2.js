import{G as b,r as f,j as e,h as j,y as n}from"./index-waVYHeq7.js";import{d as y}from"./index-DwaguMNf.js";import{f as w,g as N}from"./ordersApi-C0tOeDTd.js";import{X as v}from"./x-hrk3yXrB.js";function I(s){return b({attr:{viewBox:"0 0 24 24"},child:[{tag:"g",attr:{id:"Circle_Minus"},child:[{tag:"g",attr:{},child:[{tag:"path",attr:{d:"M15,11.5h0a.5.5,0,0,1,0,1H9a.5.5,0,0,1,0-1Z"},child:[]},{tag:"path",attr:{d:"M12,21.934A9.933,9.933,0,1,1,21.932,12,9.945,9.945,0,0,1,12,21.934ZM12,3.068A8.933,8.933,0,1,0,20.932,12,8.944,8.944,0,0,0,12,3.068Z"},child:[]}]}]}]})(s)}function M({order:s,loading:c,onClose:i}){if(!s&&!c)return null;const l=["ordered","assigned","dispatched","ongoing","delivered"],o=l.indexOf(s?.rawStatus?.toLowerCase()),d=f.useRef(),[x]=w(),[m]=N(),p=()=>{const r=d.current.innerHTML,t=window.open("","_blank","width=800,height=600");t.document.write(`
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <style>
        body {
  padding: 20px;

  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
          .no-print {
            display: none !important;
          }
              .print-header {
    background-color: #1E264F !important;
    color: white !important;
  }

     /* ✅ ADD THIS */
      ::-webkit-scrollbar {
        display: none;
      }

      * {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE */
      }
        </style>
      </head>
      <body>
        ${r}
      </body>
    </html>
  `),t.document.close(),t.focus(),setTimeout(()=>{t.print(),t.close()},500)},h=async r=>{if(window.confirm("Are you sure you want to delete this item?"))try{const a=await x({orderId:s._id,itemId:r}).unwrap();n.success(a?.message||"Item deleted successfully"),setTimeout(()=>{i()},500)}catch(a){console.error(a),n.error("Failed to delete item")}},u=async r=>{try{const t=await m({orderId:s._id,productId:r.productId}).unwrap();n.success(t?.message||"Item quantity decreased successfully"),setTimeout(()=>{i()},1200)}catch(t){console.error(t),n.error("Failed to decrease item quantity")}};return e.jsx("div",{className:"fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm no-scrollbar",children:e.jsxs("div",{ref:d,className:"bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn ",children:[e.jsxs("div",{className:"print-header flex justify-between items-center",style:{backgroundColor:"#1E264F",color:"white",padding:"16px"},children:[e.jsxs("div",{children:[e.jsx("h2",{className:"font-bold text-white text-lg",children:s?.orderId}),e.jsx("p",{className:"text-xs opacity-80",children:s?.placedOn})]}),e.jsxs("div",{className:"flex items-center gap-3 no-print",children:[e.jsx("span",{className:"bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold",children:s?.deliveryStatus}),e.jsx("button",{onClick:p,className:"bg-gray-300 text-black text-xs px-3 py-1 rounded-full font-semibold",children:e.jsx(j,{size:20})}),e.jsx("button",{onClick:i,children:e.jsx(v,{size:20})})]})]}),e.jsxs("div",{className:"p-4 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar",children:[e.jsx("div",{className:"border rounded-xl p-3 bg-gray-50",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("img",{src:s?.shopInfo?.image,className:"w-12 h-12 rounded-lg object-cover",alt:""}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:s?.shopInfo?.name}),e.jsx("p",{className:"text-sm text-gray-500",children:s?.shopInfo?.contact})]})]})}),e.jsxs("div",{className:"border rounded-xl p-3 bg-gray-50 space-y-3",children:[s?.items?.map((r,t)=>e.jsxs("div",{className:"flex justify-between items-center border-b border-gray-200 pb-2",children:[e.jsxs("div",{className:"flex gap-3 items-center",children:[e.jsx("img",{src:r.image,className:"w-10 h-10 rounded object-cover",alt:""}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-sm",children:r.productName}),e.jsxs("p",{className:"text-xs text-gray-500",children:["Qty: ",r.quantity]}),r.quantity>1&&e.jsxs("button",{onClick:()=>u(r),className:"flex items-center mt-1 mr-1 gap-1 text-red-500 border border-red-300 px-2 py-[2px] rounded-md text-xs hover:bg-red-50 transition no-print",children:[e.jsx(I,{size:14}),e.jsx("span",{children:"Qty Decrease"})]})]})]}),e.jsxs("div",{className:"flex items-center gap-3 ",children:[e.jsxs("p",{className:"font-semibold",children:["₹",r.itemTotal.toFixed(2)]}),e.jsx(y,{className:"text-red-500 cursor-pointer hover:scale-110 transition no-print",size:18,onClick:()=>h(r._id)})]})]},t)),e.jsxs("div",{className:"flex justify-between items-center text-sm",children:[e.jsx("span",{children:"Total Delivery Charge"}),e.jsxs("span",{children:["₹",s?.deliveryCharge?.toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between text-green-600 items-center text-sm",children:[e.jsx("span",{children:"Total Amount"}),e.jsxs("span",{children:["₹",s?.grandTotal?.toFixed(2)]})]})]}),e.jsxs("div",{className:"border rounded-xl p-3 bg-gray-50",children:[e.jsx("p",{className:"font-semibold text-sm mb-1",children:"Shipping Address"}),e.jsx("p",{className:"text-sm",children:s?.shippingAddress?.fullName}),e.jsxs("p",{className:"text-xs text-gray-600",children:[s?.shippingAddress?.addressLine1,","," ",s?.shippingAddress?.city]})]}),e.jsxs("div",{className:"border rounded-xl p-4 bg-gray-50 no-print",children:[e.jsx("p",{className:"font-semibold text-sm mb-4",children:"Order Timeline"}),l.map((r,t)=>{const a=t<=o,g=t===l.length-1;return e.jsxs("div",{className:"relative flex items-start gap-4",children:[!g&&e.jsx("div",{className:`absolute left-[11px] top-6 w-[2px] h-full
              ${a?"bg-green-500":"bg-gray-300"}
            `}),e.jsx("div",{className:`z-10 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
            ${a?"bg-blue-900 text-green-300":"border-2 border-gray-300 bg-white"}
          `,children:a&&"✓"}),e.jsxs("div",{className:"pb-6",children:[e.jsx("p",{className:`text-sm font-medium capitalize ${a?"text-black":"text-gray-400"}`,children:r}),a&&e.jsx("p",{className:"text-xs text-gray-500",children:new Date(s?.createdAt).toLocaleString()})]})]},t)})]})]})]})})}export{M as O};
