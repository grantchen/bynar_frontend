"use strict";(self.webpackChunkbynar=self.webpackChunkbynar||[]).push([[630],{67630:function(e,t,n){n.r(t),n.d(t,{default:function(){return g}});var i=n(74165),r=n(15861),a=n(29439),o=n(72791),s=n(57689),l=n(452),c=n(67887),d=n(50719),u=n(11459),x=n(80184),h=function(e){var t=e.heading,n=e.loading,i=e.handleFormSubmit,r=e.setErrorNotification,a=e.setServerErrorNotification,o=e.serverErrorNotification,l=e.errorNotification,c=e.showCreateAccount,h=e.createAccoutText,f=e.navigationUrl,g=e.navigationUrlText,p=e.labelText,b=e.labelValue,m=e.setFormLabelState,v=e.buttonText,j=e.enableForgotPassword,N=e.placeholderText,y=e.showRememberId,S=void 0!==y&&y,k=e.navigateToLogin,w=void 0!==k&&k,T=e.text,C=e.subtitle,E=e.setSignInPhaseOne,L=(0,s.s0)();return(0,x.jsxs)("div",{className:"signin-container",children:[(0,x.jsx)("div",{className:"box-container",children:(0,x.jsxs)(d.l09,{onSubmit:i,children:[(0,x.jsxs)("div",{style:{paddingRight:"20px"},children:[(0,x.jsx)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:(0,x.jsx)(d.X6q,{style:{fontSize:"28px",fontWeight:"400"},children:t})}),w&&(0,x.jsxs)("p",{className:"register-text-body-01",children:[T,(0,x.jsxs)(d.rUS,{className:"underlined-link",style:{cursor:"pointer"},onClick:function(){E(!0)},children:[" ",C]})]}),"object"===typeof o&&0!==Object.keys(o).length?(0,x.jsx)(d.Jn6,{className:"error-notification-box",onClose:function(){},onCloseButtonClick:function(){r({}),a({})},statusIconDescription:"notification",title:o.title?o.title:""}):(0,x.jsx)("div",{}),(0,x.jsxs)("div",{className:"login-input-wrapper",children:[j?(0,x.jsxs)(d.lXp,{className:"input-label",children:[p," ",(0,x.jsx)(d.rUS,{style:{cursor:"pointer"},className:"forgot-link",onClick:function(){L("/forgotpassword")},children:"Forgot Password?"})]}):(0,x.jsxs)(d.lXp,{className:"input-label",children:[p," "]}),(0,x.jsx)(d.oil,{id:"email",className:"login-form-input",hideLabel:!0,invalid:"object"===typeof l&&0!==Object.keys(l).length,labelText:"",invalidText:l&&l.title?l.title:"",placeholder:N,disabled:!!n,value:b,onChange:function(e){m(e.target.value),"object"===typeof l&&0!==Object.keys(l).length&&r({}),a({})}})]}),S&&(0,x.jsx)(d.XZJ,{className:"checkbox-item",labelText:"Remember ID",id:"checkbox-label-1"})]}),(0,x.jsx)("div",{className:"fields-container",children:n?(0,x.jsx)("div",{className:"loader-signin",children:(0,x.jsx)(d.lSo,{description:"Please wait...",className:"submit-button-loading"})}):(0,x.jsx)(d.zxk,{renderIcon:u.ol,type:"submit",iconDescription:"",children:v})}),(0,x.jsx)("div",{className:"footer-container",children:c&&(0,x.jsxs)("p",{className:"register-text-body-01",children:[h,(0,x.jsxs)(d.rUS,{style:{cursor:"pointer",textDecoration:"underline",paddingLeft:"4px",outline:"none"},className:"underlined-link",href:"".concat(f),children:[" ",g]})]})})]})}),(0,x.jsx)("div",{className:"footer-text",children:(0,x.jsxs)("p",{className:"register-text-body-02",children:["Need help?",(0,x.jsxs)(d.rUS,{style:{cursor:"pointer",textDecoration:"underline",paddingLeft:"4px",outline:"none"},href:"signin",children:[" ","Contact the Bynar help desk"]})]})})]})},f=function(e){var t=e.heading,n=e.loading,i=e.loadingSucess,r=e.handleFormSubmit,a=e.errorNotification,o=e.labelText,l=e.labelValue,c=e.setFormLabelState,h=e.buttonText,f=e.text,g=e.subtitle,p=e.setSignInPhaseOne,b=e.showCreateAccount,m=e.createAccoutText,v=e.navigationUrl,j=e.navigationUrlText,N=e.placeholderText,y=e.setErrorNotification,S=e.setServerErrorNotification,k=e.serverErrorNotification,w=e.handleEmailFormSubmit;(0,s.s0)();return(0,x.jsx)(x.Fragment,{children:(0,x.jsxs)("div",{className:"signin-container",children:[(0,x.jsx)("div",{className:"box-container",children:(0,x.jsxs)(d.l09,{onSubmit:r,children:[(0,x.jsxs)("div",{style:{paddingRight:"20px"},children:[(0,x.jsx)(d.X6q,{style:{fontSize:"28px",fontWeight:"400"},children:t}),(0,x.jsxs)("p",{className:"register-text body-01",children:[f,(0,x.jsxs)(d.rUS,{className:"underlined-link",style:{cursor:"pointer",paddingLeft:"4px",textDecoration:"underline"},onClick:function(){p(!0),S({})},children:[" ",g]})]}),"object"===typeof k&&0!==Object.keys(k).length?(0,x.jsx)("div",{className:"notification-container",children:(0,x.jsx)(d.Jn6,{className:"error-notification-box",timeout:0,title:null===k||void 0===k?void 0:k.title,kind:null===k||void 0===k?void 0:k.status,onCloseButtonClick:function(){y({}),S({})}})}):(0,x.jsx)("div",{}),(0,x.jsxs)("div",{className:"login-input-wrapper",children:[(0,x.jsx)(d.lXp,{className:"input-label",children:o}),(0,x.jsx)(d.oil,{id:"security-code",className:"login-form-input",hideLabel:!0,invalid:"object"===typeof a&&0!==Object.keys(a).length,labelText:"",invalidText:a&&a.title?a.title:"",placeholder:N,disabled:!!n,value:l,onChange:function(e){c(e.target.value),"object"===typeof a&&0!==Object.keys(a).length&&y({}),S({})}}),(0,x.jsx)("div",{className:"resend-code",children:i?(0,x.jsx)("div",{children:(0,x.jsx)(d.lSo,{description:"resending security code...",className:"submit-button-loading"})}):(0,x.jsx)("p",{className:"resend-code-text",onClick:w,children:"Resend security code"})})]})]}),(0,x.jsx)("div",{className:"fields-container",children:n?(0,x.jsx)("div",{className:"loader-signin",children:(0,x.jsx)(d.lSo,{description:"Please wait...",className:"submit-button-loading"})}):(0,x.jsx)(d.zxk,{renderIcon:u.ol,type:"submit",iconDescription:"",children:h})}),(0,x.jsx)("div",{className:"footer-container",children:b&&(0,x.jsxs)("p",{className:"register-text-body-01",children:[m,(0,x.jsxs)(d.rUS,{style:{cursor:"pointer",textDecoration:"underline",paddingLeft:"4px",outline:"none"},className:"underlined-link",href:"".concat(v),children:[" ",j]})]})})]})}),(0,x.jsx)("div",{className:"footer-text",children:(0,x.jsxs)("p",{className:"register-text-body-01",children:["Need help?",(0,x.jsxs)(d.rUS,{style:{cursor:"pointer",textDecoration:"underline",paddingLeft:"4px",outline:"none"},className:"underlined-link",href:"signin",children:[" ","Contact the Bynar help desk"]})]})})]})})},g=function(){(0,s.s0)();var e=(0,o.useContext)(l.Vo),t=(0,o.useState)(!0),n=(0,a.default)(t,2),d=n[0],u=n[1],g=(0,o.useState)(!1),p=(0,a.default)(g,2),b=p[0],m=p[1],v=(0,o.useState)({}),j=(0,a.default)(v,2),N=j[0],y=j[1],S=(0,o.useState)({}),k=(0,a.default)(S,2),w=k[0],T=k[1],C=(0,o.useState)(""),E=(0,a.default)(C,2),L=E[0],F=E[1],U=(0,o.useState)(""),D=(0,a.default)(U,2),I=D[0],P=D[1],A=(0,o.useState)(""),O=(0,a.default)(A,2),Z=O[0],B=O[1],z=(0,o.useState)(!0),R=(0,a.default)(z,2),V=R[0],X=(R[1],(0,o.useRef)(null)),J=(0,o.useState)(!1),W=(0,a.default)(J,2),q=W[0],M=W[1],$=function(e){return String(e.trim()).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)},G=function(){var e=(0,r.default)((0,i.Z)().mark((function e(t){return(0,i.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),0!==L.length){e.next=5;break}y({title:"Email should not be blank"}),e.next=28;break;case 5:if($(L)){e.next=9;break}y({title:"Enter valid email"}),e.next=28;break;case 9:return y({}),T({}),M(!0),e.prev=12,e.next=15,c.g.signIn({username:L.trim()});case 15:X.current=e.sent,u(!1),M(!1),P(""),d||T({title:"security code sent to ".concat(L),status:"success"}),e.next=28;break;case 22:e.prev=22,e.t0=e.catch(12),console.log(e.t0),M(!1),P(""),T({title:"Email address not verified",status:"error"});case 28:case"end":return e.stop()}}),e,null,[[12,22]])})));return function(t){return e.apply(this,arguments)}}(),H=function(){var t=(0,r.default)((0,i.Z)().mark((function t(n){return(0,i.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n.preventDefault(),m(!0),T({}),0!==I.trim().length){t.next=9;break}y({title:"Security code should not be blank"}),m(!1),P(""),t.next=23;break;case 9:return t.prev=9,t.next=12,c.g.sendCustomChallengeAnswer(X.current,I);case 12:return t.next=14,e.refreshPostSignIn();case 14:m(!1),t.next=23;break;case 17:t.prev=17,t.t0=t.catch(9),console.log(t.t0),"NotAuthorizedException: Invalid session for the user."===t.t0?T({title:"Maximum attempts reached , please login using new code",status:"error"}):T({title:"Enter correct security code",status:"error"}),m(!1),P("");case 23:case"end":return t.stop()}}),t,null,[[9,17]])})));return function(e){return t.apply(this,arguments)}}();return(0,o.useEffect)((function(){d&&(y({}),P(""))}),[d]),(0,x.jsx)(x.Fragment,{children:(0,x.jsx)("div",{style:{display:"flex",flexDirection:"column"},children:d?(0,x.jsx)(h,{heading:"Log in to Bynar",loading:q,handleFormSubmit:G,setErrorNotification:y,setServerErrorNotification:T,serverErrorNotification:w,errorNotification:N,showCreateAccount:!0,createAccoutText:"Don't have an account?",navigationUrl:"/signup",navigationUrlText:"Create an Bynar account",labelText:"E-mail",labelValue:L,setFormLabelState:F,buttonText:"Continue",enableForgotPassword:!1,placeholderText:" ",showRememberId:!1,text:"Logging in as ".concat(L),subtitle:"Not you?",setSignInPhaseOne:u}):V?(0,x.jsx)(f,{heading:"Log in to Bynar",loading:b,loadingSucess:q,handleFormSubmit:H,errorNotification:N,labelText:"Security code",labelValue:I,setFormLabelState:P,buttonText:"Login",text:"Logging in as ".concat(L),subtitle:"Not you?",setSignInPhaseOne:u,showCreateAccount:!0,createAccoutText:"Don't have an account?",navigationUrl:"/signup",navigationUrlText:"Create an Bynar account",placeholderText:"",setErrorNotification:y,setServerErrorNotification:T,serverErrorNotification:w,handleEmailFormSubmit:G}):(0,x.jsx)(h,{heading:"Login",loading:b,handleFormSubmit:function(t){if(t.preventDefault(),m(!0),0===Z.length)y({title:"Password should not be blank"}),m(!1);else{y({});var n=function(){var t=(0,r.default)((0,i.Z)().mark((function t(){var n,r;return(0,i.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,n={email:L,password:Z},t.next=4,e.signin(n,!1);case 4:null!==(r=t.sent)&&void 0!==r&&r.error&&(T({title:"Wrong email or password"}),u(!0)),m(!1),t.next=13;break;case 9:t.prev=9,t.t0=t.catch(0),console.log("error"),m(!1);case 13:case"end":return t.stop()}}),t,null,[[0,9]])})));return function(){return t.apply(this,arguments)}}();n()}},setErrorNotification:y,setServerErrorNotification:T,serverErrorNotification:w,errorNotification:N,showCreateAccount:!1,createAccoutText:"",navigationUrl:"/signup",navigationUrlText:"",labelText:"Password",labelValue:Z,setFormLabelState:B,buttonText:"Login",enableForgotPassword:!1,placeholderText:"Password",navigateToLogin:!0,text:"Logging in as ".concat(L),subtitle:"Not you?",setSignInPhaseOne:u})})})}}}]);
//# sourceMappingURL=630.c8ebb242.chunk.js.map