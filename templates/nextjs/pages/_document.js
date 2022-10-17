import Document, { Html, Head, Main, NextScript } from 'next/document'

import { NEXT_PUBLIC_GTM_ID } from '../lib/gtag';

export default class MyDocument extends Document {
  render() {
    const gaScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${NEXT_PUBLIC_GTM_ID}');`;

    const gaScript2 = `https://www.googletagmanager.com/ns.html?id=${NEXT_PUBLIC_GTM_ID}`;
    const style = {
      display: "none",
      visibility: "hidden"};

    return (
      <Html>
        <Head>
          {/* <!-- Google Tag Manager --> */}
          <script dangerouslySetInnerHTML={{ __html: gaScript }} />
          {/* <!-- End Google Tag Manager --> */}
        </Head>

        <body>
          <noscript><iframe src={gaScript2} height="0" width="0" style={style}></iframe></noscript>
          <Main />
          <NextScript />
        </body>

      </Html>
    )
  }
}