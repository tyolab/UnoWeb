import { useState } from "react";
import styles from "../../styles/modules/nav.module.sass";

// import Logo from "./logo";

export default function Nav({ settings }) {
  const [open, setOpen] = useState(false);

  const handleMenuClick = () => {
    setOpen(!open);
  };

  const handleItemClick = () => {
    setOpen(!open);
  };

  return (
    <nav className={styles.nav}>
      {/* <Logo /> */}
    </nav>
  );
}
