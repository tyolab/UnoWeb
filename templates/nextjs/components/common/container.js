import cx from "classnames";
import styles from "../../styles/modules/container.module.sass";

export default function Container({ children, className, ...rest }) {
  return (
    <div className={cx(styles.container, className)} {...rest}>
      {children}
    </div>
  );
}
