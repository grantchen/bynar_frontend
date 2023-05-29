import { UserProfileImage } from "@carbon/ibm-products";
import { Link, Tile, Tooltip } from "@carbon/react";
import { ArrowRight, Camera } from "@carbon/react/icons";
import React from "react";
import { useAuth, useThemePreference } from "../../sdk";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./profileDropdown.scss";
const ProfileDropdown = React.memo(
  ({
    openLanguageModal,
    setLanguageModalOpen,
    openUploadProfileModal,
    setUploadProfileModalOpen,
    onProfileOptionClick = () => null
  }) => {
    const [t, i18n] = useTranslation();
    const { signout, user } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const { openThemeChangeModal, theme } = useThemePreference();
    const handleLogout = async (e) => {
      e.preventDefault();
      await signout();
    };
    const handleLanguageChange = (e) => {
      e.preventDefault();
      setLanguageModalOpen(!openLanguageModal);
    };

    const handleImageUploadChange = (e) => {
      e.preventDefault();
      setUploadProfileModalOpen(!openUploadProfileModal);
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
                image={user?.profileURL ?? ""}
                // tooltipText={user?.fullName ?? '...'}
                theme={
                  theme === "g90"
                    ? "dark"
                    : "light"
                }
                onMouseEnter={() => setIsHovered(true)}
              />
              {isHovered && (
                <div className="edit-overlay" onMouseLeave={() => setIsHovered(false)} onClick={handleImageUploadChange}>
                    <Camera />
                </div>
              )}
            </div>
          </div>
          <div className="link-list">
            <Link onClick={onProfileOptionClick}>{t("profile")}</Link>
            <Link>{t("privacy")}</Link>
            <Link style={{ cursor: "pointer" }} onClick={handleLanguageChange}>
              {t("change-language")}
            </Link>
            <Link style={{ cursor: "pointer" }} onClick={() => openThemeChangeModal(true)}>
              {t("change-theme")}
            </Link>
            <Link
              style={{ cursor: "pointer", alignItems: 'center' }}
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
