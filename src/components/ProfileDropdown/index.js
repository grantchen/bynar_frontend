import { UserProfileImage } from "@carbon/ibm-products";
import { Link, Tile } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import React, { useContext, useState } from "react";
import { ThemeContext, useAuth } from "../../sdk";

import { useTranslation } from "react-i18next";
import "./profileDropdown.scss";
import { useSearchParams } from "react-router-dom";
const ProfileDropdown = React.memo(
  ({
    openThemeModel,
    setThemeModelOpen,
    openLanguageModel,
    setLanguageModelOpen,
  }) => {
    const [t, i18n] = useTranslation();
    const {signout, user} = useAuth();
    const [_, setSearchParams] = useSearchParams()
    const theme = useContext(ThemeContext);
    const handleLogout = async (e) => {
      e.preventDefault();
      await signout();
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
            <h4 style={{ color: "#161616" }}>{user?.fullName}</h4>
            <div className="profile-info-image">
              <UserProfileImage
                backgroundColor={"light-cyan"}
                size={"xlg"}
                initials={user?.fullName ?? '...'}
                tooltipText={user?.fullName ?? '...'}
                theme={
                  theme?.state?.currentTheme?.value === "carbon-theme--g90"
                    ? "dark"
                    : "light"
                }
              />
            </div>
          </div>
          <div className="link-list" style={{ marginTop: "1rem" }}>
            <Link onClick={() => setSearchParams({userIdToBeEdited: user?.id})}>{t("profile")}</Link>
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
