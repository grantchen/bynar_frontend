import { GlobalTheme } from "@carbon/react";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { ThemeModal } from "./ThemeModal";
import { useAuth } from "../AuthContext";
import {useThemeDetector} from './useThemeDetector'

const ThemePreferenceContext = createContext();

function useThemePreference() {
    return useContext(ThemePreferenceContext);
}

/**
 *
 * theme - 'light' || 'dark' || 'system'
 */
function ThemePreferenceProvider({ children }) {
    const { user } = useAuth();

    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme-preference") ?? "light"
    );

    const isSystemThemeDark = useThemeDetector()

    const [isThemeChangeModalOpen, openThemeChangeModal] = useState(false);

    const changeThemeManually = useCallback((value) => {
        document.documentElement.setAttribute(
            "data-carbon-theme",
            mapCarbonThemeFromThemePreference(value)
        );
    }, []);

    useEffect(() => {
        if (!user) {
            setTheme('light')
            return;
        }
        const preExistingThemeValue = localStorage.getItem("theme-preference")
        const idealThemeValue = "system"
        if(preExistingThemeValue){
          setTheme(preExistingThemeValue)
        }
        else{
          setTheme(idealThemeValue)
        }
    }, [user, isSystemThemeDark]);

    useEffect(() => {
        if(!theme || !user){
            return
        }
        document.documentElement.setAttribute(
            "data-carbon-theme",
            mapCarbonThemeFromThemePreference(theme)
        );
        localStorage.setItem("theme-preference", theme);
    }, [theme + isSystemThemeDark + user?.id]);

    const value = {
        theme,
        setTheme,
        changeThemeManually,
        isThemeChangeModalOpen,
        openThemeChangeModal,
    };
    return (
        <ThemePreferenceContext.Provider value={value}>
            <GlobalTheme theme={mapCarbonThemeFromThemePreference(theme)}>{children}</GlobalTheme>
            <ThemeModal />
        </ThemePreferenceContext.Provider>
    );
}

function mapCarbonThemeFromThemePreference(preference) {
    switch (preference) {
        case "g100":
            return "g90";
        case "g90":
            return "g90";
        case "dark":
            return "g90";
        case "white":
            return "g10";
        case "light":
            return "g10";
        case "system":
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "g90"
                : "g10";
        default:
            return "g10";
    }
}

export { ThemePreferenceProvider, useThemePreference };
