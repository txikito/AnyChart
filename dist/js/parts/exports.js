if(!_.exports){_.exports=1;(function($){var KP,LP,MP,OP,PP,ida,RP,SP,UP,VP,WP,XP,YP,ZP,jda,aQ,bQ,cQ,eQ,gQ,mda,fQ,hQ,nda,kQ,iQ,jQ,kda,mQ,qQ,pda,sQ,oQ,rQ,tQ,pQ,uQ,vQ,xQ,yQ,zQ,wQ,AQ,rda,uda,sda,EQ,GQ,LQ,HQ,FQ,IQ,JQ,OQ,QQ,RQ,SQ,TQ,UQ,VQ,XQ,ZQ,aR,cR,eR,gR,hR,iR,JP,NP,QP,TP,wda,dQ;KP=function(a){if(JP[a])return JP[a];a=String(a);if(!JP[a]){var b=/function ([^\(]+)/.exec(a);JP[a]=b?b[1]:"[Anonymous]"}return JP[a]};
LP=function(a,b){var c=[];if($.cb(b,a))c.push("[...circular reference...]");else if(a&&50>b.length){c.push(KP(a)+"(");for(var d=a.arguments,e=0;d&&e<d.length;e++){0<e&&c.push(", ");var f;f=d[e];switch(typeof f){case "object":f=f?"object":"null";break;case "string":break;case "number":f=String(f);break;case "boolean":f=f?"true":"false";break;case "function":f=(f=KP(f))?f:"[fn]";break;default:f=typeof f}40<f.length&&(f=f.substr(0,40)+"...");c.push(f)}b.push(a);c.push(")\n");try{c.push(LP(a.caller,b))}catch(h){c.push("[exception trying to get caller]\n")}}else a?
c.push("[...long stack...]"):c.push("[end]");return c.join("")};MP=function(a,b){var c;a&&(c=$.cf("STYLE"),c.type="text/css",c.styleSheet?c.styleSheet.cssText=a:c.appendChild(window.document.createTextNode(String(a))),$.nf($.Re("head",void 0,b)[0],c,0))};OP=function(){NP&&(window.document.body.removeChild(NP),NP=null)};
PP=function(a){var b;b=Error();if(Error.captureStackTrace)Error.captureStackTrace(b,a||PP),b=String(b.stack);else{try{throw b;}catch(c){b=c}b=(b=b.stack)?String(b):null}b||(b=LP(a||arguments.callee.caller,[]));return b};
ida=function(){if(NP){var a=NP,b=a.contentWindow;$.dp?(QP=window.open(),QP.document.write(b.document.documentElement.innerHTML),OP(),QP.onafterprint=function(){(0,window.setTimeout)(function(){QP.close()},0)},(0,window.setTimeout)(function(){QP.focus();QP.print()},0)):$.ed?(0,window.setTimeout)(function(){$.Nf(a,"visibility","");b.onafterprint=OP;b.focus();b.print()},0):($.Aj(OP,6),b.focus(),b.print())}};
RP=function(){if(!NP){var a=window.document.createElement("iframe");NP=a;$.Nf(a,{visibility:"hidden",position:"fixed",right:0,bottom:0});window.document.body.appendChild(a);for(var b=$.bk(),c,d=0,e=b.length;d<e;d++)if(c=b[d],5==c.type){var f="";c.cssText?f=c.cssText:c.style&&c.style.cssText&&c.selectorText&&(f=c.style.cssText.replace(/\s*-closure-parent-stylesheet:\s*\[object\];?\s*/gi,"").replace(/\s*-closure-rule-index:\s*[\d]+;?\s*/gi,""),f=c.selectorText+" { "+f+" }");MP(f,a.contentWindow.document)}MP("body{padding:0;margin:0;height:100%;}@page {size: auto; margin: 0; padding:0}",
a.contentWindow.document)}return NP};SP=function(a){if(a instanceof $.ue)return a;a=$.xe(a);var b;b=$.ve(a);b=$.Ea(b.replace(/  /g," &#160;"),void 0);return $.we(b,a.Yv())};
UP=function(a,b,c){$.n(c)||(c="a4");c=TP[c];$.n(a)&&$.n(b)?$.C(a)&&$.pa(b)?(a=a.toLowerCase(),(a=TP[a])&&(b?c={width:a.height,height:a.width}:c=a)):(c.width=String(a),c.height=String(b)):$.n(a)&&(a=TP[String(a)])&&(c=a);$.za(c.width,"px")||$.za(c.width,"mm")||(c.width+="px");$.za(c.height,"px")||$.za(c.height,"mm")||(c.height+="px");return c};
VP=function(a){if(a.Vn&&"function"==typeof a.Vn)return a.Vn();if(!a.Qm||"function"!=typeof a.Qm){if($.na(a)||$.C(a)){var b=[];a=a.length;for(var c=0;c<a;c++)b.push(c);return b}return $.Ic(a)}};WP=function(a){if(a.Qm&&"function"==typeof a.Qm)return a.Qm();if($.C(a))return a.split("");if($.na(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return $.Hc(a)};
XP=function(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if($.na(a)||$.C(a))(0,$.Je)(a,b,void 0);else for(var c=VP(a),d=WP(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)};YP=function(a,b,c){var d={};b="object"==$.la(b)?b:null;$.Fc(a,function(a,f){d[f]=b?$.n(b[f])?b[f]:void 0:a;$.n(c)&&(d[f]=d[f]||c[f])});return d};ZP=function(a){return a.contentDocument||a.contentWindow.document};
jda=function(a,b){if(a)for(var c=a.split("&"),d=0;d<c.length;d++){var e=c[d].indexOf("="),f,h=null;0<=e?(f=c[d].substring(0,e),h=c[d].substring(e+1)):f=c[d];b(f,h?(0,window.decodeURIComponent)(h.replace(/\+/g," ")):"")}};
$.$P=function(a,b){this.U=this.J=this.o="";this.F=null;this.B=this.b="";this.g=!1;var c;a instanceof $.$P?(this.g=$.n(b)?b:a.g,aQ(this,a.o),this.J=a.J,this.U=a.U,bQ(this,a.F),this.b=a.b,cQ(this,a.j.clone()),this.B=a.B):a&&(c=String(a).match(dQ))?(this.g=!!b,aQ(this,c[1]||"",!0),this.J=eQ(c[2]||""),this.U=eQ(c[3]||"",!0),bQ(this,c[4]),this.b=eQ(c[5]||"",!0),cQ(this,c[6]||"",!0),this.B=eQ(c[7]||"")):(this.g=!!b,this.j=new fQ(null,0,this.g))};
aQ=function(a,b,c){a.o=c?eQ(b,!0):b;a.o&&(a.o=a.o.replace(/:$/,""))};bQ=function(a,b){if(b){b=Number(b);if((0,window.isNaN)(b)||0>b)throw Error("Bad port number "+b);a.F=b}else a.F=null};cQ=function(a,b,c){b instanceof fQ?(a.j=b,kda(a.j,a.g)):(c||(b=gQ(b,lda)),a.j=new fQ(b,0,a.g))};eQ=function(a,b){return a?b?(0,window.decodeURI)(a.replace(/%25/g,"%2525")):(0,window.decodeURIComponent)(a):""};
gQ=function(a,b,c){return $.C(a)?(a=(0,window.encodeURI)(a).replace(b,mda),c&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null};mda=function(a){a=a.charCodeAt(0);return"%"+(a>>4&15).toString(16)+(a&15).toString(16)};fQ=function(a,b,c){this.g=this.b=null;this.j=a||null;this.o=!!c};hQ=function(a){a.b||(a.b=new $.Gy,a.g=0,a.j&&jda(a.j,function(b,c){a.add((0,window.decodeURIComponent)(b.replace(/\+/g," ")),c)}))};
nda=function(a){var b=VP(a);if("undefined"==typeof b)throw Error("Keys are undefined");var c=new fQ(null,0,void 0);a=WP(a);for(var d=0;d<b.length;d++){var e=b[d],f=a[d];$.z(f)?iQ(c,e,f):c.add(e,f)}return c};kQ=function(a,b){hQ(a);b=jQ(a,b);return $.Hy(a.b.g,b)};iQ=function(a,b,c){a.remove(b);0<c.length&&(a.j=null,a.b.set(jQ(a,b),$.mb(c)),a.g+=c.length)};jQ=function(a,b){var c=String(b);a.o&&(c=c.toLowerCase());return c};
kda=function(a,b){b&&!a.o&&(hQ(a),a.j=null,a.b.forEach(function(a,b){var c=b.toLowerCase();b!=c&&(this.remove(b),iQ(this,c,a))},a));a.o=b};mQ=function(){$.Hf.call(this);this.Ye="closure_frame"+oda++;this.g=[];lQ[this.Ye]=this};
qQ=function(a,b){var c=new mQ;$.Id(c,"ready",c.Pc,!1,c);if(c.zp)throw Error("[goog.net.IframeIo] Unable to send, already active.");var d=new $.$P(a);c.EU=d;if(!nQ){nQ=$.cf("FORM");nQ.acceptCharset="utf-8";var e=nQ.style;e.position="absolute";e.visibility="hidden";e.top=e.left="-10px";e.width=e.height="10px";e.overflow="hidden";window.document.body.appendChild(nQ)}c.lh=nQ;b&&pda(c.lh,b);c.lh.action=d.toString();c.lh.method="POST";c.zp=!0;c.Ct=c.Ye+"_"+(c.Jba++).toString(36);d={name:c.Ct,id:c.Ct};$.ed&&
7>Number($.Zc)&&(d.src='javascript:""');c.oi=$.Ne(c.lh).Lb("IFRAME",d);d=c.oi.style;d.visibility="hidden";d.width=d.height="10px";d.display="none";$.od?d.marginTop=d.marginLeft="-10px":(d.position="absolute",d.top=d.left="-10px");if($.ed&&!$.$c("11")){c.lh.target=c.Ct||"";$.Ne(c.lh).b.body.appendChild(c.oi);$.Id(c.oi,"readystatechange",c.vM,!1,c);try{c.b=!1,c.lh.submit()}catch(aa){$.Ud(c.oi,"readystatechange",c.vM,!1,c),oQ(c)}}else{$.Ne(c.lh).b.body.appendChild(c.oi);var d=c.Ct+"_inner",e=ZP(c.oi),
f;window.document.baseURI?(f=$.Ma(d),$.fe("Short HTML snippet, input escaped, safe URL, for performance"),f='<head><base href="'+$.Ma(window.document.baseURI)+'"></head><body><iframe id="'+f+'" name="'+f+'"></iframe>',f=$.we(f,null)):(f=$.Ma(d),$.fe("Short HTML snippet, input escaped, for performance"),f=$.we('<body><iframe id="'+f+'" name="'+f+'"></iframe>',null));$.Pf&&!$.od?e.documentElement.innerHTML=$.ve(f):e.write($.ve(f));$.Id(e.getElementById(d),"load",c.sF,!1,c);var h=$.Pe("TEXTAREA",c.lh);
f=0;for(var k=h.length;f<k;f++){var l=h[f].value;$.Bf(h[f])!=l&&($.yf(h[f],l),h[f].value=l)}h=e.importNode(c.lh,!0);h.target=d;h.action=c.lh.action;e.body.appendChild(h);var l=$.Pe("SELECT",c.lh),m=$.Pe("SELECT",h);f=0;for(k=l.length;f<k;f++)for(var p=$.Pe("OPTION",l[f]),q=$.Pe("OPTION",m[f]),r=0,t=p.length;r<t;r++)q[r].selected=p[r].selected;l=$.Pe("INPUT",c.lh);m=$.Pe("INPUT",h);f=0;for(k=l.length;f<k;f++)if("file"==l[f].type&&l[f].value!=m[f].value){c.lh.target=d;h=c.lh;break}try{c.b=!1,h.submit(),
e.close(),$.dd&&$.Aj(c.LX,250,c)}catch(aa){var u;try{var v;var w=$.ha("window.location.href");if($.C(aa))v={message:aa,name:"Unknown error",lineNumber:"Not available",fileName:w,stack:"Not available"};else{var x,A;f=!1;try{x=aa.lineNumber||aa.ic||"Not available"}catch(ea){x="Not available",f=!0}try{A=aa.fileName||aa.filename||aa.sourceURL||$.y.$googDebugFname||w}catch(ea){A="Not available",f=!0}v=!f&&aa.lineNumber&&aa.fileName&&aa.stack&&aa.message&&aa.name?aa:{message:aa.message||"Not available",
name:aa.name||"UnknownError",lineNumber:x,fileName:A,stack:aa.stack||"Not available"}}var D;var O=v.fileName;null!=O||(O="");if(/^https?:\/\//i.test(O)){var Q=$.qe(O);$.fe("view-source scheme plus HTTP/HTTPS URL");var P="view-source:"+$.le(Q);D=$.pe(P)}else{var ba=$.fe("sanitizedviewsrc");D=$.pe($.ee(ba))}u=$.Fe(SP("Message: "+v.message+"\nUrl: "),$.Ie("a",{href:D,target:"_new"},v.fileName),SP("\nLine: "+v.lineNumber+"\n\nBrowser stack:\n"+v.stack+"-> [end]\n\nJS stack traversal:\n"+PP(void 0)+"-> "))}catch(ea){u=
SP("Exception trying to expose exception! You win, we lose. "+ea)}$.ve(u);$.Ud(e.getElementById(d),"load",c.sF,!1,c);e.close();oQ(c)}}pQ(c)};pda=function(a,b){var c=$.Ne(a);XP(b,function(b,e){$.z(b)||(b=[b]);(0,$.Je)(b,function(b){b=c.Lb("INPUT",{type:"hidden",name:e,value:b});a.appendChild(b)})})};
sQ=function(a,b){a.zp=!1;var c;try{var d=b.body;a.qV=d.textContent||d.innerText}catch(e){c=1}c||"function"!=typeof a.j||(d=a.j(b))&&(c=4);c?oQ(a):(a.dispatchEvent("complete"),a.dispatchEvent("success"),rQ(a))};oQ=function(a){a.b||(a.zp=!1,a.dispatchEvent("complete"),a.dispatchEvent("error"),rQ(a),a.b=!0)};rQ=function(a){tQ(a);pQ(a);a.lh=null;a.dispatchEvent("ready")};
tQ=function(a){var b=a.oi;b&&(b.onreadystatechange=null,b.onload=null,b.onerror=null,a.g.push(b));a.Bt&&($.Bj(a.Bt),a.Bt=null);$.dd||$.Pf&&!$.od?a.Bt=$.Aj(a.qT,2E3,a):a.qT();a.oi=null;a.Ct=null};pQ=function(a){a.lh&&a.lh==nQ&&$.lf(a.lh)};uQ=function(a){return a.oi?$.ed&&!$.$c("11")?a.oi:ZP(a.oi).getElementById(a.Ct+"_inner"):null};vQ=function(){};xQ=function(a){var b;(b=a.b)||(b={},wQ(a)&&(b[0]=!0,b[1]=!0),b=a.b=b);return b};yQ=function(){};
zQ=function(a){return(a=wQ(a))?new window.ActiveXObject(a):new window.XMLHttpRequest};wQ=function(a){if(!a.g&&"undefined"==typeof window.XMLHttpRequest&&"undefined"!=typeof window.ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new window.ActiveXObject(d),a.g=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.g};
AQ=function(a){$.Hf.call(this);this.headers=new $.Gy;this.ka=a||null;this.g=!1;this.K=this.b=null;this.ha=this.X="";this.j=0;this.U="";this.o=this.$=this.F=this.P=!1;this.B=0;this.J=null;this.ca=qda;this.aa=this.da=!1};$.CQ=function(a,b,c,d,e,f,h){var k=new AQ;BQ.push(k);b&&k.pa("complete",b);k.Hd("ready",k.G8);f&&(k.B=Math.max(0,f));h&&(k.da=h);rda(k,a,c,d,e)};
rda=function(a,b,c,d,e){if(a.b)throw Error("[goog.net.XhrIo] Object is active with another request="+a.X+"; newUri="+b);c=c?c.toUpperCase():"GET";a.X=b;a.U="";a.j=0;a.ha=c;a.P=!1;a.g=!0;a.b=a.ka?zQ(a.ka):zQ(DQ);a.K=a.ka?xQ(a.ka):xQ(DQ);a.b.onreadystatechange=(0,$.va)(a.$V,a);try{a.$=!0,a.b.open(c,String(b),!0),a.$=!1}catch(h){EQ(a,h);return}b=d||"";var f=a.headers.clone();e&&XP(e,function(a,b){f.set(b,a)});e=$.$a(f.Vn(),sda);d=$.y.FormData&&b instanceof $.y.FormData;!$.cb(tda,c)||e||d||f.set("Content-Type",
"application/x-www-form-urlencoded;charset=utf-8");f.forEach(function(a,b){this.b.setRequestHeader(b,a)},a);a.ca&&(a.b.responseType=a.ca);"withCredentials"in a.b&&a.b.withCredentials!==a.da&&(a.b.withCredentials=a.da);try{FQ(a),0<a.B&&(a.aa=uda(a.b),a.aa?(a.b.timeout=a.B,a.b.ontimeout=(0,$.va)(a.QX,a)):a.J=$.Aj(a.QX,a.B,a)),a.F=!0,a.b.send(b),a.F=!1}catch(h){EQ(a,h)}};uda=function(a){return $.ed&&$.$c(9)&&$.E(a.timeout)&&$.n(a.ontimeout)};sda=function(a){return $.Aa("Content-Type",a)};
EQ=function(a,b){a.g=!1;a.b&&(a.o=!0,a.b.abort(),a.o=!1);a.U=b;a.j=5;GQ(a);HQ(a)};GQ=function(a){a.P||(a.P=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))};LQ=function(a){if(a.g&&"undefined"!=typeof $.wz&&(!a.K[1]||4!=IQ(a)||2!=JQ(a)))if(a.F&&4==IQ(a))$.Aj(a.$V,0,a);else if(a.dispatchEvent("readystatechange"),4==IQ(a)){a.g=!1;try{if($.KQ(a))a.dispatchEvent("complete"),a.dispatchEvent("success");else{a.j=6;var b;try{b=2<IQ(a)?a.b.statusText:""}catch(c){b=""}a.U=b+" ["+JQ(a)+"]";GQ(a)}}finally{HQ(a)}}};
HQ=function(a,b){if(a.b){FQ(a);var c=a.b,d=a.K[0]?$.ia:null;a.b=null;a.K=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(e){}}};FQ=function(a){a.b&&a.aa&&(a.b.ontimeout=null);$.E(a.J)&&($.Bj(a.J),a.J=null)};
$.KQ=function(a){var b=JQ(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}if(!c){if(b=!b)a=String(a.X).match(dQ)[1]||null,!a&&$.y.self&&$.y.self.location&&(a=$.y.self.location.protocol,a=a.substr(0,a.length-1)),b=!vda.test(a?a.toLowerCase():"");c=b}return c};IQ=function(a){return a.b?a.b.readyState:0};JQ=function(a){try{return 2<IQ(a)?a.b.status:-1}catch(b){return-1}};$.MQ=function(a){if(a.b)return $.Un(a.b.responseText)};
$.NQ=function(a){return $.C(a.U)?a.U:String(a.U)};OQ=function(a,b,c){var d=a.width()/a.height();b=$.n(b)?b:c?Math.round(c*d):a.width();c=$.n(c)?c:b?Math.round(b/d):a.height();return{width:b,height:c}};QQ=function(a,b,c,d,e,f){c&&(b.responseType="base64");d&&(b.save=!0);var h=f||$.ia,k=d?"url":"result";b=nda(new $.Gy(b));$.CQ(PQ+"/"+a,function(a){a=a.target;$.KQ(a)?e($.MQ(a)[k]):h($.NQ(a))},"POST",b.toString())};
RQ=function(a,b,c,d,e,f){c=OQ(a,c,d);b.data=a.ms(c.width,c.height);b.dataType="svg";b.responseType="file";b.width=c.width;b.height=c.height;$.n(e)&&(b.quality=e);$.n(f)&&(b["file-name"]=f)};SQ=function(a,b,c,d,e,f,h){c=OQ(a,c,d);b.data=a.ms(c.width,c.height);b.dataType="svg";b.responseType="file";b.width=c.width;b.height=c.height;$.n(e)&&(b.quality=e);$.n(f)&&(b["force-transparent-white"]=f);$.n(h)&&(b["file-name"]=h)};
TQ=function(a,b,c,d,e){b.data=a.ms(c,d);b.dataType="svg";b.responseType="file";$.n(e)&&(b["file-name"]=e)};
UQ=function(a,b,c,d,e,f,h){var k=null;$.n(c)?$.E(c)?(b["pdf-width"]=c,b["pdf-height"]=$.E(d)?d:a.height()):$.C(c)?(b["pdf-size"]=c||"a4",b.landscape=!!d,k=wda[b["pdf-size"]],b.landscape&&(k={width:k.height,height:k.width})):(b["pdf-width"]=a.width(),b["pdf-height"]=a.height()):(b["pdf-width"]=a.width(),b["pdf-height"]=a.height());$.n(e)&&(b["pdf-x"]=e);$.n(f)&&(b["pdf-y"]=f);$.n(h)&&(b["file-name"]=h);k?(c=k.width,k=k.height,d=a.width(),h=a.height(),k=c<k?[c,c/d*h]:c>k?[k/h*d,k]:[c,k],k[0]-=e||0,
k[1]-=f||0,a=a.ms(k[0],k[1])):a=a.ms(b["pdf-width"],b["pdf-height"]);b.data=a;b.dataType="svg";b.responseType="file"};VQ=function(a){var b="";a&&(b=(new window.XMLSerializer).serializeToString(a));return b};XQ=function(a){$.n(a)&&(WQ=a);return WQ};ZQ=function(a,b){return YQ=YP({width:a,height:b},a,YQ)};aR=function(a,b,c,d,e,f,h){return $Q=YP({caption:a,link:b,name:c,description:d,width:e,height:f,appId:h},a,$Q)};cR=function(a,b,c){return bR=YP({url:a,width:b,height:c},a,bR)};
eR=function(a,b,c,d){return dR=YP({caption:a,description:b,width:c,height:d},a,dR)};gR=function(a,b,c,d){return fR=YP({link:a,description:b,width:c,height:d},a,fR)};hR=function(a,b,c){return(a=a?a.Ea():null)?(b=YP({paperSize:b,width:b,landscape:c,height:c},b,{width:ZQ().width,height:ZQ().height}),a.ms(b.paperSize||b.width,b.landscape||b.height)):""};
iR=function(a,b,c,d,e,f,h,k){if(a=a?a.Ea():null)b=YP({onSuccess:b,onError:c,asBase64:d,width:e,height:f,quality:h,filename:k},b,{width:ZQ().width,height:ZQ().height,filename:XQ()}),a.QO(b.onSuccess,b.onError,b.asBase64,b.width,b.height,b.quality,b.filename)};JP={};NP=null;QP=null;
TP={usletter:{width:"215.9mm",height:"279.4mm"},a0:{width:"841mm",height:"1189mm"},a1:{width:"594mm",height:"841mm"},a2:{width:"420mm",height:"594mm"},a3:{width:"297mm",height:"420mm"},a4:{width:"210mm",height:"279mm"},a5:{width:"148mm",height:"210mm"},a6:{width:"105mm",height:"148mm"}};
wda={a0:{width:2384,height:3370},a1:{width:1684,height:2384},a2:{width:1191,height:1684},a3:{width:842,height:1191},a4:{width:595,height:842},a5:{width:420,height:595},a6:{width:297,height:420},a7:{width:210,height:297},a8:{width:48,height:210},a9:{width:105,height:148},b0:{width:2834,height:4008},b1:{width:2004,height:2834},b2:{width:1417,height:2004},b3:{width:1E3,height:1417},b4:{width:708,height:1E3},b5:{width:498,height:708},b6:{width:354,height:498},b7:{width:249,height:354},b8:{width:175,height:249},
b9:{width:124,height:175},"arch-a":{width:648,height:864},"arch-b":{width:864,height:1296},"arch-c":{width:1296,height:1728},"arch-d":{width:1728,height:2592},"arch-e":{width:2592,height:3456},"crown-octavo":{width:348,height:527},"crown-quarto":{width:535,height:697},"demy-octavo":{width:391,height:612},"demy-quarto":{width:620,height:782},"royal-octavo":{width:442,height:663},"royal-quarto":{width:671,height:884},executive:{width:522,height:756},halfletter:{width:396,height:612},ledger:{width:1224,
height:792},legal:{width:612,height:1008},letter:{width:612,height:792},tabloid:{width:792,height:1224}};dQ=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;$.$P.prototype.toString=function(){var a=[],b=this.o;b&&a.push(gQ(b,jR,!0),":");var c=this.U;if(c||"file"==b)a.push("//"),(b=this.J)&&a.push(gQ(b,jR,!0),"@"),a.push((0,window.encodeURIComponent)(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.F,null!=c&&a.push(":",String(c));if(c=this.b)this.U&&"/"!=c.charAt(0)&&a.push("/"),a.push(gQ(c,"/"==c.charAt(0)?xda:yda,!0));(c=this.j.toString())&&a.push("?",c);(c=this.B)&&a.push("#",gQ(c,zda));return a.join("")};$.$P.prototype.clone=function(){return new $.$P(this)};
var jR=/[#\/\?@]/g,yda=/[\#\?:]/g,xda=/[\#\?]/g,lda=/[\#\?@]/g,zda=/#/g;$.g=fQ.prototype;$.g.Wv=function(){hQ(this);return this.g};$.g.add=function(a,b){hQ(this);this.j=null;a=jQ(this,a);var c=this.b.get(a);c||this.b.set(a,c=[]);c.push(b);this.g+=1;return this};$.g.remove=function(a){hQ(this);a=jQ(this,a);return $.Hy(this.b.g,a)?(this.j=null,this.g-=this.b.get(a).length,this.b.remove(a)):!1};$.g.clear=function(){this.b=this.j=null;this.g=0};$.g.Vf=function(){hQ(this);return 0==this.g};
$.g.Vn=function(){hQ(this);for(var a=this.b.Qm(),b=this.b.Vn(),c=[],d=0;d<b.length;d++)for(var e=a[d],f=0;f<e.length;f++)c.push(b[d]);return c};$.g.Qm=function(a){hQ(this);var b=[];if($.C(a))kQ(this,a)&&(b=$.jb(b,this.b.get(jQ(this,a))));else{a=this.b.Qm();for(var c=0;c<a.length;c++)b=$.jb(b,a[c])}return b};$.g.set=function(a,b){hQ(this);this.j=null;a=jQ(this,a);kQ(this,a)&&(this.g-=this.b.get(a).length);this.b.set(a,[b]);this.g+=1;return this};
$.g.get=function(a,b){var c=a?this.Qm(a):[];return 0<c.length?String(c[0]):b};$.g.toString=function(){if(this.j)return this.j;if(!this.b)return"";for(var a=[],b=this.b.Vn(),c=0;c<b.length;c++)for(var d=b[c],e=(0,window.encodeURIComponent)(String(d)),d=this.Qm(d),f=0;f<d.length;f++){var h=e;""!==d[f]&&(h+="="+(0,window.encodeURIComponent)(String(d[f])));a.push(h)}return this.j=a.join("&")};$.g.clone=function(){var a=new fQ;a.j=this.j;this.b&&(a.b=this.b.clone(),a.g=this.g);return a};var nQ;$.H(mQ,$.Hf);var lQ={},oda=0;$.g=mQ.prototype;$.g.lh=null;$.g.oi=null;$.g.Ct=null;$.g.Jba=0;$.g.zp=!1;$.g.EU=null;$.g.qV=null;$.g.Bt=null;$.g.abort=function(){this.zp&&($.Wd(uQ(this)),this.zp=!1,this.dispatchEvent("abort"),rQ(this))};$.g.ba=function(){this.zp&&this.abort();mQ.G.ba.call(this);this.oi&&tQ(this);pQ(this);delete this.j;this.EU=this.qV=this.lh=null;delete lQ[this.Ye]};$.g.wk=function(){return this.zp};
$.g.vM=function(){if("complete"==this.oi.readyState){$.Ud(this.oi,"readystatechange",this.vM,!1,this);var a;try{if(a=ZP(this.oi),$.ed&&"about:blank"==a.location&&!window.navigator.onLine){oQ(this);return}}catch(b){oQ(this);return}sQ(this,a)}};$.g.sF=function(){if(!$.Pf||$.od||"about:blank"!=(this.oi?ZP(uQ(this)):null).location){$.Ud(uQ(this),"load",this.sF,!1,this);try{sQ(this,this.oi?ZP(uQ(this)):null)}catch(a){oQ(this)}}};
$.g.qT=function(){this.Bt&&($.Bj(this.Bt),this.Bt=null);for(;this.g.length;){var a=this.g.pop();$.of(a)}};$.g.LX=function(){if(this.zp){var a=this.oi?ZP(uQ(this)):null;a&&!$.Tc(a,"documentUri")?($.Ud(uQ(this),"load",this.sF,!1,this),oQ(this)):$.Aj(this.LX,250,this)}};vQ.prototype.b=null;var DQ;$.H(yQ,vQ);DQ=new yQ;$.H(AQ,$.Hf);var qda="",vda=/^https?$/i,tda=["POST","PUT"],BQ=[];$.g=AQ.prototype;$.g.G8=function(){this.Pc();$.hb(BQ,this)};$.g.QX=function(){"undefined"!=typeof $.wz&&this.b&&(this.U="Timed out after "+this.B+"ms, aborting",this.j=8,this.dispatchEvent("timeout"),this.abort(8))};$.g.abort=function(a){this.b&&this.g&&(this.g=!1,this.o=!0,this.b.abort(),this.o=!1,this.j=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),HQ(this))};
$.g.ba=function(){this.b&&(this.g&&(this.g=!1,this.o=!0,this.b.abort(),this.o=!1),HQ(this,!0));AQ.G.ba.call(this)};$.g.$V=function(){this.Bd||(this.$||this.F||this.o?LQ(this):this.yca())};$.g.yca=function(){LQ(this)};$.g.wk=function(){return!!this.b};var PQ="//export.anychart.com";$.g=$.Tj.prototype;$.g.QO=function(a,b,c,d,e,f,h){if("svg"==$.fk){var k={};RQ(this,k,d,e,f,h);QQ("png",k,!!c,!0,a,b)}else(0,window.alert)($.hd(15))};$.g.OO=function(a,b,c,d,e,f,h,k){if("svg"==$.fk){var l={};SQ(this,l,d,e,f,h,k);QQ("jpg",l,!!c,!0,a,b)}else(0,window.alert)($.hd(15))};$.g.RO=function(a,b,c,d,e,f){if("svg"==$.fk){var h={};TQ(this,h,d,e,f);QQ("svg",h,!!c,!0,a,b)}else(0,window.alert)($.hd(15))};
$.g.PO=function(a,b,c,d,e,f,h,k){if("svg"==$.fk){var l={};UQ(this,l,d,e,f,h,k);QQ("pdf",l,!!c,!0,a,b)}else(0,window.alert)($.hd(15))};$.g.MO=function(a,b,c,d,e){if("svg"==$.fk){var f={};RQ(this,f,c,d,e);QQ("png",f,!0,!1,a,b)}else(0,window.alert)($.hd(15))};$.g.KO=function(a,b,c,d,e,f){if("svg"==$.fk){var h={};SQ(this,h,c,d,e,f);QQ("jpg",h,!0,!1,a,b)}else(0,window.alert)($.hd(15))};$.g.NO=function(a,b,c,d){if("svg"==$.fk){var e={};TQ(this,e,c,d);QQ("svg",e,!0,!1,a,b)}else(0,window.alert)($.hd(15))};
$.g.LO=function(a,b,c,d,e,f){if("svg"==$.fk){var h={};UQ(this,h,c,d,e,f);QQ("pdf",h,!0,!1,a,b)}else(0,window.alert)($.hd(15))};$.g.fu=function(a,b,c,d){if("svg"==$.fk){var e={};RQ(this,e,a,b,c,d);qQ(PQ+"/png",e)}else(0,window.alert)($.hd(15))};$.g.du=function(a,b,c,d,e){if("svg"==$.fk){var f={};SQ(this,f,a,b,c,d,e);qQ(PQ+"/jpg",f)}else(0,window.alert)($.hd(15))};$.g.eu=function(a,b,c,d,e){if("svg"==$.fk){var f={};UQ(this,f,a,b,c,d,e);qQ(PQ+"/pdf",f)}else(0,window.alert)($.hd(15))};
$.g.gu=function(a,b,c){if("svg"==$.fk){var d={};TQ(this,d,a,b,c);qQ(PQ+"/svg",d)}else(0,window.alert)($.hd(15))};
$.g.print=function(a,b){if($.n(a)||$.n(b)){var c=UP(a,b,"us-letter"),d=RP().contentWindow.document,e=$.cf("DIV");$.Nf(e,{width:c.width,height:c.height});d.body.appendChild(e);var c=this.width(),d=this.height(),f=$.lg(e);this.Hu(f.width,f.height);f=this.ia();"svg"==f.tagName&&f.cloneNode?(f=f.cloneNode(!0),e.appendChild(f)):$.gk(e).data(this.data());this.Hu(c,d)}else e=RP().contentWindow.document,d=this.ia(),"svg"==d.tagName?d.cloneNode?c=d.cloneNode(!0):(d=$.gk(e.body),d.data(this.data()),c=d.ia()):
(d=$.gk(e.body),d.data(this.data())),d=$.mh(),f=c,d.Ib(f,"width","100%"),d.Ib(f,"height","100%"),d.Ib(f,"viewBox","0 0 "+this.width()+" "+this.height()),$.Nf(f,"width","100%"),$.Nf(f,"height",""),$.Nf(f,"max-height","100%"),e.body.appendChild(c);ida()};
$.g.ms=function(a,b){if("svg"!=$.fk)return"";var c;if($.n(a)||$.n(b)){c=UP(a,b);var d=$.vf(this.ia()),e=$.Qf(d,"width"),d=$.Qf(d,"height");this.Hu(c.width,c.height);c=VQ(this.ia());this.Hu(e,d)}else $.mh().hG(this.ia(),this.width(),this.height()),c=VQ(this.ia()),$.mh().hG(this.ia(),"100%","100%");return'<?xml version="1.0" encoding="UTF-8" standalone="no"?>'+c};$.G("acgraph.server",function(a){$.n(a)&&(PQ=a);return PQ});var kR=$.Tj.prototype;kR.saveAsPNG=kR.fu;kR.saveAsJPG=kR.du;kR.saveAsPDF=kR.eu;
kR.saveAsSVG=kR.gu;kR.saveAsPng=kR.fu;kR.saveAsJpg=kR.du;kR.saveAsPdf=kR.eu;kR.saveAsSvg=kR.gu;kR.shareAsPng=kR.QO;kR.shareAsJpg=kR.OO;kR.shareAsPdf=kR.PO;kR.shareAsSvg=kR.RO;kR.getPngBase64String=kR.MO;kR.getJpgBase64String=kR.KO;kR.getSvgBase64String=kR.NO;kR.getPdfBase64String=kR.LO;kR.print=kR.print;kR.toSvg=kR.ms;var WQ="anychart",YQ={width:void 0,height:void 0},$Q={caption:window.location.hostname,link:void 0,name:void 0,description:void 0,appId:0x42607363aa4b7,width:1200,height:630},bR={url:"https://export.anychart.com/sharing/twitter",width:1024,height:800},dR={caption:"AnyChart",description:void 0,width:1200,height:630},fR={link:void 0,description:void 0,width:1200,height:800};
$.G("anychart.exports",{filename:XQ,image:ZQ,facebook:aR,twitter:cR,linkedin:eR,pinterest:gR,server:$.y.acgraph.server,saveAsPng:function(a,b,c,d,e){if(a=a?a.Ea():null)b=YP({width:b,height:c,quality:d,filename:e},b,{width:ZQ().width,height:ZQ().height,filename:XQ()}),a.fu(b.width,b.height,b.quality,b.filename)},saveAsJpg:function(a,b,c,d,e,f){if(a=a?a.Ea():null)b=YP({width:b,height:c,quality:d,forceTransparentWhite:e,filename:f},b,{width:ZQ().width,height:ZQ().height,filename:XQ()}),a.du(b.width,
b.height,b.quality,b.forceTransparentWhite,b.filename)},saveAsPdf:function(a,b,c,d,e,f){if(a=a?a.Ea():null)b=YP({paperSize:b,width:b,landscape:c,height:c,x:d,y:e,filename:f},b,{width:ZQ().width,height:ZQ().height,filename:XQ()}),a.eu(b.paperSize||b.width,b.landscape||b.height,b.x,b.y,b.filename)},saveAsSvg:function(a,b,c,d){if(a=a?a.Ea():null)b=YP({paperSize:b,width:b,landscape:c,height:c,filename:d},b,{width:ZQ().width,height:ZQ().height,filename:XQ()}),a.gu(b.paperSize||b.width,b.landscape||b.height,
b.filename)},toSvg:hR,shareAsPng:iR,shareAsJpg:function(a,b,c,d,e,f,h,k,l){if(a=a?a.Ea():null)b=YP({onSuccess:b,onError:c,asBase64:d,width:e,height:f,quality:h,forceTransparentWhite:k,filename:l},b,{width:ZQ().width,height:ZQ().height,filename:XQ()}),a.OO(b.onSuccess,b.onError,b.asBase64,b.width,b.height,b.quality,b.forceTransparentWhite,b.filename)},shareAsSvg:function(a,b,c,d,e,f,h){if(a=a?a.Ea():null)b=YP({onSuccess:b,onError:c,asBase64:d,paperSize:e,width:e,landscape:f,height:f,filename:h},b,
{width:ZQ().width,height:ZQ().height,filename:XQ()}),a.RO(b.onSuccess,b.onError,b.asBase64,b.paperSize||b.width,b.landscape||b.height,b.filename)},shareAsPdf:function(a,b,c,d,e,f,h,k,l){if(a=a?a.Ea():null)b=YP({onSuccess:b,onError:c,asBase64:d,paperSize:e,width:e,landscape:f,height:f,x:h,y:k,filename:l},b,{width:ZQ().width,height:ZQ().height,filename:XQ()}),a.PO(b.onSuccess,b.onError,b.asBase64,b.paperSize||b.width,b.landscape||b.height,b.x,b.y,b.filename)},getPngBase64String:function(a,b,c,d,e,f){if(a=
a?a.Ea():null)b=YP({onSuccess:b,onError:c,width:d,height:e,quality:f},b,{width:ZQ().width,height:ZQ().height}),a.MO(b.onSuccess,b.onError,b.width,b.height,b.quality)},getJpgBase64String:function(a,b,c,d,e,f,h){if(a=a?a.Ea():null)b=YP({onSuccess:b,onError:c,width:d,height:e,quality:f,forceTransparentWhite:h},b,{width:ZQ().width,height:ZQ().height}),a.KO(b.onSuccess,b.onError,b.width,b.height,b.quality,b.forceTransparentWhite)},getSvgBase64String:function(a,b,c,d,e){if(a=a?a.Ea():null)b=YP({onSuccess:b,
onError:c,paperSize:d,width:d,landscape:e,height:e},b,{width:ZQ().width,height:ZQ().height}),a.NO(b.onSuccess,b.onError,b.paperSize||b.width,b.landscape||b.height)},getPdfBase64String:function(a,b,c,d,e,f,h){if(a=a?a.Ea():null)b=YP({onSuccess:b,onError:c,paperSize:d,width:d,landscape:e,height:e,x:f,y:h},b,{width:ZQ().width,height:ZQ().height}),a.LO(b.onSuccess,b.onError,b.paperSize||b.width,b.landscape||b.height,b.x,b.y)},print:function(a,b,c){if(a=a?a.Ea():null)b=YP({paperSize:b,landscape:c},b),
a.print(b.paperSize,b.landscape)},shareWithFacebook:function(a,b,c,d,e){var f=aR(),h=YP({caption:b,link:c,name:d,description:e},b,f),k=$.af().open("","_blank","scrollbars=yes, width=550, height=550, top="+Number(window.screen.height/2-275)+", left="+Number(window.screen.width/2-275));iR(a,function(a){a={app_id:f.appId,display:"popup",picture:a};a.caption=h.caption;h.link&&(a.link=h.link,h.name&&(a.name=h.name),h.description&&(a.description=h.description));var b="",c;for(c in a)b+=b?"&":"",b+=c+"="+
a[c];k.location.href="https://www.facebook.com/dialog/feed?"+b},void 0,!1,f.width,f.height)},shareWithTwitter:function(a){var b=cR(),c=Number(window.screen.width/2-300),d=Number(window.screen.height/2-260),e,f;e=$.Re("INPUT","ac-share-twitter-data-input");if(0<e.length)f=e[0],e=$.Re("FORM","ac-share-twitter-form")[0];else{e=$.hf(window.document,"FORM");$.Oj(e,"ac-share-twitter-form");e.target="Map";e.method="POST";e.action=b.url;f=$.hf(window.document,"INPUT");$.Oj(f,"ac-share-twitter-data-input");
f.type="hidden";f.name="data";var h=$.hf(window.document,"INPUT");h.type="hidden";h.name="dataType";h.value="svg";e.appendChild(f);e.appendChild(h);$.Pe("BODY")[0].appendChild(e)}$.n(e)&&$.n(f)&&(f.value=hR(a,b.width,b.height),$.af().open("","Map","status=0,title=0,height=520,width=600,scrollbars=1, width=600, height=520, top="+d+", left="+c)&&e.submit())},shareWithLinkedIn:function(a,b,c){var d=eR(),e=YP({caption:b,description:c},b,d),f=$.af().open("","_blank","scrollbars=yes, width=550, height=520, top="+
Number(window.screen.height/2-260)+", left="+Number(window.screen.width/2-275));iR(a,function(a){a={mini:"true",url:a};a.title=e.caption;e.description&&(a.summary=e.description);var b="",c;for(c in a)b+=b?"&":"",b+=c+"="+a[c];f.location.href="https://www.linkedin.com/shareArticle?"+b},void 0,!1,d.width,d.height)},shareWithPinterest:function(a,b,c){var d=gR(),e=YP({link:b,description:c},b,d),f=$.af().open("","_blank","scrollbars=yes, width=550, height=520, top="+Number(window.screen.height/2-260)+
", left="+Number(window.screen.width/2-275));iR(a,function(a){a={media:a};e.link&&(a.url=e.link);e.description&&(a.description=e.description);var b="",c;for(c in a)b+=b?"&":"",b+=c+"="+a[c];f.location.href="https://pinterest.com/pin/create/link?"+b},void 0,!1,d.width,d.height)},saveAsXml:function(a,b){var c={};c["file-name"]=b||XQ();c.data=a;c.dataType="xml";c.responseType="file";qQ(PQ+"/xml",c)},saveAsJson:function(a,b){var c={};c["file-name"]=b||XQ();c.data=a;c.dataType="json";c.responseType="file";
qQ(PQ+"/json",c)},saveAsCsv:function(a,b){var c={};c["file-name"]=b||XQ();c.data=a;c.dataType="csv";c.responseType="file";qQ(PQ+"/csv",c)},saveAsXlsx:function(a,b){var c={};c["file-name"]=b||XQ();c.data=a;c.dataType="xlsx";c.responseType="file";qQ(PQ+"/xlsx",c)}});})($)}