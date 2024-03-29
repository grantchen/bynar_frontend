import { SidePanel } from "@carbon/ibm-products";
import {
    TextInput,
    Select,
    SelectItem,
    InlineNotification,
} from "@carbon/react";
import "./SidePanel.scss";
import { useState, useRef, useEffect } from "react";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSearchParams } from "react-router-dom";
import { COUNTRIES, useUserManagement } from "../../sdk";
import {
    PhoneNumberUtil
} from "google-libphonenumber";
import { useTranslation } from "react-i18next";
import {
    SkeletonText,
    TextInputSkeleton,
} from "@carbon/react";

const defaultCountry = 'India'
const defaultContryCode = '91'

const AccountInfoErrorsInitialState = {
    userName: false,
    password: false,
    fullName: false,
    addressLine1: false,
    city: false,
    state: false,
    postalCode: false,
    phoneNumber: false,
    role: false,
};
export const SidePanels = ({ open }) => {
    const { t } = useTranslation();
    const phoneUtil = PhoneNumberUtil.getInstance();
    const [accountInfoErrors, setAccountInfoErrors] = useState(
        AccountInfoErrorsInitialState
    );
    const [country, setCountry] = useState(defaultCountry);
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(defaultContryCode);
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Users");
    const [errorNotification, setErrorNotification] = useState({});
    const [emailErrorNotification, setEmailErrorNotification] = useState({});
    const [addressErrorNotification, setAddressErrorNotification] = useState(
        {}
    );
    const [passwordErrorNotification, setPasswordErrorNotification] = useState(
        {}
    );
    const [cityErrorNotification, setCityErrorNotification] = useState({});
    const [stateErrorNotification, setStateErrorNotification] = useState({});
    const [postalCodeErrorNotification, setPostalCodeErrorNotification] =
        useState({});
    const [savingData, setSavingData] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const emailInput = useRef(null);
    const fullNameInput = useRef(null);
    const passwordInput = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [phoneNumberValid, setIsPhoneNumberValid] = useState(false);
    const [errors, setErrors] = useState({});
    const inputRefs = useRef([]);
    const [searchParams] = useSearchParams();
    const [userId, setUserId] = useState(0);
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [serverNotification, setServerNotification] = useState(false);
    const [organisationID, setOrganizationId] = useState(0);
    const roleslist = [
        { name: "Owner" },
        { name: "Administrator" },
        { name: "Users" },
    ];
    const [countryCode, setCountryCode] = useState("IN");
    const [countryDialCode, setCountryDialCode] = useState(defaultContryCode);

    const [userDetails, setUserDetails] = useState({});
    const isUserEdit = searchParams.get("userIdToBeEdited");

    const { closeModalAndGoBackToUserList, updateUser, addUser, getUserById } =
        useUserManagement();

    const checkEmailValid = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePassword = (value) => {
        if (value.trim().length === 0) {
            setPasswordErrorNotification({
                title: "Password should not be blank",
            });
            passwordInput.current.focus();
        } else {
            const uppercaseRegex = /[A-Z]/;
            const lowercaseRegex = /[a-z]/;
            const numberRegex = /[0-9]/;
            const specialcharacterRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
            if (
                value.trim().length >= 8 &&
                uppercaseRegex.test(value) &&
                lowercaseRegex.test(value) &&
                numberRegex.test(value) &&
                specialcharacterRegex.test(value)
            ) {
                setPasswordErrorNotification({});
            } else {
                setPasswordErrorNotification({
                    title: "Password should contain at least 8 character,one number,one lowercase,one uppercase",
                });
                passwordInput.current.focus();
            }
        }
    };

    const validateEmail = (email) => {
        const errors = {};
        if (email.trim() === "") {
            errors.userName = t("email-required");
        } else if (email.length > 0) {
            if (!checkEmailValid(email.trim())) {
                errors.userName = t("email-format-error");
            }
        }

        return errors;
    };
    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setUserName(value);
        const errors = validateEmail(value);
        setErrors(errors);
    };

    const handleFullName = (e) => {
        const { name, value } = e.target;
        setFullName(value);
        setAccountInfoErrors({
            ...accountInfoErrors,
            [name]: value.trim().length == 0,
        });
    };

    const handleAddressLine1 = (e) => {
        const { name, value } = e.target;
        setAddressLine1(value);
        setAccountInfoErrors({
            ...accountInfoErrors,
            [name]: value.trim().length == 0,
        });
    };

    const handleCity = (e) => {
        const { name, value } = e.target;
        setCity(value);
        setAccountInfoErrors({
            ...accountInfoErrors,
            [name]: value.trim().length == 0,
        });
    };

    const handleState = (e) => {
        const { name, value } = e.target;
        setState(value);
        setAccountInfoErrors({
            ...accountInfoErrors,
            [name]: value.trim().length == 0,
        });
    };

    const validatePhoneNumber = (value, dialCode, country) => {
        if (value == dialCode) {
            setErrorMessage(t("phone-number-validation"));
            setIsPhoneNumberValid(false);
            return false;
        } else {
            const phoneNumberWithoutDialCode = value
                .toString()
                .replace(dialCode, "");
            if (phoneNumberWithoutDialCode.length == 0) {
                setErrorMessage(t("phone-number-required"));
                setIsPhoneNumberValid(false);
                return false;
            } else if (phoneNumberWithoutDialCode == value) {
                setErrorMessage(t("phone-number-validation"));
                setIsPhoneNumberValid(false);
                return false;
            } else {
                try {
                    const number = phoneUtil.parse(
                        phoneNumberWithoutDialCode,
                        country
                    );
                    const isValid = phoneUtil.isValidNumber(number);
                    if (!isValid) {
                        setErrorMessage(t("phone-number-validation"));
                        setIsPhoneNumberValid(false);
                        return false;
                    } else {
                        setErrorMessage("");
                        setIsPhoneNumberValid(true);
                        return true;
                    }
                } catch (e) {
                    setErrorMessage(t("phone-number-validation"));
                    setIsPhoneNumberValid(false);
                    return false;
                }
            }
        }
    };

    const handlePhoneNumber = (value, country, formattedValue) => {
        setPhoneNumber(value);
        setCountryCode(country?.countryCode);
        setCountryDialCode(
            country?.dialCode.toString().replace("+", "")
        );
        validatePhoneNumber(value, country.dialCode, country?.countryCode);
    };

    const postalCodeValidation = (value) => {
        if (value.length === 0) {
            setPostalCodeErrorNotification({
                title: t("postal-code-required"),
            });
        } else {
            setPostalCodeErrorNotification({});
        }
    };

    /* Function to handle postal code change and also check validations for postal code */
    const handlePostalCode = (e) => {
        setPostalCode(e.target.value.trim());
        postalCodeValidation(e.target.value.trim());
    };

    const handleRoleChange = (e) => {
        const { name, value } = e.target;
        setRole(value);
        setAccountInfoErrors({
            ...accountInfoErrors,
            [name]: value.trim().length == 0,
        });
    };

    const personalInfoButtonDisabled =
        fullName.trim().length == 0 ||
        city.trim().length == 0 ||
        state.trim().length == 0 ||
        postalCode.toString().trim().length == 0 ||
        !phoneNumberValid ||
        addressLine1.trim().length == 0 ||
        Object.keys(postalCodeErrorNotification).length != 0;

    const handleAccountInformationFormSubmit = () => {
        setServerErrorNotification({});
        setServerNotification(false);
        const error = {};
        postalCodeValidation(postalCode);
        error.fullName = fullName.trim().length == 0;
        error.addressLine1 = addressLine1.trim().length == 0;
        error.city = city.trim().length == 0;
        error.fullName = fullName.trim().length == 0;
        error.state = state.trim().length == 0;
        error.phoneNumber = phoneNumber.length == 0;
        error.role = role.length == 0;
        const emailError = validateEmail(userName.trim());
        setErrors(validateEmail(userName.trim()));
        setAccountInfoErrors(error);
        const isPhoneValid = validatePhoneNumber(
            phoneNumber,
            countryDialCode,
            countryCode
        );

        if (
            Object.keys(emailError).length == 0 &&
            !personalInfoButtonDisabled &&
            isPhoneValid
        ) {
            handleAddUser();
        }
        // const emptyInput = inputRefs.current.find((ref) => ref && ref.value === '');

        // if (emptyInput) {
        //   emptyInput.scrollIntoView({ behavior: 'smooth' });
        // }

        // if (!personalInfoButtonDisabled) {
        //     handlePersonalInfo()
        // }
    };

    const editInfoButtonDisabled =
        fullName.trim().length == 0 ||
        city.trim().length == 0 ||
        state.trim().length == 0 ||
        postalCode.toString().trim().length == 0 ||
        addressLine1.trim().length == 0 ||
        Object.keys(postalCodeErrorNotification).length != 0;
    const handleEditInformationFormSubmit = () => {
        setServerErrorNotification({});
        setServerNotification(false);
        const error = {};
        postalCodeValidation(postalCode);
        error.fullName = fullName.trim().length == 0;
        error.addressLine1 = addressLine1.trim().length == 0;
        error.city = city.trim().length == 0;
        error.fullName = fullName.trim().length == 0;
        error.state = state.trim().length == 0;
        error.phoneNumber = phoneNumber.length == 0;
        const emailError = validateEmail(userName.trim());
        setErrors(validateEmail(userName.trim()));
        setAccountInfoErrors(error);
        let phoneNumberValidCheck = phoneNumberValid;
        if (phoneNumber.length == 0) {
            setErrorMessage(t("phone-number-required"));
            setIsPhoneNumberValid(false);
            phoneNumberValidCheck = false;
        } else {
            phoneNumberValidCheck = validatePhoneNumber(
                phoneNumber,
                countryDialCode,
                countryCode
            );
        }
        if (
            Object.keys(emailError).length == 0 &&
            !editInfoButtonDisabled &&
            phoneNumberValidCheck
        ) {
            handleEditUser();
        }
        // const emptyInput = inputRefs.current.find((ref) => ref && ref.value === '');

        // if (emptyInput) {
        //   emptyInput.scrollIntoView({ behavior: 'smooth' });
        // }

        // if (!personalInfoButtonDisabled) {
        //     handlePersonalInfo()
        // }
    };

    // const addUserButtonDisabled = (Object.keys(postalCodeErrorNotification).length != 0 || Object.keys(stateErrorNotification).length != 0 || Object.keys(cityErrorNotification).length != 0 || Object.keys(addressErrorNotification).length != 0 || Object.keys(passwordErrorNotification).length != 0 || Object.keys(errorNotification).length != 0 || Object.keys(emailErrorNotification).length != 0 || userName.length === 0 || fullName.length === 0 || password.length === 0 || addressLine1.length === 0 || city.length === 0 || state.length === 0 || postalCode.length === 0);
    const handleAddUser = async () => {
        setSavingData(true);
        try {
            const data = {
                id: 0,
                username: userName,
                fullName: fullName,
                country: country,
                addressLine: addressLine1,
                addressLine2: addressLine2,
                city: city,
                postalCode: postalCode,
                state: state,
                phoneNumber: phoneNumber,
                organizationName: "",
                VAT: "",
                organisationCountry: "",
                isAgreementSigned: false,
                cognitoUserGroup: role,
            };
            await addUser({ userDetails: data });
        } catch (e) {
            setServerErrorNotification({ message: e.message, status: "error" });
            setServerNotification(true);
        } finally {
            setSavingData(false);
        }
    };

    const handleEditUser = async () => {
        setSavingData(true);
        try {
            const data = {
                id: userId,
                username: userName,
                fullName: fullName,
                country: country,
                addressLine: addressLine1,
                addressLine2: addressLine2,
                city: city,
                postalCode: postalCode,
                state: state,
                phoneNumber: phoneNumber,
            };
            await updateUser({ userDetails: data });
        } catch (e) {
            setServerErrorNotification({
                message: e.message,
                status: "error",
            });
            setServerNotification(true);
        } finally {
            setSavingData(false);
        }
    };

    const getUserList = async (userid) => {
        try {
            setLoadingData(true);
            const { result } = await getUserById(userid);
            setUserDetails(result);
            setFullName(result?.fullName);
            setUserName(result?.username);
            setCountry(result?.country);
            setAddressLine1(result?.addressLine);
            setAddressLine2(result?.addressLine2);
            setCity(result?.city);
            setState(result?.state);
            setPostalCode(result?.postalCode);
            setPhoneNumber(result?.phoneNumber);
            setOrganizationId(result?.organisationID);
            const selectedCountry = COUNTRIES.find(
                (item) => item.name === result?.country
            );
            const phone = "+" + result?.phoneNumber;
            const number = phoneUtil.parse(phone, "");
            const countryDialCode = "+" + number.getCountryCode();
            const countryBasedOnPhoneNumber = COUNTRIES.find(
                (item) => item.dial_code === countryDialCode
            );
            if (countryBasedOnPhoneNumber) {
                setCountryCode(countryBasedOnPhoneNumber?.code);
                setCountryDialCode(
                    countryBasedOnPhoneNumber?.dial_code.toString().replace("+", "")
                );
            } else {
                setCountryCode(selectedCountry?.code);
                setCountryDialCode(
                    selectedCountry?.dial_code.toString().replace("+", "")
                );
            }
        } catch (e) {
            console.log("setting user", e)
        } finally {
            setLoadingData(false);
        }
    };

    const handleClose = () => {
        closeModalAndGoBackToUserList();
    };

    useEffect(() => {
        if (!open) {
            setAccountInfoErrors(AccountInfoErrorsInitialState);
            setCountry(defaultCountry);
            setAddressLine1("");
            setAddressLine2("");
            setCity("");
            setState("");
            setPostalCode("");
            setPhoneNumber(defaultContryCode);
            setFullName("");
            setUserName("");
            setRole("Users");

            setSavingData(false);
            setLoadingData(false);

            setPostalCodeErrorNotification({});
            setErrorMessage("");
            setIsPhoneNumberValid(false);
            setErrors({});
            setServerErrorNotification({});
            setServerNotification(false);
            setOrganizationId(0)
            setCountryCode("IN")
            setCountryDialCode("91")
            return;
        }
        setUserId(parseInt(searchParams?.get("userIdToBeEdited")));
        if (parseInt(searchParams?.get("userIdToBeEdited")) > 0) {
            getUserList(parseInt(searchParams?.get("userIdToBeEdited")));
        }
    }, [open]);

    const handleCountryChange = (e) => {
        const selectedItem = COUNTRIES.find(
            (item) => item.name === e.target.value
        );
        if (Object.keys(selectedItem).length == 0) {
            setPhoneNumber("");
        } else {
            setCountry(e.target.value);
            setPhoneNumber(selectedItem?.dial_code.toString());
            setCountryCode(selectedItem?.code);
            setCountryDialCode(
                selectedItem?.dial_code.toString().replace("+", "")
            );
        }
    };
    return (
        <div className="main--content">
            <SidePanel
                preventCloseOnClickOutside
                includeOverlay
                className="test"
                open={open}
                onRequestClose={handleClose}
                title={isUserEdit ? t("edit-user") : t("add-user")}
                subtitle=""
                actions={[
                    {
                        label: isUserEdit ? t("update") : t("submit"),
                        onClick: () => {
                            isUserEdit
                                ? handleEditInformationFormSubmit()
                                : handleAccountInformationFormSubmit();
                        },
                        kind: "primary",
                        loading: savingData,
                    },
                    {
                        label: t("cancel"),
                        onClick: handleClose,
                        kind: "secondary",
                    },
                ]}
            >
                {false ? (
                    <>
                        <SkeletonText
                            heading={true}
                            lineCount={20}
                            paragraph
                            width="100%"
                        />
                    </>
                ) : (
                    <div className={`story__body-content`}>
                        {serverNotification && (
                            <InlineNotification
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
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    ref={emailInput}
                                    name="userName"
                                    type="text"
                                    id="username"
                                    className={`story__text-input`}
                                    labelText={`${t("user-name-label")} *`}
                                    value={userName}
                                    onChange={handleEmailChange}
                                    invalid={!!errors.userName}
                                    invalidText={errors.userName}
                                />
                            )}
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    ref={fullNameInput}
                                    type="text"
                                    name="fullName"
                                    id="fullname"
                                    labelText={`${t("full-name-label")} *`}
                                    className={`story__text-input`}
                                    value={fullName}
                                    onChange={handleFullName}
                                    invalid={accountInfoErrors.fullName}
                                    invalidText={t("full-name-validation")}
                                />
                            )}
                        </div>
                        <div className={`story__text-inputs`}>
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                !isUserEdit && (
                                    <Select
                                        className={`story__text-input`}
                                        name="role"
                                        value={role}
                                        id="role"
                                        labelText={`${t("role")} *`}
                                        onChange={handleRoleChange}
                                        invalid={accountInfoErrors.role}
                                        invalidText={"User role is required"}
                                    // defaultValue={''}
                                    >
                                        {roleslist.map(
                                            (rolesObject, rolesIndex) => (
                                                <SelectItem
                                                    text={rolesObject.name}
                                                    value={rolesObject.name}
                                                    key={rolesIndex}
                                                />
                                            )
                                        )}
                                    </Select>
                                )
                            )}
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <Select
                                    className={`story__text-input`}
                                    value={country}
                                    id="country-ci"
                                    labelText={`${t("country-label")} *`}
                                    onChange={handleCountryChange}
                                >
                                    {COUNTRIES.map(
                                        (countryObject, countryIndex) => (
                                            <SelectItem
                                                text={countryObject.name}
                                                value={countryObject.name}
                                                key={countryIndex}
                                            />
                                        )
                                    )}
                                </Select>
                            )}
                        </div>
                        <div className={`story__text-inputs`}>
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    type="text"
                                    name="addressLine1"
                                    id="addressline"
                                    className={`story__text-input`}
                                    labelText={`${t("address-line1")} *`}
                                    value={addressLine1}
                                    onChange={handleAddressLine1}
                                    invalid={accountInfoErrors.addressLine1}
                                    invalidText={t("address-line1-validation")}
                                />
                            )}
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    type="text"
                                    id="addressline2"
                                    className={`story__text-input`}
                                    labelText={`${t("address-line2")} `}
                                    value={addressLine2}
                                    onChange={(e) =>
                                        setAddressLine2(e.target.value)
                                    }
                                />
                            )}
                        </div>
                        <div className={`story__text-inputs`}>
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    type="text"
                                    id="city"
                                    name="city"
                                    labelText={`${t("city")} *`}
                                    className={`story__text-input`}
                                    value={city}
                                    onChange={handleCity}
                                    invalid={accountInfoErrors.city}
                                    invalidText={t("city-validation")}
                                />
                            )}
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    type="text"
                                    id="state"
                                    name="state"
                                    labelText={`${t("state")} *`}
                                    className={`story__text-input`}
                                    value={state}
                                    onChange={handleState}
                                    invalid={accountInfoErrors.state}
                                    invalidText={t("state-validation")}
                                />
                            )}
                        </div>
                        <div className={`story__text-inputs`}>
                            {loadingData ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    type="text"
                                    id="postalcode"
                                    name="postalCode"
                                    labelText={`${t("postal-code-label")} *`}
                                    className={`story__text-inputs`}
                                    value={postalCode}
                                    onChange={handlePostalCode}
                                    invalid={
                                        typeof postalCodeErrorNotification ==
                                        "object" &&
                                        Object.keys(postalCodeErrorNotification)
                                            .length !== 0
                                    }
                                    invalidText={
                                        postalCodeErrorNotification &&
                                            postalCodeErrorNotification.title
                                            ? postalCodeErrorNotification.title
                                            : ""
                                    }
                                />
                            )}
                            <div>
                                {loadingData ? (
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
                                            // defaultCountry="in"
                                            style={{
                                                border:
                                                    !phoneNumberValid &&
                                                        errorMessage.length > 0
                                                        ? "2px solid red"
                                                        : 0,
                                            }}
                                            name="phoneNumber"
                                            country={"IN"}
                                            value={phoneNumber}
                                            onChange={(
                                                value,
                                                country,
                                                formattedValue
                                            ) =>
                                                handlePhoneNumber(
                                                    value,
                                                    country,
                                                    formattedValue
                                                )
                                            }
                                        />
                                    </>
                                )}
                                {!phoneNumberValid &&
                                    errorMessage.length > 0 && (
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
                            </div>
                        </div>
                    </div>
                )}
            </SidePanel>
        </div>
    );
};
