import { EditSidePanel } from "@carbon/ibm-products";
import {
    TextInput,
    Select,
    SelectItem,
    ToastNotification,
} from "carbon-components-react";
import {
    TextInputSkeleton,
} from "@carbon/react";
import React, {useState, useEffect, useRef} from "react";
import {BaseURL, Languages, Themes} from "../../sdk/constant";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
    const [phoneNumber, setPhoneNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme-preference") ?? "light"
    );
    const [language,setLanguage]= useState("");
    const [disable,setDisable] = useState(false)
    const [dataLoading, setDataLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [phoneNumberValid, setIsPhoneNumberValid] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [serverNotification, setServerNotification] = useState(false);
    const inputRefs = useRef([]);
    const { closeModalAndGoBackToUserList} = useUserManagement();
    const handleThemeChange = (e) => {
        setServerErrorNotification({});
        setServerNotification(false);
        const selectedItem = Themes.find((item) => item.code === e.target.value);
        if (Object.keys(selectedItem).length === 0) {
            setTheme('light')
        }else{
            setTheme(e.target.value)
        }
    }

    const handleLanguageChange = (e) => {
        setServerErrorNotification({});
        setServerNotification(false);
        const selectedItem = Languages.find((item) => item.code === e.target.value);
        if (Object.keys(selectedItem).length === 0) {
            setLanguage('en')
        }else{
            setLanguage(e.target.value)
        }
    }
    /* Function to set state, check email address validation when email address is changed  */
    const handleEmailChange = (value) => {
        setServerErrorNotification({});
        setServerNotification(false);
        setEmail(value);
        const errors = validateOrganizationForm(value);
        setErrors(errors);
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
        setServerErrorNotification({});
        setServerNotification(false);
        const { name, value } = e.target;
        setFullName(value);
        const errors = {};
        if (value.trim() === "") {
            errors.fullName = "FullName is required";
        }
        setErrors(errors);
    };
    const handleClose = () => {
        setServerErrorNotification({});
        setServerNotification(false);
        closeModalAndGoBackToUserList();
    };

    const getUserList = async (userid) => {
        try {
            setDataLoading(true);
            const response = await authFetch(`${BaseURL}/user/${userid}`,{
                method: "GET",
            })
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
                    status: "error",
                });
                setServerNotification(true)
            }
        } catch (e) {
        } finally {
            setDataLoading(false);
        }
    };
    const handlePhoneNumber = (value, country) => {
        setPhoneNumber(value)
        validatePhoneNumber(value, country?.dialCode, country?.countryCode);
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
        setServerErrorNotification({});
        setServerNotification(false);
        const emptyInput = inputRefs.current.find((ref) => ref && ref.value === "");

        if (emptyInput) {
            emptyInput.scrollIntoView({ behavior: "smooth" });
        }

        const fetchData = async () => {
            try {
                setDisable(true)
                setDataLoading(true);
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
                    // await getUserList(user.id)
                    handleClose()
                    await getUser();
                } else {
                    setDisable(false)
                    setServerErrorNotification({
                        title: res.error,
                        status: "error",
                    });
                    setServerNotification(true)
                }
                setDataLoading(false);
            } catch (e) {
                setDataLoading(false);
                setServerErrorNotification({
                    title: 'error occurred while update profile',
                    status: "error",
                });
                setServerNotification(true)
                setDisable(false)
            }
        };
        if (!emptyInput){
            fetchData()
        }
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
                primaryButtonText={t("save")}
                secondaryButtonText={t("cancel")}
                onRequestSubmit={handleUpdateProfile}
                disableSubmit={disable}
            >
                <div className={"story__body-content"}>
                    {serverNotification && (
                        <ToastNotification
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
                                        {`t("phone-number-label") *`}
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
