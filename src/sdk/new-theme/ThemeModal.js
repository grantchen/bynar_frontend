import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    TileGroup,
    RadioTile,
    ModalFooter,
    Button,
} from "@carbon/react";
import { Devices, Asleep, Light } from "@carbon/react/icons";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useThemePreference } from ".";
import "./ThemeModal.scss";
import {InlineLoading} from "carbon-components-react";
import {useAuth} from "../AuthContext";

export const ThemeModal = React.memo(() => {
    const { updateUserThemePreference } = useAuth();
    const { t } = useTranslation();
    const {
        theme,
        changeThemeManually,
        isThemeChangeModalOpen,
        openThemeChangeModal,
    } = useThemePreference();

    const [selectedTheme, setSelectedTheme] = useState(theme);
    const [loading, setLoading] = useState(false);
    const [setToastNotification] = useState(null);

    const handleChange = useCallback(
        (value) => {
            setSelectedTheme(value);
        },
        [theme]
    );

    const handleClose = useCallback(() => {
        changeThemeManually(theme);
        setSelectedTheme(theme);
        openThemeChangeModal(false);
    }, [theme]);

    const handleSubmit = useCallback(async () => {
        try {
            setLoading(true);
            await updateUserThemePreference({
                themePreference: selectedTheme,
            });
            openThemeChangeModal(false);
        } catch (e) {
            setToastNotification({ message: e.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [selectedTheme, updateUserThemePreference]);

    useEffect(() => {
        setSelectedTheme(theme);
    }, [theme]);

    useEffect(() => {
        changeThemeManually(selectedTheme);
    }, [selectedTheme]);

    return (
        <ComposedModal
            open={isThemeChangeModalOpen}
            size="xs"
            onClose={handleClose}
            className="theme-change-modal"
        >
            <ModalHeader title={t("change-theme")} />
            <ModalBody className="theme-modal-body">
                <TileGroup
                    legend={t("themes")}
                    name="theme"
                    onChange={handleChange}
                    valueSelected={selectedTheme}
                >
                    <RadioTile light value="system">
                        <Devices />
                        {t("system")}
                    </RadioTile>
                    <RadioTile light value="dark">
                        <Asleep /> {t("dark")}
                    </RadioTile>
                    <RadioTile light value="light">
                        <Light /> {t("light")}
                    </RadioTile>
                </TileGroup>
            </ModalBody>
            <ModalFooter>
                <Button kind="secondary" onClick={handleClose}>
                    {t("cancel")}
                </Button>
                <Button
                  kind="primary"
                  onClick={handleSubmit}
                  className="button-with-loading"
                  disabled={loading}
                >
                  {t("submit")}
                  {loading && (
                    <InlineLoading className="inline-loading-within-btn" />
                  )}
                </Button>
            </ModalFooter>
        </ComposedModal>
    );
});
