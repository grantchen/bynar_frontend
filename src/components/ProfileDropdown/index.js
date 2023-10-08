import { UserProfileImage } from "@carbon/ibm-products";
import { Link, Tile, Tooltip } from "@carbon/react";
import { ArrowRight, Camera } from "@carbon/react/icons";
import React from "react";
import { useAuth, useThemePreference, useCardManagement } from "../../sdk";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./profileDropdown.scss";
const ProfileDropdown = React.memo(
  ({
    openUploadProfileModal,
    setUploadProfileModalOpen,
    onProfileOptionClick = () => null
  }) => {
    const [t, i18n] = useTranslation();
    const { signout, user } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const {theme } = useThemePreference();
    const { openCardManagementPanel, isCardManagementAllowed } = useCardManagement();
    const handleLogout = async (e) => {
      e.preventDefault();
      await signout();
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
            <div className="profile-info-image" onClick={handleImageUploadChange}>
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
                <div className="edit-overlay" onMouseLeave={() => setIsHovered(false)}>
                  <Camera />
                </div>
              )}
            </div>
          </div>
          <div className="link-list">
            <Link onClick={onProfileOptionClick}>{t("profile")}</Link>
            <Link>{t("privacy")}</Link>
            {isCardManagementAllowed &&
              <Link onClick={openCardManagementPanel}>{t("card-management")}</Link>}
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
