import { UserProfileImage } from "@carbon/ibm-products";
import { Link, Tile } from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import React from "react";
import { useAuth, useThemePreference } from "../../sdk";

import { useTranslation } from "react-i18next";
import "./profileDropdown.scss";
import { useSearchParams } from "react-router-dom";
const ProfileDropdown = React.memo(
  ({
    openLanguageModal,
    setLanguageModalOpen,
  }) => {
    const [t, i18n] = useTranslation();
    const {signout, user} = useAuth();
    const { openThemeChangeModal, theme } = useThemePreference();
    const [_, setSearchParams] = useSearchParams()
    const handleLogout = async (e) => {
      e.preventDefault();
      await signout();
    };
    const handleLanguageChange = (e) => {
      e.preventDefault();
      setLanguageModalOpen(!openLanguageModal);
    };


    return (
      <div className="user-profile-dropdown">
        <Tile className={"tile"}>
          <div className="bynar-profile-info-wrapper">
            <h4 className="user-name">{user?.fullName}</h4>
            <div className="profile-info-image">
              <UserProfileImage
                backgroundColor={"light-cyan"}
                size={"xlg"}
                initials={user?.fullName ?? '...'}
                tooltipText={user?.fullName ?? '...'}
                theme={
                  theme === "g90"
                    ? "dark"
                    : "light"
                }
              />
            </div>
          </div>
          <div className="link-list">
            <Link onClick={() => setSearchParams({userIdToShowDetails: user?.id})}>{t("profile")}</Link>
            <Link>{t("privacy")}</Link>
            <Link style={{ cursor: "pointer" }} onClick={handleLanguageChange}>
              {t("change-language")}
            </Link>
            <Link style={{ cursor: "pointer" }} onClick={() => openThemeChangeModal(true)}>
              {t("change-theme")}
            </Link>
            <Link
              style={{ cursor: "pointer",alignItems:'center'}}
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
