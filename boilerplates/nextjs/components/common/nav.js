import { useState } from "react";

import cx from "classnames";      

import styles from "../../styles/modules/nav.module.sass";

const createSubmenu = (item, itemClassName) => {
  return (
    <li key={index} >
    <a className={cx(itemClassName)} href="#blog">Blog</a>
                <span className="sub-menu-toggle" role="navigation" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                   <i className="icofont-rounded-down"></i>
                </span>
                <ul className="sub-menu">
                    {item.items.map((subItem, subIndex) => {
                        return (
                            <li key={subIndex}>
                                <a href={subItem.url}>{subItem.label}</a>
                            </li>
                        );
                    })}
                </ul>
    </li>);
}

const createMenuItem = (index, item, itemClassName) => {
  console.debug("creating menuitem...");
  return (
    <li key={index}>
    <a
      key={index}
      className={cx(styles.link, itemClassName)}
      href={item.href}
      target={item.target}
    >
      {item.label}
    </a>
    </li>
  );
}

const createMenu = (menu, itemGroupClassName, itemClassName) => {
  console.debug("createMenu:", menu);
  if (!menu || !menu.length) return null;
  return (<>{menu.map((item, index) => {
    console.debug("item:", item);

    if (item.items && item.items.length) {
      return createSubmenu(item, itemClassName);
    } 
    else {
      return createMenuItem(index, item, itemClassName);
    }
  })}</>);
  /** 
    (
      <>
      {menu.map((item, index) => {
        console.debug("item:", item);
        if (item.items && item.items.length) {
        } 
        else {

      }
  })}
    
  </>);
  */
}

const createLogoImage = (logo, logoClassName) => {
  if (!logo) return null;

  return (
    <img
      className={cx(logoClassName)}
      src={logo.src}
      alt={logo.alt}
      {...(logo.width ? { width: logo.width } : {})}
      {...(logo.height ? { height: logo.height } : {})}  
    />
  );
}

// import Logo from "./logo";

export default function Nav({ items, styles, settings, logo }) {
  logo = logo || {};
  const [open, setOpen] = useState(false);

  const handleMenuClick = () => {
    setOpen(!open);
  };

  const handleItemClick = () => {
    setOpen(!open);
  };

  return (
    <nav className={cx(styles.navbar)}>
            <div className="container">
               <a className="navbar-brand" href="/">
                  {createLogoImage(logo, styles.logo)}
               </a>
               <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCodeply">
               <i className="icofont-navigation-menu"></i>
               </button>
               <div className="collapse navbar-collapse" id="navbarCodeply">
                  <ul className={styles.menu}>
                  {createMenu(items, styles.menu, styles.item)}
                  </ul>
               </div>
            </div>
    </nav>
  );
}
