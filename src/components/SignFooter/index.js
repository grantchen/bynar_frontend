import React from "react";
import "./SideFooterl.scss";
import { useTranslation } from "react-i18next";

// SignFooter is the footer component
const SignFooter = ({ className }) => {
    const { t } = useTranslation();
    return (
        <footer className="footer">
            <div className="footer-content">
                <a href="#">{t("privacy-policy")}</a>
                <div className="footer_link_divider">|</div>
                <a href="#">{t("terms-of-use")}</a>
                <div className="footer_link_divider">|</div>
                <a href="#manage_cookies">{t("cookie-preferences")}</a>
            </div>
            <div className="footer_copy_right">{t("bynar-inc")}</div>
        </footer>
    );
};

export default SignFooter;
