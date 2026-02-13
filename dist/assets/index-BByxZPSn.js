var M={exports:{}},i={};var ne;function ye(){if(ne)return i;ne=1;var t=Symbol.for("react.element"),o=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),c=Symbol.for("react.profiler"),a=Symbol.for("react.provider"),l=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),y=Symbol.for("react.suspense"),b=Symbol.for("react.memo"),_=Symbol.for("react.lazy"),S=Symbol.iterator;function j(e){return e===null||typeof e!="object"?null:(e=S&&e[S]||e["@@iterator"],typeof e=="function"?e:null)}var Y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},G=Object.assign,K={};function A(e,r,u){this.props=e,this.context=r,this.refs=K,this.updater=u||Y}A.prototype.isReactComponent={},A.prototype.setState=function(e,r){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,r,"setState")},A.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Q(){}Q.prototype=A.prototype;function D(e,r,u){this.props=e,this.context=r,this.refs=K,this.updater=u||Y}var N=D.prototype=new Q;N.constructor=D,G(N,A.prototype),N.isPureReactComponent=!0;var X=Array.isArray,Z=Object.prototype.hasOwnProperty,T={current:null},ee={key:!0,ref:!0,__self:!0,__source:!0};function te(e,r,u){var d,p={},h=null,g=null;if(r!=null)for(d in r.ref!==void 0&&(g=r.ref),r.key!==void 0&&(h=""+r.key),r)Z.call(r,d)&&!ee.hasOwnProperty(d)&&(p[d]=r[d]);var v=arguments.length-2;if(v===1)p.children=u;else if(1<v){for(var m=Array(v),E=0;E<v;E++)m[E]=arguments[E+2];p.children=m}if(e&&e.defaultProps)for(d in v=e.defaultProps,v)p[d]===void 0&&(p[d]=v[d]);return{$$typeof:t,type:e,key:h,ref:g,props:p,_owner:T.current}}function le(e,r){return{$$typeof:t,type:e.type,key:r,ref:e.ref,props:e.props,_owner:e._owner}}function V(e){return typeof e=="object"&&e!==null&&e.$$typeof===t}function fe(e){var r={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(u){return r[u]})}var re=/\/+/g;function L(e,r){return typeof e=="object"&&e!==null&&e.key!=null?fe(""+e.key):r.toString(36)}function P(e,r,u,d,p){var h=typeof e;(h==="undefined"||h==="boolean")&&(e=null);var g=!1;if(e===null)g=!0;else switch(h){case"string":case"number":g=!0;break;case"object":switch(e.$$typeof){case t:case o:g=!0}}if(g)return g=e,p=p(g),e=d===""?"."+L(g,0):d,X(p)?(u="",e!=null&&(u=e.replace(re,"$&/")+"/"),P(p,r,u,"",function(E){return E})):p!=null&&(V(p)&&(p=le(p,u+(!p.key||g&&g.key===p.key?"":(""+p.key).replace(re,"$&/")+"/")+e)),r.push(p)),1;if(g=0,d=d===""?".":d+":",X(e))for(var v=0;v<e.length;v++){h=e[v];var m=d+L(h,v);g+=P(h,r,u,m,p)}else if(m=j(e),typeof m=="function")for(e=m.call(e),v=0;!(h=e.next()).done;)h=h.value,m=d+L(h,v++),g+=P(h,r,u,m,p);else if(h==="object")throw r=String(e),Error("Objects are not valid as a React child (found: "+(r==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":r)+"). If you meant to render a collection of children, use an array instead.");return g}function F(e,r,u){if(e==null)return e;var d=[],p=0;return P(e,d,"","",function(h){return r.call(u,h,p++)}),d}function pe(e){if(e._status===-1){var r=e._result;r=r(),r.then(function(u){(e._status===0||e._status===-1)&&(e._status=1,e._result=u)},function(u){(e._status===0||e._status===-1)&&(e._status=2,e._result=u)}),e._status===-1&&(e._status=0,e._result=r)}if(e._status===1)return e._result.default;throw e._result}var x={current:null},q={transition:null},de={ReactCurrentDispatcher:x,ReactCurrentBatchConfig:q,ReactCurrentOwner:T};function oe(){throw Error("act(...) is not supported in production builds of React.")}return i.Children={map:F,forEach:function(e,r,u){F(e,function(){r.apply(this,arguments)},u)},count:function(e){var r=0;return F(e,function(){r++}),r},toArray:function(e){return F(e,function(r){return r})||[]},only:function(e){if(!V(e))throw Error("React.Children.only expected to receive a single React element child.");return e}},i.Component=A,i.Fragment=n,i.Profiler=c,i.PureComponent=D,i.StrictMode=s,i.Suspense=y,i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=de,i.act=oe,i.cloneElement=function(e,r,u){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var d=G({},e.props),p=e.key,h=e.ref,g=e._owner;if(r!=null){if(r.ref!==void 0&&(h=r.ref,g=T.current),r.key!==void 0&&(p=""+r.key),e.type&&e.type.defaultProps)var v=e.type.defaultProps;for(m in r)Z.call(r,m)&&!ee.hasOwnProperty(m)&&(d[m]=r[m]===void 0&&v!==void 0?v[m]:r[m])}var m=arguments.length-2;if(m===1)d.children=u;else if(1<m){v=Array(m);for(var E=0;E<m;E++)v[E]=arguments[E+2];d.children=v}return{$$typeof:t,type:e.type,key:p,ref:h,props:d,_owner:g}},i.createContext=function(e){return e={$$typeof:l,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:a,_context:e},e.Consumer=e},i.createElement=te,i.createFactory=function(e){var r=te.bind(null,e);return r.type=e,r},i.createRef=function(){return{current:null}},i.forwardRef=function(e){return{$$typeof:f,render:e}},i.isValidElement=V,i.lazy=function(e){return{$$typeof:_,_payload:{_status:-1,_result:e},_init:pe}},i.memo=function(e,r){return{$$typeof:b,type:e,compare:r===void 0?null:r}},i.startTransition=function(e){var r=q.transition;q.transition={};try{e()}finally{q.transition=r}},i.unstable_act=oe,i.useCallback=function(e,r){return x.current.useCallback(e,r)},i.useContext=function(e){return x.current.useContext(e)},i.useDebugValue=function(){},i.useDeferredValue=function(e){return x.current.useDeferredValue(e)},i.useEffect=function(e,r){return x.current.useEffect(e,r)},i.useId=function(){return x.current.useId()},i.useImperativeHandle=function(e,r,u){return x.current.useImperativeHandle(e,r,u)},i.useInsertionEffect=function(e,r){return x.current.useInsertionEffect(e,r)},i.useLayoutEffect=function(e,r){return x.current.useLayoutEffect(e,r)},i.useMemo=function(e,r){return x.current.useMemo(e,r)},i.useReducer=function(e,r,u){return x.current.useReducer(e,r,u)},i.useRef=function(e){return x.current.useRef(e)},i.useState=function(e){return x.current.useState(e)},i.useSyncExternalStore=function(e,r,u){return x.current.useSyncExternalStore(e,r,u)},i.useTransition=function(){return x.current.useTransition()},i.version="18.3.1",i}var ae;function me(){return ae||(ae=1,M.exports=ye()),M.exports}var w=me();let he={data:""},ve=t=>typeof window=="object"?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||he,ge=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,be=/\/\*[^]*?\*\/|  +/g,ie=/\n+/g,C=(t,o)=>{let n="",s="",c="";for(let a in t){let l=t[a];a[0]=="@"?a[1]=="i"?n=a+" "+l+";":s+=a[1]=="f"?C(l,a):a+"{"+C(l,a[1]=="k"?"":o)+"}":typeof l=="object"?s+=C(l,o?o.replace(/([^,])+/g,f=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,y=>/&/.test(y)?y.replace(/&/g,f):f?f+" "+y:y)):a):l!=null&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),c+=C.p?C.p(a,l):a+":"+l+";")}return n+(o&&c?o+"{"+c+"}":c)+s},k={},se=t=>{if(typeof t=="object"){let o="";for(let n in t)o+=n+se(t[n]);return o}return t},xe=(t,o,n,s,c)=>{let a=se(t),l=k[a]||(k[a]=(y=>{let b=0,_=11;for(;b<y.length;)_=101*_+y.charCodeAt(b++)>>>0;return"go"+_})(a));if(!k[l]){let y=a!==t?t:(b=>{let _,S,j=[{}];for(;_=ge.exec(b.replace(be,""));)_[4]?j.shift():_[3]?(S=_[3].replace(ie," ").trim(),j.unshift(j[0][S]=j[0][S]||{})):j[0][_[1]]=_[2].replace(ie," ").trim();return j[0]})(t);k[l]=C(c?{["@keyframes "+l]:y}:y,n?"":"."+l)}let f=n&&k.g?k.g:null;return n&&(k.g=k[l]),((y,b,_,S)=>{S?b.data=b.data.replace(S,y):b.data.indexOf(y)===-1&&(b.data=_?y+b.data:b.data+y)})(k[l],o,s,f),l},_e=(t,o,n)=>t.reduce((s,c,a)=>{let l=o[a];if(l&&l.call){let f=l(n),y=f&&f.props&&f.props.className||/^go/.test(f)&&f;l=y?"."+y:f&&typeof f=="object"?f.props?"":C(f,""):f===!1?"":f}return s+c+(l??"")},"");function z(t){let o=this||{},n=t.call?t(o.p):t;return xe(n.unshift?n.raw?_e(n,[].slice.call(arguments,1),o.p):n.reduce((s,c)=>Object.assign(s,c&&c.call?c(o.p):c),{}):n,ve(o.target),o.g,o.o,o.k)}let ue,H,B;z.bind({g:1});let R=z.bind({k:1});function we(t,o,n,s){C.p=o,ue=t,H=n,B=s}function O(t,o){let n=this||{};return function(){let s=arguments;function c(a,l){let f=Object.assign({},a),y=f.className||c.className;n.p=Object.assign({theme:H&&H()},f),n.o=/ *go\d+/.test(y),f.className=z.apply(n,s)+(y?" "+y:"");let b=t;return t[0]&&(b=f.as||t,delete f.as),B&&b[0]&&B(f),ue(b,f)}return c}}var $e=t=>typeof t=="function",W=(t,o)=>$e(t)?t(o):t,Ee=(()=>{let t=0;return()=>(++t).toString()})(),Se=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let o=matchMedia("(prefers-reduced-motion: reduce)");t=!o||o.matches}return t}})(),ke=20,ce=(t,o)=>{switch(o.type){case 0:return{...t,toasts:[o.toast,...t.toasts].slice(0,ke)};case 1:return{...t,toasts:t.toasts.map(a=>a.id===o.toast.id?{...a,...o.toast}:a)};case 2:let{toast:n}=o;return ce(t,{type:t.toasts.find(a=>a.id===n.id)?1:0,toast:n});case 3:let{toastId:s}=o;return{...t,toasts:t.toasts.map(a=>a.id===s||s===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return o.toastId===void 0?{...t,toasts:[]}:{...t,toasts:t.toasts.filter(a=>a.id!==o.toastId)};case 5:return{...t,pausedAt:o.time};case 6:let c=o.time-(t.pausedAt||0);return{...t,pausedAt:void 0,toasts:t.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+c}))}}},Re=[],U={toasts:[],pausedAt:void 0},J=t=>{U=ce(U,t),Re.forEach(o=>{o(U)})},je=(t,o="blank",n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:o,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0,...n,id:n?.id||Ee()}),I=t=>(o,n)=>{let s=je(o,t,n);return J({type:2,toast:s}),s.id},$=(t,o)=>I("blank")(t,o);$.error=I("error");$.success=I("success");$.loading=I("loading");$.custom=I("custom");$.dismiss=t=>{J({type:3,toastId:t})};$.remove=t=>J({type:4,toastId:t});$.promise=(t,o,n)=>{let s=$.loading(o.loading,{...n,...n?.loading});return typeof t=="function"&&(t=t()),t.then(c=>{let a=o.success?W(o.success,c):void 0;return a?$.success(a,{id:s,...n,...n?.success}):$.dismiss(s),c}).catch(c=>{let a=o.error?W(o.error,c):void 0;a?$.error(a,{id:s,...n,...n?.error}):$.dismiss(s)}),t};var Ce=R`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Oe=R`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ae=R`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ie=O("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Ce} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Oe} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${Ae} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Pe=R`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Fe=O("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${Pe} 1s linear infinite;
`,qe=R`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ze=R`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,De=O("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${qe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ze} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Ne=O("div")`
  position: absolute;
`,Te=O("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Ve=R`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Le=O("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ve} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Me=({toast:t})=>{let{icon:o,type:n,iconTheme:s}=t;return o!==void 0?typeof o=="string"?w.createElement(Le,null,o):o:n==="blank"?null:w.createElement(Te,null,w.createElement(Fe,{...s}),n!=="loading"&&w.createElement(Ne,null,n==="error"?w.createElement(Ie,{...s}):w.createElement(De,{...s})))},Ue=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,He=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,Be="0%{opacity:0;} 100%{opacity:1;}",We="0%{opacity:1;} 100%{opacity:0;}",Je=O("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Ye=O("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Ge=(t,o)=>{let n=t.includes("top")?1:-1,[s,c]=Se()?[Be,We]:[Ue(n),He(n)];return{animation:o?`${R(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${R(c)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};w.memo(({toast:t,position:o,style:n,children:s})=>{let c=t.height?Ge(t.position||o||"top-center",t.visible):{opacity:0},a=w.createElement(Me,{toast:t}),l=w.createElement(Ye,{...t.ariaProps},W(t.message,t));return w.createElement(Je,{className:t.className,style:{...c,...n,...t.style}},typeof s=="function"?s({icon:a,message:l}):w.createElement(w.Fragment,null,a,l))});we(w.createElement);z`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var Ke=$;export{Ke as V};
