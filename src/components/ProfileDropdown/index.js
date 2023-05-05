import { UserProfileImage } from "@carbon/ibm-products";
import { Link, Tile } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import React, { useContext, useState } from "react";
import { AuthContext, ThemeContext } from "../../sdk";

import { useTranslation } from "react-i18next";
import "./profileDropdown.scss";
const ProfileDropdown = React.memo(
  ({
    openThemeModel,
    setThemeModelOpen,
    openLanguageModel,
    setLanguageModelOpen,
  }) => {
    const [t, i18n] = useTranslation();
    const authContext = useContext(AuthContext);
    const theme = useContext(ThemeContext);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(true);
    const handleLogout = async (e) => {
      e.preventDefault();
      const logout = await authContext.signout();
    };
    const handleLanguageChange = (e) => {
      e.preventDefault();
      setLanguageModelOpen(!openLanguageModel);
    };

    const handleThemeChange = (e) => {
      e.preventDefault();
      setThemeModelOpen(!openThemeModel);
    };

    return (
      <div>
        <Tile className={"tile"}>
          <div className="bynar-profile-info-wrapper">
            <h4 style={{ color: "#161616" }}>Evin Lewis</h4>
            <div className="profile-info-image">
              <UserProfileImage
                backgroundColor={"light-cyan"}
                size={"xlg"}
                initials={"Evin Lewis"}
                tooltipText={"Evin Lewis"}
                theme={
                  theme?.state?.currentTheme?.value === "carbon-theme--g90"
                    ? "dark"
                    : "light"
                }
              />
            </div>
          </div>
          <div className="link-list" style={{ marginTop: "1rem" }}>
            <Link>{t("profile")}</Link>
            <Link>{t("privacy")}</Link>
            <Link style={{ cursor: "pointer" }} onClick={handleLanguageChange}>
              {t("change-language")}
            </Link>
            <Link style={{ cursor: "pointer" }} onClick={handleThemeChange}>
              {t("change-theme")}
            </Link>
            <Link
              style={{ cursor: "pointer", color: "#525252" }}
              onClick={handleLogout}
            >
              {t("logout")}
              <ArrowRight style={{ marginLeft: "4px" }} />
            </Link>
          </div>
        </Tile>
        <div></div>
        <div></div>
      </div>
    );
  }
);
export default ProfileDropdown;
