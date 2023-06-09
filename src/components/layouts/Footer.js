import Link from "next/link";
import Copyright from "../Copyright";
import ScrollUp from "./ScrollUp";
import ThemeSwitcher from "./ThemeSwitcher";

const Footer = ({ footerSetting = {} }) => {
  return (
    <footer className="uni-footer uk-section uk-section-xlarge@m">
      <div className="uk-container">
        <div className="uk-panel">
          <img
            className="uk-position-top-left object-x"
            width="32"
            src="images/objects/x.png"
            alt="object"
            style={{ top: "32%", left: "16%" }}
          />
          <img
            className="uk-position-top-right object-x"
            width="16"
            src="images/objects/x.png"
            alt="object"
            style={{ top: "8%", right: "16%" }}
          />
          <img
            className="uk-position-bottom-right object-x"
            width="16"
            src="images/objects/circle-01.png"
            alt="object"
            style={{ bottom: "24%", right: "40%" }}
          />
          <img
            className="uk-position-bottom-left object-x"
            width="24"
            src="images/objects/orange-ball-blur.png"
            alt="object"
            style={{ bottom: "-8%", left: "30%" }}
          />
          <div className="uk-grid uk-flex-center uk-text-center">
            <div className="uk-width-large@m">
              <div className="uk-panel">
                <a href="landing-01.html" className="uk-logo">
                  <img
                    className="uk-visible dark:uk-hidden"
                    width="300"
                    src="/images/sd-logo-blk.png"
                    alt="SmartDeploy"
                    loading="lazy"
                  />
                  <img
                    className="uk-hidden dark:uk-visible"
                    width="300"
                    src="/images/sd-logo-wht.png"
                    alt="SmartDeploy"
                    loading="lazy"
                  />{" "}
                </a>
                <p className="uk-text-xlarge@m uk-margin-medium-top@m">
                Easily manage smart contracts on Soroban with our all-in-one platform for publishing, deploying, invoking, and upgrading contracts.
                </p>
                <ul className="uk-subnav uk-subnav-small uk-flex-center uk-text-gray-40 uk-margin-top uk-margin-medium-top@m">
                  <li>
                    <a href="https://twitter.com/TENKDAO">
                      <span className="uk-icon uk-icon-medium@m unicon-logo-twitter"></span>
                    </a>
                  </li>
                  <li>
                    <a href="https://discord.gg/6fKqnSfr">
                      <span className="uk-icon uk-icon-medium@m unicon-logo-discord"></span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="uk-margin-medium uk-margin-3xlarge-top@m" />
          <div className="uk-panel uk-text-small">
            <div className="uk-grid uk-child-width-auto@m uk-flex-center uk-flex-between@m uk-text-center uk-text-left@m">
              <div>
                <ul className="uk-subnav uk-subnav-small uk-text-muted uk-flex-center">
                  <li>
                    <Link href="privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="terms">Terms of Use</Link>
                  </li>
                  <li>
                    <Link href="contact">Contact Us</Link>
                  </li>
                  {/* <li className="uk-margin-small-left">
                    <ScrollUp />
                  </li> */}
                </ul>
              </div>
              <div className="uk-flex-first@m uk-flex-center">
                <Copyright />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ThemeSwitcher />
    </footer>
  );
};

export default Footer;
