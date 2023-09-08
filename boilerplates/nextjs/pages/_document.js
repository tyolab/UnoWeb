import Document, { Html, Head, Main, NextScript } from 'next/document'

import { GTag, GTag_NoScript } from '../components/tools/gtag';

export default class MyDocument extends Document {
  render() {
    const style = {
      display: "none",
      visibility: "hidden"};

    return (
      <Html>
        <Head>
          <GTag />
        </Head>

          <GTag_NoScript />
          <body>
          <Main />
          </body>
          <NextScript />

      </Html>
    )
  }
}