import module_styles from "../../styles/modules/footer.module.sass";

import cx from "classnames";    

export default function Footer({ content, styles, settings }) {
  styles = styles || {};
  settings = settings || {};
  content = content || {};
  console.debug("Footer styles: ", styles);
  return (
    <footer id="footer" className={cx(module_styles.footer, styles.footer)}>
         <div className="container">
            <div className="row">
               <div className="col-sm-12">
                  <div className="footer-top p-30px-tb">
                     <a className="footer-logo" href=""><img src="img/logo.png" alt="" /></a>
                      {content.p.map((p, i) => (
                        <p className="ml-auto" key={i}>{p}</p>
                      ))}
                      <div className="social-network text-center">
                         {settings.links && settings.links.map((link, i) => (
                          <a href={link.href} key={i}>{link.label}</a>
                         ))}
                     </div>
                  </div>
                  <div className="footer-copyright p-30px-tb text-center">
                     <p>Copyright &copy; {settings.copyright}</p>
                  </div>
               </div>
            </div>
         </div>
    </footer>
  );
}
