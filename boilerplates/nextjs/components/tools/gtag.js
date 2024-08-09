import React, { Component } from 'react';

import { NEXT_PUBLIC_GTM_ID } from '../../lib/gtag';

const gtagScript1 = `https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GTM_ID}`;

const gtagScript2 = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${NEXT_PUBLIC_GTM_ID}');`;

const gtagNoScript = `https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}`;

/*
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','');</script>
<!-- End Google Tag Manager -->
*/
export function GTag () {
    return (
        <>
          {/* <!-- Google tag (gtag.js) --> */}
          <script async src={gtagScript1} />
          <script dangerouslySetInnerHTML={{ __html: gtagScript2 }} />
        </>
    );
};

const style = {
  display: "none",
  visibility: "hidden"};
  
/**
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id="
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
 */
export function GTag_NoScript (){
  return (
      <>
        <noscript><iframe src={gtagNoScript} height="0" width="0" style={style}></iframe></noscript>
      </>
  );
}
