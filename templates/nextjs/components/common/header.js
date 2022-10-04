import cx from "classnames";
import styles from "../../styles/modules/header.module.sass";

export default function Header({ children, className, ...rest }) {
  return (
    <header className={cx(className)} {...rest}>
      {children}
    </header>
  );
}