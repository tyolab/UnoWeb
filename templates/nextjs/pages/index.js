/**
 * The index page for HOME
 * 
 */
import {
  getSettings,
  getHero,
  getAbout
} from "../lib/content";

import Layout from "../components/layout";

/**
 * SPA (Single Page Application) - Next.js
 */
import Hero from "../components/home/hero";
import About from "../components/home/about";
import Contact from "../components/home/contact";
import Footer from "../components/common/footer";

export default function Home({
  settings,
  hero,
  about
}) {
  return (
    <Layout settings={settings}>
      {/* <Hero item={hero} />
      <About item={about} /> */}
      <Contact settings={settings} />
      <Footer settings={settings} />
    </Layout>
  );
}

export async function getStaticProps() {
  const settings = await getSettings();
  const hero = await getHero();
  const about = await getAbout();

  return {
    props: {
      settings,
      hero,
      about
    }
  };
}