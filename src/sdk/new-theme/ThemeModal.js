import { Modal, Dropdown } from "@carbon/react";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useThemePreference } from "../new-theme";
import { useAuth } from "../AuthContext";

export const ThemeModal = React.memo(() => {
    const { t } = useTranslation();

    const [themeOptions, setThemeOptions] = useState([
        {
            text: t("white"),
            value: "white",
        },
        {
            text: t("dark"),
            value: "g100",
        },
    ]);

    const { user } = useAuth();

    const {
        theme,
        setTheme,
        changeThemeManually,
        isThemeChangeModalOpen,
        openThemeChangeModal,
    } = useThemePreference();

    const [selectedTheme, setSelectedTheme] = useState(
        () =>
            themeOptions.find((option) => option.value === theme) ??
            themeOptions[0]
    );

    const handleChange = useCallback(
        ({ selectedItem }) => {
            setSelectedTheme(selectedItem);
            changeThemeManually(selectedItem.value);
        },
        [theme]
    );

    const handleClose = useCallback(() => {
        changeThemeManually(theme);
        setSelectedTheme(themeOptions.find((option) => option.value === theme));
        openThemeChangeModal(false);
    }, [theme]);

    const handleSubmit = useCallback(() => {
        setTheme(selectedTheme.value);
        openThemeChangeModal(false);
    }, [selectedTheme]);

    useEffect(() => {
        setSelectedTheme(themeOptions.find((option) => option.value === theme));
    }, [theme]);

    useEffect(() => {
        if (!user?.languagePreference) {
            return;
        }
        setThemeOptions([
            {
                text: t("white"),
                value: "white",
            },
            {
                text: t("dark"),
                value: "g100",
            },
        ]);
        const _selectedTheme = themeOptions.find((option) => option.value === theme)
        setSelectedTheme({
            ..._selectedTheme,
            text: t(_selectedTheme.text)
        })
    }, [user?.languagePreference, t]);

    return (
        <Modal
            primaryButtonText={t("submit")}
            secondaryButtonText={t("cancel")}
            open={isThemeChangeModalOpen}
            onRequestClose={handleClose}
            onRequestSubmit={handleSubmit}
            size="sm"
        >
            <div className="carbon-theme-dropdown">
                <Dropdown
                    ariaLabel="Theme dropdown"
                    id="theme-dropdown"
                    items={themeOptions}
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
