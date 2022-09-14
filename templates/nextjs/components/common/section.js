import cx from "classnames";
import styles from "../../styles/modules/section.module.sass";

export default function Section({ children, className, ...rest }) {
  return (
    <section className={cx(styles.section, className)} {...rest}>
      {children}
    </section>
  );
}
