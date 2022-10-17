import React, { Component } from 'react';

import { NEXT_PUBLIC_GTM_ID } from '../../lib/gtag';

const gtagScript1 = `https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GTM_ID}`;

const gtagScript2 = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${NEXT_PUBLIC_GTM_ID}');`;

const gtagNoScript = `https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}`;

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
  
export function GTag_NoScript (){
  return (
      <>
        <noscript><iframe src={gtagNoScript} height="0" width="0" style={style}></iframe></noscript>
      </>
  );
}
