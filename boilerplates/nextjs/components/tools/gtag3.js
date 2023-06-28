import { NEXT_PUBLIC_GTM_ID } from '../../lib/gtag';

const gaScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${NEXT_PUBLIC_GTM_ID}');`;

const gaScript2 = `https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}`;


export function GTag (){
    return (
        <>
          {/* <!-- Google tag (gtag.js) --> */}
          <script async src={gtagScript1} />
          <script dangerouslySetInnerHTML={{ __html: gtagScript2 }} />
          {/**
           * add this into the <body> section of the page
           * <noscript><iframe src={gaScript2} height="0" width="0" style={style}></iframe></noscript>
           */}
        </>
    );
};

export function GTag_NoScript (){
    return (
        <>
          <noscript><iframe src={gaScript2} height="0" width="0" style={style}></iframe></noscript>
        </>
    );
}