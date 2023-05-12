import { Modal, Dropdown } from "@carbon/react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useThemePreference } from "../new-theme";

export const ThemeModal = React.memo(() => {
    const { t } = useTranslation();

    const themeOptions = useRef([
        {
            text: t("white"),
            value: "g10",
        },
        {
            text: t("gray"),
            value: "g90",
        },
    ])
    const { theme, setTheme, changeThemeManually, isThemeChangeModalOpen, openThemeChangeModal } = useThemePreference();

    const [selectedTheme, setSelectedTheme] = useState(() => themeOptions.current.find((option) => option.value === theme) ?? themeOptions.current[0]);

    const handleChange = useCallback(
        ({selectedItem}) => {
            setSelectedTheme(selectedItem);
            changeThemeManually(selectedItem.value);
        },
        [theme]
    );

    const handleClose = useCallback(() => {
        changeThemeManually(theme);
        setSelectedTheme(themeOptions.current.find((option) => option.value === theme));
        openThemeChangeModal(false)
    }, [theme]);

    const handleSubmit = useCallback(() => {
        setTheme(selectedTheme.value);
        openThemeChangeModal(false)
    }, [selectedTheme]);

    useEffect(() => {
        setSelectedTheme(themeOptions.current.find((option) => option.value === theme));
    }, [theme])


    return (
        <Modal
            primaryButtonText={t("submit")}
            secondaryButtonText={t("cancel")}
            open={isThemeChangeModalOpen}
            onRequestClose={handleClose}
            onRequestSubmit={handleSubmit}
        >
            <div className="carbon-theme-dropdown">
                <Dropdown
                    ariaLabel="Theme dropdown"
                    id="theme-dropdown"
                    items={themeOptions.current}
                    selectedItem={selectedTheme}
                    itemToString={(item) => (item ? item.text : "")}
                    onChange={handleChange}
                    label={t("select-theme")}
                    titleText={t("select-theme")}
                />
            </div>
        </Modal>
    );
});
