/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.matchMedia polyfill via Modernizr or otherwise, you don't need this part */
window.matchMedia=window.matchMedia||function(n){"use strict";var u,i=n.documentElement,f=i.firstElementChild||i.firstChild,r=n.createElement("body"),t=n.createElement("div");return t.id="mq-test-1",t.style.cssText="position:absolute;top:-100em",r.style.background="none",r.appendChild(t),function(n){return t.innerHTML='&shy;<style media="'+n+'"> #mq-test-1 { width: 42px; }<\/style>',i.insertBefore(r,f),u=42===t.offsetWidth,i.removeChild(r),{matches:u,media:n}}}(document);
/*! Respond.js v1.3.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function(n){"use strict";function y(){v(!0)}var r={};if(n.respond=r,r.update=function(){},r.mediaQueriesSupported=n.matchMedia&&n.matchMedia("only all").matches,!r.mediaQueriesSupported){var h,p,c,t=n.document,u=t.documentElement,f=[],e=[],i=[],l={},w=30,o=t.getElementsByTagName("head")[0]||u,nt=t.getElementsByTagName("base")[0],s=o.getElementsByTagName("link"),a=[],b=function(){for(var r=0;s.length>r;r++){var t=s[r],i=t.href,u=t.media,f=t.rel&&"stylesheet"===t.rel.toLowerCase();i&&f&&!l[i]&&(t.styleSheet&&t.styleSheet.rawCssText?(d(t.styleSheet.rawCssText,i,u),l[i]=!0):(!/^([a-zA-Z:]*\/\/)/.test(i)&&!nt||i.replace(RegExp.$1,"").split("/")[0]===n.location.host)&&a.push({href:i,media:u}))}k()},k=function(){if(a.length){var t=a.shift();tt(t.href,function(i){d(i,t.href,t.media);l[t.href]=!0;n.setTimeout(function(){k()},0)})}},d=function(n,t,i){var s=n.match(/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi),h=s&&s.length||0,c,l,u,a,r,y,p,o;for(t=t.substring(0,t.lastIndexOf("/")),c=function(n){return n.replace(/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,"$1"+t+"$2$3")},l=!h&&i,t.length&&(t+="/"),l&&(h=1),u=0;h>u;u++)for(l?(a=i,e.push(c(n))):(a=s[u].match(/@media *([^\{]+)\{([\S\s]+?)$/)&&RegExp.$1,e.push(RegExp.$2&&c(RegExp.$2))),y=a.split(","),p=y.length,o=0;p>o;o++)r=y[o],f.push({media:r.split("(")[0].match(/(only\s+)?([a-zA-Z]+)\s?/)&&RegExp.$2||"all",rules:e.length-1,hasquery:r.indexOf("(")>-1,minw:r.match(/\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:r.match(/\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/)&&parseFloat(RegExp.$1)+(RegExp.$2||"")});v()},g=function(){var r,i=t.createElement("div"),n=t.body,f=!1;return i.style.cssText="position:absolute;font-size:1em;width:1em",n||(n=f=t.createElement("body"),n.style.background="none"),n.appendChild(i),u.insertBefore(n,u.firstChild),r=i.offsetWidth,f?u.removeChild(n):n.removeChild(i),r=c=parseFloat(r)},v=function(r){var rt="clientWidth",ut=u[rt],ft="CSS1Compat"===t.compatMode&&ut||t.body[rt]||ut,y={},ct=s[s.length-1],et=(new Date).getTime(),tt,d,nt,l,it;if(r&&h&&w>et-h)return n.clearTimeout(p),p=n.setTimeout(v,w),void 0;h=et;for(tt in f)if(f.hasOwnProperty(tt)){var a=f[tt],b=a.minw,k=a.maxw,ot=null===b,st=null===k,ht="em";b&&(b=parseFloat(b)*(b.indexOf(ht)>-1?c||g():1));k&&(k=parseFloat(k)*(k.indexOf(ht)>-1?c||g():1));a.hasquery&&(ot&&st||!(ot||ft>=b)||!(st||k>=ft))||(y[a.media]||(y[a.media]=[]),y[a.media].push(e[a.rules]))}for(d in i)i.hasOwnProperty(d)&&i[d]&&i[d].parentNode===o&&o.removeChild(i[d]);for(nt in y)y.hasOwnProperty(nt)&&(l=t.createElement("style"),it=y[nt].join("\n"),l.type="text/css",l.media=nt,o.insertBefore(l,ct.nextSibling),l.styleSheet?l.styleSheet.cssText=it:l.appendChild(t.createTextNode(it)),i.push(l))},tt=function(n,t){var i=it();i&&(i.open("GET",n,!0),i.onreadystatechange=function(){4!==i.readyState||200!==i.status&&304!==i.status||t(i.responseText)},4!==i.readyState&&i.send(null))},it=function(){var t=!1;try{t=new n.XMLHttpRequest}catch(i){t=new n.ActiveXObject("Microsoft.XMLHTTP")}return function(){return t}}();b();r.update=b;n.addEventListener?n.addEventListener("resize",y,!1):n.attachEvent&&n.attachEvent("onresize",y)}})(this)