import { SidePanel } from "@carbon/ibm-products";
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
import { useState, useRef, useContext, useEffect } from "react";

import { BaseURL } from "../../sdk/constant";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext, COUNTRIES, useUserManagement } from "../../sdk";
import {
    PhoneNumberUtil,
    PhoneNumberFormat as PNF,
} from "google-libphonenumber";
import { InlineLoading } from "carbon-components";
import "./UserDetailPanel.scss";
import { useTranslation } from "react-i18next";
export const UserDetailPanel = ({ open }) => {
    const { t } = useTranslation();
    const phoneUtil = PhoneNumberUtil.getInstance();
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
    const [dataLoading, setDataLoading] = useState(false);
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

    const isUserEdit = searchParams.get("userIdToShowDetails");

    const { closeModalAndGoBackToUserList, getUserById } = useUserManagement();

    const handleClose = () => {
        closeModalAndGoBackToUserList();
    };

    const getUserList = async (userid) => {
        try {
            setDataLoading(true);
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
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (!open) {
            return;
        }
        setUserId(parseInt(searchParams?.get("userIdToShowDetails")));
        if (parseInt(searchParams?.get("userIdToShowDetails")) > 0) {
            getUserList(parseInt(searchParams?.get("userIdToShowDetails")));
        }
    }, [open]);

    return (
        <div className="user-detail-panel">
            <SidePanel
                preventCloseOnClickOutside
                includeOverlay
                className="test"
                open={open}
                onRequestClose={handleClose}
                title={t("user-detail")}
                subtitle=""
                actions={[]}
            >
                <div className={`story__body-content`}>
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
                                name="userName"
                                type="text"
                                id="username"
                                className={`story__text-input`}
                                labelText={`${t("user-name-label")} *`}
                                value={userName}
                                disabled={true}
                            />
                        )}
                        {dataLoading ? (
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
                                disabled={true}
                            />
                        )}
                    </div>
                    <div className={`story__text-inputs`}>
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <TextInput
                                className={`story__text-input`}
                                name="role"
                                // defaultValue={role}
                                value={role}
                                id="role"
                                labelText={`${t("role")} *`}
                                disabled={true}
                            ></TextInput>
                        )}
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <TextInput
                                className={`story__text-input`}
                                value={country}
                                id="country-ci"
                                labelText={`${t("country-label")} *`}
                                disabled={true}
                            ></TextInput>
                        )}
                    </div>
                    <div className={`story__text-inputs`}>
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <TextInput
                                type="text"
                                name="addressLine1"
                                id="addressline"
                                className={`story__text-input`}
                                labelText={`${t("address-line1")} *`}
                                value={addressLine1}
                                disabled={true}
                            />
                        )}
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <TextInput
                                type="text"
                                id="addressline1"
                                className={`story__text-input`}
                                labelText={`${t("address-line2")} *`}
                                disabled={true}
                            />
                        )}
                    </div>
                    <div className={`story__text-inputs`}>
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <TextInput
                                type="text"
                                id="city"
                                name="city"
                                labelText={`${t("city")} *`}
                                className={`story__text-input`}
                                value={city}
                                disabled={true}
                            />
                        )}
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <TextInput
                                type="text"
                                id="state"
                                name="state"
                                labelText={`${t("state")} *`}
                                className={`story__text-input`}
                                value={state}
                                disabled={true}
                            />
                        )}
                    </div>
                    <div className={`story__text-inputs`}>
                        {dataLoading ? (
                            <TextInputSkeleton className="skeleton-loading" />
                        ) : (
                            <TextInput
                                type="text"
                                id="postalcode"
                                name="postalCode"
                                labelText={`${t("postal-code-label")} *`}
                                className={`story__text-inputs`}
                                value={postalCode}
                                disabled={true}
                            />
                        )}
                        <div>
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
                                            disabled: true,
                                          }}
                                        disableDropdown={true}
                                        style={{
                                            border:
                                                !phoneNumberValid &&
                                                errorMessage.length > 0
                                                    ? "2px solid red"
                                                    : 0,
                                            cursor: "not-allowed",
                                        }}
                                        name="phoneNumber"
                                        country={"IN"}
                                        value={phoneNumber}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
