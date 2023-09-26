import { EditSidePanel } from "@carbon/ibm-products";
import {
    Button,
    TextInput,
    PasswordInput,
    Select,
    SelectItem,
    ToastNotification,
} from "carbon-components-react";
import {
    SkeletonText,
    CodeSnippetSkeleton,
    TextInputSkeleton,
} from "@carbon/react";
// import "./SidePanel.scss";
import React, { useState, useRef, useContext, useEffect } from "react";
import {BaseURL, Languages, Themes} from "../../sdk/constant";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSearchParams } from "react-router-dom";
import {useAuth, useUserManagement} from "../../sdk";
import {
    PhoneNumberUtil,
} from "google-libphonenumber";
import "./UserDetailPanel.scss";
import { useTranslation } from "react-i18next";
export const UserDetailPanel = ({ open }) => {
    const { t } = useTranslation();
    const { user,getUser,authFetch } = useAuth();
    const phoneUtil = PhoneNumberUtil.getInstance();
    const [accountInfoErrors, setAccountInfoErrors] = useState({
        userName: false,
        fullName: false,
        phoneNumber: false,
        theme: false,
        language: false,
    });
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme-preference") ?? "light"
    );
    const [language,setLanguage]= useState("");
    const [errorNotification, setErrorNotification] = useState({});
    const [emailErrorNotification, setEmailErrorNotification] = useState({});
    const [dataLoading, setDataLoading] = useState(false);
    const emailInput = useRef(null);
    const fullNameInput = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [phoneNumberValid, setIsPhoneNumberValid] = useState(false);
    const [errors, setErrors] = useState({});
    const inputRefs = useRef([]);
    const [searchParams] = useSearchParams();
    const [userId, setUserId] = useState(1);
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [serverNotification, setServerNotification] = useState(false);
    const [countryCode, setCountryCode] = useState("IN");
    const [countryDialCode, setCountryDialCode] = useState("91");

    const isUserEdit = searchParams.get("userIdToShowDetails");

    const { closeModalAndGoBackToUserList} = useUserManagement();
    const handleThemeChange = (e) => {
        const selectedItem = Themes.find((item) => item.code === e.target.value);
        if (Object.keys(selectedItem).length === 0) {
            setTheme('light')
        }else{
            setTheme(e.target.value)
        }
    }

    const handleLanguageChange = (e) => {
        const selectedItem = Languages.find((item) => item.code === e.target.value);
        if (Object.keys(selectedItem).length === 0) {
            setLanguage('en')
        }else{
            setLanguage(e.target.value)
        }
    }
    /* Function to set state, check email address validation when email address is changed  */
    const handleEmailChange = (value) => {
        setErrorNotification({});
        setEmail(value);
        const errors = validateOrganizationForm(value);
        setErrors(errors);
        // change email needs to verify again
    };
    const validateOrganizationForm = (email) => {
        const errors = {};
        if (email.trim() === "") {
            errors.email = "Email is required";
        } else if (email.length > 0) {
            if (!checkEmailValid(email.trim())) {
                errors.email = "Suggested format (name@company.com)";
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
        const { name, value } = e.target;
        setFullName(value);
        setAccountInfoErrors({
            ...accountInfoErrors,
            [name]: value.trim().length === 0,
        });
    };
    const handleClose = () => {
        closeModalAndGoBackToUserList();
    };

    const getUserList = async (userid) => {
        try {
            console.log(user)
            setDataLoading(true);
            const response = await authFetch(`${BaseURL}/user/${userid}`,{
                method: "GET",
            })
            console.log('response',response)
            const res = await response.json();
            if (response.ok) {
                setEmail(res?.email)
                setFullName(res?.fullName);
                setPhoneNumber(res?.phoneNumber);
                setTheme(res?.theme)
                setLanguage(res?.language)
            } else {
                setServerErrorNotification({
                    title: res.error,
                    status: "success",
                });
            }
        } catch (e) {
        } finally {
            setDataLoading(false);
        }
    };
    const handlePhoneNumber = (value, country) => {
        setPhoneNumber(value)
        setCountryCode(country?.countryCode);
        setCountryDialCode(
            country?.dialCode.toString().replace("+", "")
        );
        validatePhoneNumber(value, country.dialCode, country?.countryCode);
    }
    const validatePhoneNumber = (value, dialCode, country) => {
        if (value === dialCode) {
            setErrorMessage("Enter valid phone number")
            setIsPhoneNumberValid(false)
        } else {
            const phoneNumberWithoutDialCode = value.toString().replace(dialCode, "");
            if (phoneNumberWithoutDialCode.length === 0) {
                setErrorMessage("Phone number is required")
                setIsPhoneNumberValid(false)
            } else if (phoneNumberWithoutDialCode === value) {
                setErrorMessage("Enter valid phone number")
                setIsPhoneNumberValid(false)
            } else {

                try {
                    const number = phoneUtil.parse(phoneNumberWithoutDialCode, country);
                    const isValid = phoneUtil.isValidNumber(number);
                    if (!isValid) {
                        setErrorMessage("Enter valid phone number")
                        setIsPhoneNumberValid(false)
                    } else {
                        setErrorMessage("")
                        setIsPhoneNumberValid(true)
                    }
                } catch (e) {
                    setErrorMessage("Enter valid phone number")
                    setIsPhoneNumberValid(false)
                }
            }
        }
    }
    const handleUpdateProfile = () => {
        const fetchData = async () => {
            try {
                setDataLoading(true);
                const data = {
                    username: email,
                    fullName: fullName,
                    phoneNumber: phoneNumber,
                    theme: theme,
                    language: language,
                };
                const response = await authFetch(`${BaseURL}/update-profile`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const res = await response.json();
                if (response.ok) {
                    await getUserList(user.id)
                    await getUser();
                    handleClose()
                    return
                } else if (response.status === 500) {
                    setErrorNotification({
                        title: res.error,
                        status: "error",
                    });
                }
                setDataLoading(false);
            } catch (e) {
                setDataLoading(false);
                setErrorNotification({
                    title: 'error occurred while update profile',
                    status: "error",
                });
                console.log(e);
            }
        };
    };
    useEffect(() => {
        if (!open) {
            return;
        }
        getUserList(user.id)
    }, [open,user]);

    return (
        <div className="user-detail-panel">
            <EditSidePanel
                preventCloseOnClickOutside
                includeOverlay
                className="test"
                open={open}
                onRequestClose={handleClose}
                title={t("user-detail")}
                subtitle=""
                actions={[]}
                primaryButtonText='save'
                secondaryButtonText='cancel'
                onRequestSubmit={handleUpdateProfile}
            >
                <div className={"story__body-content"}>
                    {serverNotification && (
                        <ToastNotification
                            className="error-notification-box"
                            iconDescription="Close Notification"
                            subtitle={serverErrorNotification?.message}
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
                                ref={emailInput}
                                name="email"
                                type="text"
                                id="email"
                                className={`story__text-input`}
                                labelText={`${t("email-label")} *`}
                                value={email}
                                onChange={(e) => handleEmailChange(e.target.value)}
                                invalid={!!errors.email}
                                invalidText={errors.email}
                            />
                        )}
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <TextInput
                                ref={fullNameInput}
                                type="text"
                                name="fullName"
                                id="fullName"
                                labelText={`${t("full-name-label")} *`}
                                className={`story__text-input`}
                                value={fullName}
                                onChange={handleFullName}
                                invalid={accountInfoErrors.fullName}
                                invalidText={"Full name is required"}
                            />
                        )}
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <>
                                <div className="phone-label-wrapper">
                                    <p className="phone-label">
                                        {t("phone-number-label")}
                                    </p>
                                </div>
                                <PhoneInput
                                    className="phone-input-sidepanel"
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
                            </>
                        )}
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <>
                                <Select
                                    value={theme}
                                    id="theme-ci"
                                    labelText={t('theme')}
                                    onChange={handleThemeChange}
                                >
                                    {Themes.map((themeObject, themeIndex) => (
                                        <SelectItem
                                            text={t(themeObject.code)}
                                            value={themeObject.code}
                                            key={themeIndex}
                                        />
                                    ))}
                                </Select>
                            </>
                        )}
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <>
                                <Select
                                    value={language}
                                    id="language-ci"
                                    labelText={t('language')}
                                    onChange={handleLanguageChange}
                                >
                                    {Languages.map((object, index) => (
                                        <SelectItem
                                            text={t(object.code)}
                                            value={object.code}
                                            key={index}
                                        />
                                    ))}
                                </Select>
                            </>
                        )}
                    </div>
                </div>
            </EditSidePanel>
        </div>
    );
};
