import { SidePanel } from "@carbon/ibm-products";
import {
    Button,
    TextInput,
    PasswordInput,
    Select,
    SelectItem,
    ToastNotification,
} from "carbon-components-react";
import "./SidePanel.scss";
import { useState, useRef, useContext, useEffect } from "react";

import { BaseURL } from "../../sdk/constant";
import PhoneInput from "react-phone-input-2";
// import { countries } from 'react-phone-input-2/countries';
// import 'react-phone-input-2/dist/style.css'
import "react-phone-input-2/lib/style.css";
// import './AddUser.scss';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext, COUNTRIES, useUserManagement } from "../../sdk";
import {
    PhoneNumberUtil,
    PhoneNumberFormat as PNF,
} from "google-libphonenumber";
import { InlineLoading } from "carbon-components";
export const SidePanels = () => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const [open, setOpen] = useState(true);
    const [accountInfoErrors, setAccountInfoErrors] = useState({
        userName: false,
        password: false,
        fullName: false,
        addressLine1: false,
        city: false,
        state: false,
        postalCode: false,
        phoneNumber: false,
        role: false,
    });
    const [country, setCountry] = useState("India");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("91");
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
    const [loading, setLoading] = useState(false);
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
    const [countryDialCode, setCountryDialCode] = useState("91");

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

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const validateEmail = (email) => {
        const errors = {};
        if (email.trim() === "") {
            errors.userName = "Email is required";
        } else if (email.length > 0) {
            if (!checkEmailValid(email.trim())) {
                errors.userName = "Suggested format (name@company.com)";
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
            setErrorMessage("Enter valid phone number");
            setIsPhoneNumberValid(false);
            return false;
        } else {
            const phoneNumberWithoutDialCode = value
                .toString()
                .replace(dialCode, "");
            if (phoneNumberWithoutDialCode.length == 0) {
                setErrorMessage("Phone number is required");
                setIsPhoneNumberValid(false);
                return false;
            } else if (phoneNumberWithoutDialCode == value) {
                setErrorMessage("Enter valid phone number");
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
                        setErrorMessage("Enter valid phone number");
                        setIsPhoneNumberValid(false);
                        return false;
                    } else {
                        setErrorMessage("");
                        setIsPhoneNumberValid(true);
                        return true;
                    }
                } catch (e) {
                    setErrorMessage("Enter valid phone number");
                    setIsPhoneNumberValid(false);
                    return false;
                }
            }
        }
    };

    const handlePhoneNumber = (value, country, formattedValue) => {
        setPhoneNumber(value);
        validatePhoneNumber(value, country.dialCode, country?.countryCode);
    };

    const postalCodeValidation = (value) => {
        if (value.length === 0) {
            setPostalCodeErrorNotification({
                title: "Postal code is required",
            });
        } else if (!/^\d+$/.test(value)) {
            setPostalCodeErrorNotification({
                title: "Postal code should be integer",
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
            setErrorMessage("Phone number is required");
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
        setLoading(true);
        try {
            const data = {
                id: 0,
                username: userName,
                fullName: fullName,
                country: country,
                addressLine: addressLine1,
                addressLine2: addressLine2,
                city: city,
                postalCode: parseInt(postalCode),
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
            setLoading(false);
        }
    };

    const handleEditUser = async () => {
        setLoading(true);
        try {
            const data = {
                id: userId,
                username: userName,
                fullName: fullName,
                country: country,
                addressLine: addressLine1,
                addressLine2: addressLine2,
                city: city,
                postalCode: parseInt(postalCode),
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
            setLoading(false);
        }
    };

    const getUserList = async (userid) => {
        try {
            setLoading(true);
            const { result } = await getUserById(userid);
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
            const selectedItem = COUNTRIES.find(
                (item) => item.name === result?.country
            );
            setCountryCode(selectedItem?.code);
            setCountryDialCode(
                selectedItem?.dial_code.toString().replace("+", "")
            );
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        closeModalAndGoBackToUserList();
    };

    useEffect(() => {
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
                title={isUserEdit ? "Edit User" : "Add User"}
                subtitle=""
                actions={[
                    {
                        label: isUserEdit ? "Update" : "Submit",
                        onClick: () => {
                            isUserEdit
                                ? handleEditInformationFormSubmit()
                                : handleAccountInformationFormSubmit();
                        },
                        kind: "primary",
                        loading
                    },
                    {
                        label: "Cancel",
                        onClick: handleClose,
                        kind: "secondary",
                    },
                ]}
            >
                <div className={`story__body-content`}>
                    {serverNotification && (
                        <ToastNotification
                            className="error-notification-box"
                            iconDescription="describes the close button"
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
                        <TextInput
                            ref={emailInput}
                            name="userName"
                            type="text"
                            id="username"
                            className={`story__text-input`}
                            labelText="User Name *"
                            value={userName}
                            onChange={handleEmailChange}
                            invalid={!!errors.userName}
                            invalidText={errors.userName}
                            disabled={loading ? true : false}
                        />
                        <TextInput
                            ref={fullNameInput}
                            type="text"
                            name="fullName"
                            id="fullname"
                            labelText="Full Name *"
                            className={`story__text-input`}
                            value={fullName}
                            onChange={handleFullName}
                            invalid={accountInfoErrors.fullName}
                            invalidText={"Full name is required"}
                        />
                    </div>
                    <div className={`story__text-inputs`}>
                        {!isUserEdit && (
                            <Select
                                className={`story__text-input`}
                                name="role"
                                value={role}
                                id="country-ci"
                                labelText="Role *"
                                onChange={handleRoleChange}
                                invalid={accountInfoErrors.role}
                                invalidText={"User role is required"}
                                // defaultValue={''}
                            >
                                {roleslist.map((rolesObject, rolesIndex) => (
                                    <SelectItem
                                        text={rolesObject.name}
                                        value={rolesObject.name}
                                        key={rolesIndex}
                                    />
                                ))}
                            </Select>
                        )}
                        <Select
                            className={`story__text-input`}
                            value={country}
                            id="country-ci"
                            labelText="Country or region of residence*"
                            onChange={handleCountryChange}
                        >
                            {COUNTRIES.map((countryObject, countryIndex) => (
                                <SelectItem
                                    text={countryObject.name}
                                    value={countryObject.name}
                                    key={countryIndex}
                                />
                            ))}
                        </Select>
                    </div>
                    <div className={`story__text-inputs`}>
                        <TextInput
                            type="text"
                            name="addressLine1"
                            id="addressline"
                            className={`story__text-input`}
                            labelText="Address line 1 *"
                            value={addressLine1}
                            onChange={handleAddressLine1}
                            invalid={accountInfoErrors.addressLine1}
                            invalidText={"Address line1 is required"}
                        />
                        <TextInput
                            type="text"
                            id="addressline1"
                            className={`story__text-input`}
                            labelText="Address line 2 (optional)"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                        />
                    </div>
                    <div className={`story__text-inputs`}>
                        <TextInput
                            type="text"
                            id="city"
                            name="city"
                            labelText="City *"
                            className={`story__text-input`}
                            value={city}
                            onChange={handleCity}
                            invalid={accountInfoErrors.city}
                            invalidText={"City name is required"}
                        />
                        <TextInput
                            type="text"
                            id="state"
                            name="state"
                            labelText="State *"
                            className={`story__text-input`}
                            value={state}
                            onChange={handleState}
                            invalid={accountInfoErrors.state}
                            invalidText={"State is required"}
                        />
                    </div>
                    <div className={`story__text-inputs`}>
                        <TextInput
                            type="text"
                            id="postalcode"
                            name="postalCode"
                            labelText="Postal Code *"
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
                        <div>
                            <div className="phone-label-wrapper">
                                <p className="phone-label">Phone Number *</p>
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
                                onChange={(value, country, formattedValue) =>
                                    handlePhoneNumber(
                                        value,
                                        country,
                                        formattedValue
                                    )
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
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
