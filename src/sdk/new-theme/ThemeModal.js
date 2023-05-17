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

export const ThemeModal = React.memo(() => {
    const { t } = useTranslation();
    const {
        theme,
        setTheme,
        changeThemeManually,
        isThemeChangeModalOpen,
        openThemeChangeModal,
    } = useThemePreference();

    const [selectedTheme, setSelectedTheme] = useState(theme);

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

    const handleSubmit = useCallback(() => {
        setTheme(selectedTheme);
        openThemeChangeModal(false);
    }, [selectedTheme]);

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
                <Button kind="primary" onClick={handleSubmit}>
                    {t("confirm")}
                </Button>
            </ModalFooter>
        </ComposedModal>
    );
});
