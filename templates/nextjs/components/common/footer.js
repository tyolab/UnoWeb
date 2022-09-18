import styles from "../../styles/modules/footer.module.sass";

export default function Footer({ settings }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.nav}>
        <a className={styles.link} href="#hero">
          Home
        </a>
      </div>
    </footer>
  );
}
