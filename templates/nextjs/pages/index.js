import {
  getSettings,
  getHero,
  getAbout,
  getFxSolutions,
} from "../lib/content";

import Layout from "../components/Layout/Layout";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";

export default function Home({
  settings,
  hero,
  about,
  fxSolutions,
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
  const fxsolutions = await getFxSolutions();

  return {
    props: {
      settings,
      hero,
      about,
      fxsolutions,
    }
  };
}