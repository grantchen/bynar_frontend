import { UserProfileImage } from "@carbon/ibm-products";
import { Link, Tile } from "@carbon/react";
import { ArrowRight, Camera } from "@carbon/react/icons";
import React from "react";
import { useAuth, useThemePreference } from "../../sdk";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./profileDropdown.scss";
const ProfileDropdown = React.memo(
  ({
    openUploadProfileModal,
    setUploadProfileModalOpen,
    onProfileOptionClick = () => null
  }) => {
    const [t] = useTranslation();
    const { signout, user } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const { themePreference } = useThemePreference();
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
                backgroundColor={user?.profileURL ? "transparent" : "light-cyan"}
                size={"xl"}
                initials={user?.fullName.match(/(^\S)/)?.[0].toUpperCase() ?? '...'}
                image={user?.profileURL ?? ""}
                // tooltipText={user?.fullName ?? '...'}
                theme={
                  themePreference === "white" ? "light" : "dark"
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
            {user?.id && (
              <Link onClick={onProfileOptionClick}>{t("profile")}</Link>
            )}
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
