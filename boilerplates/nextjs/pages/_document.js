import Document, { Html, Head, Main, NextScript } from 'next/document'


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
          <Main />
          <NextScript />

      </Html>
    )
  }
}