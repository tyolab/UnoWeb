import cx from "classnames";
import Head from "next/head";
import styles from "../../styles/modules/layout.module.sass";

// import Nav from "../common/nav";
import Footer from "../common/footer"
import Header from "../common/header"

import helpers from "lib/helpers";
import constants from "lib/constants";

export default function Layout({ menu, header, footer, settings, scripts = [], seo = {}, children }) {
  // console.debug("Children: ", children);
  header = header || {settings: {styles: {}}}
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <title>{seo.title || settings.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta name="description" content={seo.description || settings.description} />
        <meta name="keywords" content={seo.keywords || settings.keywords} />
        <meta property="og:image" content={seo.ogImage || settings.ogImage} />
        <meta name="og:title" content={seo.title || settings.title} />
        <meta name="twitter:card" content="/images/logo/tyo-card.png" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link
          rel="shortcut icon"
          sizes="16x16 24x24 32x32 48x48 64x64"
          type="image/x-icon"
          href="/favicon.ico"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="57x57"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-touch-icon.png"
        />
      </Head>
      {/* <header className={styles.header}>
        <div className={styles.container}>
          <Nav settings={settings} />
        </div>
      </header> */}
      <Header menu={menu} className={styles.header} content={header.content} styles={header.settings.styles} settings={header.settings}>
      </Header>
      
      <div className={cx(styles.main, "main-wrapper")}>
        {children}

        <Footer content={footer.content} styles={footer.settings.styles} settings={footer.settings} />
      </div>
      {helpers.getScripts(constants.scripts.common, scripts)}
    </>
  );
}
