import { SidePanel, pkg } from "@carbon/ibm-products";
import {
    TextInputSkeleton, Theme,
    TextInput, Select, SelectItem, Dropdown,
    InlineNotification
} from "@carbon/react";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { BaseURL, Languages, Themes } from "../../sdk/constant";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuth, useUserManagement, useThemePreference } from "../../sdk";

import {
    PhoneNumberUtil,
} from "google-libphonenumber";
import "./UserDetailPanel.scss";
import { useTranslation } from "react-i18next";

pkg.component.SidePanel = true;

export const UserDetailPanel = ({ open }) => {
    const { t } = useTranslation();
    const { themePreference } = useThemePreference();
    const { user, refreshPostSignIn, getUser, authFetch } = useAuth();
    const phoneUtil = PhoneNumberUtil.getInstance();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme-preference") ?? "light"
    );
    const [language, setLanguage] = useState("");
    const [disable, setDisable] = useState(false)
    const [updateHappened, setUpdateHappened] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [phoneNumberValid, setIsPhoneNumberValid] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [serverNotification, setServerNotification] = useState(false);
    const inputRefs = useRef([]);
    const [searchParams] = useSearchParams();
    const { closeModalAndGoBackToUserList } = useUserManagement();
    const [defaultData, setDefaultData] = useState({});
    const themeItems = Themes.map(themeObject => themeObject.code);
    const languagesItems = Languages.map(languageObject => languageObject.code);
    const handleThemeChange = (selectedTheme) => {
        setServerErrorNotification({});
        setServerNotification(false);
        const selectedItem = Themes.find((item) => item.code === selectedTheme.selectedItem);
        if (Object.keys(selectedItem).length === 0) {
            setTheme('light')
        } else {
            setTheme(selectedTheme.selectedItem)
        }
        if (selectedTheme.selectedItem === defaultData?.theme) {
            checkValues(defaultData, "theme")
        } else {
            setUpdateHappened(false);
        }
    }

    const handleLanguageChange = (selectedLanguage) => {
        setServerErrorNotification({});
        setServerNotification(false);
        const selectedItem = Languages.find((item) => item.code === selectedLanguage.selectedItem);
        if (Object.keys(selectedItem).length === 0) {
            setLanguage('en')
        } else {
            setLanguage(selectedLanguage.selectedItem)
        }
        if (selectedLanguage.selectedItem === defaultData?.language) {
            checkValues(defaultData, "language")
        } else {
            setUpdateHappened(false);
        }
    }
    /* Function to set state, check email address validation when email address is changed  */
    const handleEmailChange = (value) => {
        setServerErrorNotification({});
        setServerNotification(false);
        setEmail(value);
        const errors = validateOrganizationForm(value);
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            if (value === defaultData?.email) {
                checkValues(defaultData, "email")
            } else {
                setUpdateHappened(false);
            }
        } else {
            setUpdateHappened(true);
        }
    };
    const validateOrganizationForm = (email) => {
        // const errors = {};
        if (email.trim() === "") {
            errors.email = "Email is required";
        } else if (email.length > 0) {
            if (!checkEmailValid(email.trim())) {
                errors.email = "Suggested format (name@company.com)";
            } else {
                errors.email = ""
            }
        }

        return errors;
    };
    /* Function to check if email address is valid or not */
    const checkEmailValid = (value) => {
        return String(value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleFullName = (e) => {
        setServerErrorNotification({});
        setServerNotification(false);
        const { name, value } = e.target;
        setFullName(value);
        // const errors = {};
        if (value.trim() === "") {
            errors.fullName = "FullName is required";
        } else {
            errors.fullName = ""
        }
        setErrors(errors);
        if (value === defaultData?.fullName) {
            checkValues(defaultData, "fullName")
        } else {
            setUpdateHappened(false);
        }
    };
    const handleClose = () => {
        setServerErrorNotification({});
        setServerNotification(false);
        closeModalAndGoBackToUserList();
    };

    const handlePhoneNumber = (value, country) => {
        setPhoneNumber(value)
        if (value === defaultData?.phoneNumber.substring(1)) {
            checkValues(defaultData, "phoneNumber")
        } else {
            setUpdateHappened(false);
        }
        validatePhoneNumber(value, country?.dialCode, country?.countryCode);
    }
    const validatePhoneNumber = (value, dialCode, country) => {
        if (value === dialCode) {
            setErrorMessage("Enter valid phone number")
            setIsPhoneNumberValid(false)
            setUpdateHappened(true);
        } else {
            const phoneNumberWithoutDialCode = value.toString().replace(dialCode, "");
            if (phoneNumberWithoutDialCode.length === 0) {
                setErrorMessage("Phone number is required")
                setIsPhoneNumberValid(false)
                setUpdateHappened(true);
            } else if (phoneNumberWithoutDialCode === value) {
                setErrorMessage("Enter valid phone number")
                setIsPhoneNumberValid(false)
                setUpdateHappened(true);
            } else {

                try {
                    const number = phoneUtil.parse(phoneNumberWithoutDialCode, country);
                    const isValid = phoneUtil.isValidNumber(number);
                    if (!isValid) {
                        setErrorMessage("Enter valid phone number")
                        setIsPhoneNumberValid(false)
                        setUpdateHappened(true);
                    } else {
                        setErrorMessage("")
                        setIsPhoneNumberValid(true)
                    }
                } catch (e) {
                    setErrorMessage("Enter valid phone number")
                    setIsPhoneNumberValid(false)
                    setUpdateHappened(true);
                }
            }
        }
    }
    const handleUpdateProfile = () => {
        setServerErrorNotification({});
        setServerNotification(false);
        const emptyInput = inputRefs.current.find((ref) => ref && ref.value === "");

        if (emptyInput) {
            emptyInput.scrollIntoView({ behavior: "smooth" });
        }

        const fetchData = async () => {
            try {
                setDisable(true)
                const data = {
                    email: email,
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    theme: theme,
                    language: language,
                };
                const response = await authFetch(`${BaseURL}/update-profile`, {
                    method: "put",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const res = await response.json();
                if (response.ok) {
                    setDisable(false)
                    handleClose()
                    await getUser();
                    await refreshPostSignIn();
                } else {
                    setDisable(false)
                    setServerErrorNotification({
                        title: res.error,
                        status: "error",
                    });
                    setServerNotification(true)
                }
            } catch (e) {
                setServerErrorNotification({
                    title: 'error occurred while update profile',
                    status: "error",
                });
                setServerNotification(true)
                setDisable(false)
            }
        };
        if (!emptyInput) {
            fetchData()
        }
    };
    const checkValues = (defaultData, attribute) => {
        if (attribute !== "email" && defaultData?.email !== email) {
            setUpdateHappened(false);
        } else if (attribute !== "fullName" && defaultData?.fullName !== fullName) {
            setUpdateHappened(false);
        } else if (attribute !== "phoneNumber" && defaultData?.phoneNumber.substring(1) !== phoneNumber && defaultData?.phoneNumber !== phoneNumber) {
            setUpdateHappened(false);
        } else if (attribute !== "theme" && defaultData?.theme !== theme) {
            setUpdateHappened(false);
        } else if (attribute !== "language" && defaultData?.language !== language) {
            setUpdateHappened(false);
        } else {
            setUpdateHappened(true);
        }
    };

    useEffect(() => {
        const getUserList = async (userid) => {
            try {
                setServerErrorNotification({});
                setErrors({});
                setErrorMessage("");
                setServerNotification(false);
                setDataLoading(true);
                const response = await authFetch(`${BaseURL}/user/${userid}`, {
                    method: "GET",
                })
                const res = await response.json();
                if (response.ok) {
                    setEmail(res?.email)
                    setFullName(res?.fullName);
                    setPhoneNumber(res?.phoneNumber);
                    setTheme(res?.theme)
                    setLanguage(res?.language)
                    setDefaultData(res)
                } else {
                    setServerErrorNotification({
                        title: res.error,
                        status: "error",
                    });
                    setServerNotification(true)
                }
            } catch (e) {
            } finally {
                setDataLoading(false);
            }
        };
        if (!open) {
            setUpdateHappened(true)
            return;
        }
        getUserList(user?.id || parseInt(searchParams?.get("userIdToShowDetails")))
    }, [open, authFetch]);

    return (
        <Theme theme={themePreference === "white" ? "g10" : "g90"}>
            <div className="user-detail-panel">
                <SidePanel
                    preventCloseOnClickOutside
                    includeOverlay
                    className="test"
                    open={open}
                    title={t("user-detail")}
                    subtitle={t("user-profile-information")}
                    onRequestClose={handleClose}
                    actions={[{
                        label: t('save'),
                        onClick: function onClick(event) {
                            event.preventDefault();
                            handleUpdateProfile();
                        },
                        kind: 'primary',
                        disabled: updateHappened || errorMessage !== "" || Object.keys(errors).length !== 0,
                        loading: disable,
                    }, {
                        label: t("cancel"),
                        onClick: handleClose,
                        kind: 'secondary',
                    }]}
                >
                    <div className={"story__body-content"}>
                        {serverNotification && (
                            <InlineNotification
                                className="error-notification-box"
                                iconDescription="Close Notification"
                                subtitle={serverErrorNotification?.title}
                                onCloseButtonClick={() => {
                                    setServerErrorNotification({});
                                    setServerNotification(false);
                                }}
                                timeout={0}
                                title={""}
                                kind={serverErrorNotification?.status}
                            />
                        )}
                        <div className={`story__text-inputs`}>
                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="email"
                                    ref={(el) => (inputRefs.current[0] = el)}
                                    labelText={`${t("email-label")} *`}
                                    value={email}
                                    onChange={(e) => handleEmailChange(e.target.value)}
                                    invalid={!!errors.email}
                                    invalidText={errors.email}
                                    disabled={dataLoading ? true : false}
                                />
                            )}
                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="fullName"
                                    ref={(el) => (inputRefs.current[1] = el)}
                                    labelText={`${t("full-name-label")} *`}
                                    className={`story__text-input`}
                                    value={fullName}
                                    onChange={handleFullName}
                                    invalid={!!errors.fullName}
                                    invalidText={errors.fullName}
                                    disabled={dataLoading ? true : false}
                                />
                            )}
                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <>
                                    <div className="phone-label-wrapper">
                                        <p className="phone-label">
                                            {`${t("phone-number-label")} *`}
                                        </p>
                                    </div>
                                    <PhoneInput
                                        className="phone-input-sidepanel"
                                        ref={(el) => (inputRefs.current[2] = el)}
                                        inputProps={{
                                            disabled: false,
                                        }}
                                        disableDropdown={false}
                                        style={{
                                            border:
                                                !phoneNumberValid &&
                                                    errorMessage.length > 0
                                                    ? "2px solid red"
                                                    : 0,
                                            cursor: "not-allowed",
                                        }}
                                        name="phoneNumber"
                                        country={""}
                                        value={phoneNumber}
                                        onChange={(value, country, formattedValue) =>
                                            handlePhoneNumber(value, country)
                                        }
                                    />
                                    {!phoneNumberValid && errorMessage.length > 0 && (
                                        <p
                                            style={{
                                                marginTop: "4px",
                                                fontSize: "12px",
                                                color: "#DA1E28",
                                            }}
                                        >
                                            {errorMessage}
                                        </p>
                                    )}
                                </>
                            )}
                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <>
                                    <Dropdown
                                        id="theme-ci"
                                        titleText={`${t("theme")} *`}
                                        initialSelectedItem={theme}
                                        items={themeItems}
                                        selectedItem={theme}
                                        onChange={selectedItem => handleThemeChange(selectedItem)}
                                        itemToString={(item) => (item ? t(item) : '')}
                                        label={theme} />
                                </>
                            )}
                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <>
                                    <Dropdown
                                        id="language-ci"
                                        titleText={`${t("languages")} *`}
                                        initialSelectedItem={language}
                                        items={languagesItems}
                                        selectedItem={language}
                                        itemToString={(item) => (item ? t(item) : '')}
                                        onChange={selectedItem => handleLanguageChange(selectedItem)}
                                        label={language} />
                                </>
                            )}
                        </div>
                    </div>
                </SidePanel>
            </div>
        </Theme>
    );
};
