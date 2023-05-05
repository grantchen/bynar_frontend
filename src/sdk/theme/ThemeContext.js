import React, { createContext, useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";

export const ThemeContext = createContext();

export const ThemeProvider = (props) => {
  const { t } = useTranslation();

  const themeData = [
    {
      text: t("white"),
      value: "carbon-theme--white",
    },
    {
      text: t("gray"),
      value: "carbon-theme--g90",
    },
  ];

  const initialState = {
    currentTheme: themeData[0],
  };

  const themeReducer = (state, action) => {
    switch (action.type.value) {
      case "carbon-theme--white":
        return { currentTheme: action.type };
      case "carbon-theme--g90":
        return { currentTheme: action.type };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    const bodyElement = document.body;
    bodyElement.className = 'carbon-theme--white'//localStorage.getItem("theme");
    dispatch({ type: themeData[0] });
  }, []);
  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {
        // eslint-disable-next-line react/prop-types
        props.children
      }
    </ThemeContext.Provider>
  );
};
