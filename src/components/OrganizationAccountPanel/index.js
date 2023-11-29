import { SidePanel, pkg } from "@carbon/ibm-products";
import {
    TextInputSkeleton, Theme,
    TextInput, Dropdown,
    InlineNotification
} from "@carbon/react";
import React, { useState, useEffect, useRef, useMemo, useCallback, useContext } from "react";
import { BaseURL, COUNTRIES } from "../../sdk/constant";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useAuth, useThemePreference, handleActiveTabCfg, TabContext } from "../../sdk";

import {
    PhoneNumberUtil,
} from "google-libphonenumber";
import "./OrganizationAccountPanel.scss";
import { useTranslation } from "react-i18next";
import { useOrganizationAccount } from "../../sdk/context/OrganizationAccountManagementContext";
import es from 'react-phone-input-2/lang/es.json'
import de from 'react-phone-input-2/lang/de.json'
import fr from 'react-phone-input-2/lang/fr.json'

pkg.component.SidePanel = true;

// OrganizationAccountPanel is the organization account panel component
export const OrganizationAccountPanel = ({ open }) => {
    const { t } = useTranslation();
    const { closeOrganizationAccountPanel, openDeleteModal, notification, setNotification } = useOrganizationAccount();

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [country, setCountry] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [vatNumber, setVatNumber] = useState("");
    const [organizationCountry, setOrganizationCountry] = useState("");

    const { themePreference } = useThemePreference();
    const { user, refreshPostSignIn, getUser, authFetch } = useAuth();
    const phoneUtil = PhoneNumberUtil.getInstance();
    const [disable, setDisable] = useState(false)
    const [dataLoading, setDataLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const inputRefs = useRef([]);
    const [defaultData, setDefaultData] = useState({});

    // phone number input localization
    const phoneNumberInputLocalization = useCallback(() => {
        switch (user?.languagePreference) {
            case 'es':
                return es;
            case 'de':
                return de;
            case 'fr':
                return fr;
            default:
                return {};
        }
    }, [user?.languagePreference]);

    /* Function to set state, check email address validation when email address is changed  */
    const handleEmailChange = (value) => {
        setNotification({});
        setEmail(value);
        validateEmail(value);
    };

    // Function to set state, check full name validation when full name is changed
    const handleFullNameChange = (e) => {
        setNotification({});
        const { value } = e.target;
        setFullName(value);
        delete errors.fullName;
        if (value.trim() === "") {
            errors.fullName = t("full-name-required")
        }
        setErrors(errors);
    };

    // Function to set state, check country validation when country is changed
    const handleCountryChange = (data) => {
        setNotification({});
        setCountry(data.selectedItem);
    }

    // Function to set state, check address line validation when address line is changed
    const handleAddressLineChange = (e) => {
        setNotification({});
        const { value } = e.target;
        setAddressLine(value);
        delete errors.addressLine;
        if (value.trim() === "") {
            errors.addressLine = t("address-line1-validation");
        }
        setErrors(errors);
    }

    // Function to set state, check address line 2 validation when address line 2 is changed
    const handleAddressLine2Change = (e) => {
        setNotification({});
        const { value } = e.target;
        setAddressLine2(value);
    }

    // Function to set state, check city validation when city is changed
    const handleCityChange = (e) => {
        setNotification({});
        const { value } = e.target;
        setCity(value);
        delete errors.city;
        if (value.trim() === "") {
            errors.city = t("city-required");
        }
        setErrors(errors);
    }

    // Function to set state, check state validation when state is changed
    const handleStateChange = (e) => {
        setNotification({});
        const { value } = e.target;
        setState(value);
        delete errors.state;
        if (value.trim() === "") {
            errors.state = t("state-required");
        }
        setErrors(errors);
    }

    // Function to set state, check postal code validation when postal code is changed
    const handlePostalCodeChange = (e) => {
        setNotification({});
        const { value } = e.target;
        setPostalCode(value);
        delete errors.postalCode;
        if (value.trim() === "") {
            errors.postalCode = t("postal-code-required");
        }
        setErrors(errors);
    }

    // Function to set state, check phone number validation when phone number is changed
    const handlePhoneNumberChange = (value, country) => {
        setPhoneNumber(value)
        validatePhoneNumber(value, country?.dialCode, country?.countryCode);
    }

    // Function to set state, check organization name validation when organization name is changed
    const handleOrganizationNameChange = (e) => {
        setNotification({});
        const { value } = e.target;
        setOrganizationName(value);
        delete errors.organizationName;
        if (value.trim() === "") {
            errors.organizationName = t("organization-name-required");
        }
        setErrors(errors);
    }

    // Function to set state, check organization number validation when organization number is changed
    const handleVatNumberChange = (e) => {
        setNotification({});
        const { value } = e.target;
        setVatNumber(value);
        delete errors.vatNumber;
        if (value.trim() === "") {
            errors.vatNumber = t("organization-number-required");
        }
        setErrors(errors);
    }

    // Function to set state, check organization country validation when organization country is changed
    const handleOrganizationCountryChange = (data) => {
        setNotification({});
        setOrganizationCountry(data.selectedItem);
    }

    // Function to check email address validation
    const validateEmail = (email) => {
        delete errors.email;
        if (email.trim() === "") {
            errors.email = t("email-required");
        } else if (email.length > 0) {
            if (!checkEmailValid(email.trim())) {
                errors.email = t("email-format-error")
            }
        }

        setErrors(errors);
    };

    /* Function to check if email address is valid or not */
    const checkEmailValid = (value) => {
        return String(value)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    // Function to check phone number is valid or not
    const validatePhoneNumber = (value, dialCode, country) => {
        delete errors.phoneNumber;
        if (value === dialCode) {
            errors.phoneNumber = t("phone-number-validation")
        } else {
            const phoneNumberWithoutDialCode = value.toString().replace(dialCode, "");
            if (phoneNumberWithoutDialCode.length === 0) {
                errors.phoneNumber = t("phone-number-required")
            } else if (phoneNumberWithoutDialCode === value) {
                errors.phoneNumber = t("phone-number-validation")
            } else {
                try {
                    const number = phoneUtil.parse(phoneNumberWithoutDialCode, country);
                    const isValid = phoneUtil.isValidNumber(number);
                    if (!isValid) {
                        errors.phoneNumber = t("phone-number-validation")
                    }
                } catch (e) {
                    errors.phoneNumber = t("phone-number-validation")
                }
            }
        }
        setErrors(errors)
    }

    const { activeTab } = useContext(TabContext)
    // Function to close organization account panel
    const handleClose = useCallback(() => {
        setNotification({});
        setErrors({});
        closeOrganizationAccountPanel()
        handleActiveTabCfg(activeTab)
    }, [activeTab]);

    // Function to update organization account
    const handleUpdateOrganizationAccount = () => {
        setNotification({});

        const fetchData = async () => {
            try {
                setDisable(true)
                const data = {
                    email: email,
                    fullName: fullName,
                    country: country,
                    addressLine: addressLine,
                    addressLine2: addressLine2,
                    city: city,
                    state: state,
                    postalCode: postalCode,
                    phoneNumber: phoneNumber,
                    organizationName: organizationName,
                    VAT: vatNumber,
                    organizationCountry: organizationCountry,
                };
                const response = await authFetch(`${BaseURL}/update-organization-account`, {
                    method: "post",
                    body: JSON.stringify(data),
                });
                const res = await response.json();
                if (response.ok) {
                    setNotification({
                        type: "success",
                        message: t("update-organization-account-successfully"),
                    });
                    setDisable(false)
                    // handleClose()
                    await getUser();
                    await refreshPostSignIn();
                } else {
                    setDisable(false)
                    setNotification({
                        message: res.error,
                        type: "error",
                    });
                }
            } catch (e) {
                setNotification({
                    message: 'error occurred while update organization account',
                    type: "error",
                });
                setDisable(false)
            }
        };

        fetchData()
    };

    // Function to open delete modal
    const handleDeleteOrganizationAccount = () => {
        openDeleteModal(
            {
                confirmText: t("delete-account"),
            }
        );
    };

    // Function to check if form can be submitted or not
    const canSubmitted = useMemo(() => {
        if (dataLoading) {
            return false
        }

        if (Object.keys(errors).length > 0) {
            return false
        }

        return defaultData?.email !== email ||
            defaultData?.fullName !== fullName ||
            defaultData?.country !== country ||
            defaultData?.addressLine !== addressLine ||
            defaultData?.addressLine2 !== addressLine2 ||
            defaultData?.city !== city ||
            defaultData?.state !== state ||
            defaultData?.postalCode !== postalCode ||
            defaultData?.phoneNumber.substring(1) !== phoneNumber && defaultData?.phoneNumber !== phoneNumber ||
            defaultData?.organizationName !== organizationName ||
            defaultData?.VAT !== vatNumber ||
            defaultData?.organizationCountry !== organizationCountry
    },
        [dataLoading, email, fullName, country, addressLine, city, state, postalCode, phoneNumber, organizationName, vatNumber, organizationCountry,
            defaultData.email, defaultData.fullName, defaultData.country, defaultData.addressLine, defaultData.city, defaultData.state,
            defaultData.postalCode, defaultData.phoneNumber, defaultData.organizationName, defaultData.VAT,
            defaultData.organizationCountry, errors])

    // fetch organization account data when open panel
    useEffect(() => {
        const getOrganizationAccount = async () => {
            try {
                // setNotification({}); for delete server error notification
                setDataLoading(true);
                const response = await authFetch(`${BaseURL}/organization-account`, {
                    method: "GET",
                })
                const res = await response.json();
                if (response.ok) {
                    setEmail(res?.email)
                    setFullName(res?.fullName);
                    setCountry(res?.country);
                    setAddressLine(res?.addressLine);
                    setAddressLine2(res?.addressLine2);
                    setCity(res?.city);
                    setState(res?.state);
                    setPostalCode(res?.postalCode);
                    setPhoneNumber(res?.phoneNumber);
                    setOrganizationName(res?.organizationName);
                    setVatNumber(res?.VAT);
                    setOrganizationCountry(res?.organizationCountry);
                    setDefaultData(res)
                } else {
                    setNotification({
                        message: res.error,
                        type: "error",
                    });
                }
            } catch (e) {
            } finally {
                setDataLoading(false);
            }
        };
        if (!open) {
            return;
        }
        getOrganizationAccount()
    }, [open, authFetch]);

    return (
        <Theme theme={themePreference === "white" ? "g10" : "g90"}>
            <div className="user-detail-panel">
                <SidePanel
                    preventCloseOnClickOutside
                    includeOverlay
                    className="test"
                    open={open}
                    title={t("organization-account")}
                    subtitle={t("organization-account-information")}
                    onRequestClose={handleClose}
                    actions={[
                        {
                            label: t('save'),
                            onClick: function onClick(event) {
                                event.preventDefault();
                                handleUpdateOrganizationAccount();
                            },
                            kind: 'primary',
                            disabled: !canSubmitted,
                            loading: disable,
                        },
                        {
                            label: t("cancel"),
                            onClick: handleClose,
                            kind: 'secondary',
                        },
                        {
                            label: t("delete-account"),
                            onClick: handleDeleteOrganizationAccount,
                            kind: 'danger',
                        }
                    ]}
                >
                    <div className={"story__body-content"}>
                        {!!notification?.message && (
                            <InlineNotification
                                className="error-notification-box"
                                iconDescription="Close Notification"
                                subtitle={notification?.message}
                                onCloseButtonClick={() => {
                                    setNotification({});
                                }}
                                timeout={0}
                                title={""}
                                kind={notification?.type}
                            />
                        )}

                        <div>
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
                                    disabled={dataLoading}
                                />
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="fullName"
                                    ref={(el) => (inputRefs.current[1] = el)}
                                    labelText={`${t("full-name-label")} *`}
                                    value={fullName}
                                    onChange={handleFullNameChange}
                                    invalid={!!errors.fullName}
                                    invalidText={errors.fullName}
                                    disabled={dataLoading}
                                />
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <>
                                    <Dropdown
                                        id="country"
                                        ref={(el) => (inputRefs.current[2] = el)}
                                        titleText={`${t("country-label")} *`}
                                        initialSelectedItem={''}
                                        items={COUNTRIES.map(obj => obj.name)}
                                        selectedItem={country}
                                        onChange={selectedItem => handleCountryChange(selectedItem)}
                                        itemToString={(item) => (t(`${item}`))}
                                        label={''} />
                                </>
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="addressLine"
                                    ref={(el) => (inputRefs.current[3] = el)}
                                    labelText={`${t("address-line1")} *`}
                                    value={addressLine}
                                    onChange={handleAddressLineChange}
                                    invalid={!!errors.addressLine}
                                    invalidText={errors.addressLine}
                                    disabled={dataLoading}
                                />
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="addressLine2"
                                    ref={(el) => (inputRefs.current[4] = el)}
                                    labelText={`${t("address-line2")}`}
                                    value={addressLine2}
                                    onChange={handleAddressLine2Change}
                                    invalid={!!errors.addressLine2}
                                    invalidText={errors.addressLine2}
                                    disabled={dataLoading}
                                />
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="city"
                                    ref={(el) => (inputRefs.current[5] = el)}
                                    labelText={`${t("city")} *`}
                                    value={city}
                                    onChange={handleCityChange}
                                    invalid={!!errors.city}
                                    invalidText={errors.city}
                                    disabled={dataLoading}
                                />
                            )}


                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="state"
                                    ref={(el) => (inputRefs.current[6] = el)}
                                    labelText={`${t("state")} *`}
                                    value={state}
                                    onChange={handleStateChange}
                                    invalid={!!errors.state}
                                    invalidText={errors.state}
                                    disabled={dataLoading}
                                />
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="postalCode"
                                    ref={(el) => (inputRefs.current[7] = el)}
                                    labelText={`${t("postal-code")} *`}
                                    value={postalCode}
                                    onChange={handlePostalCodeChange}
                                    invalid={!!errors.postalCode}
                                    invalidText={errors.postalCode}
                                    disabled={dataLoading}
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
                                        className="phone-input-signup"
                                        localization={phoneNumberInputLocalization()}
                                        ref={(el) => (inputRefs.current[8] = el)}
                                        inputProps={{
                                            disabled: false,
                                        }}
                                        disableDropdown={false}
                                        style={{
                                            border:
                                                !!errors.phoneNumber
                                                    ? "2px solid red"
                                                    : 0,
                                            cursor: "not-allowed",
                                        }}
                                        name="phoneNumber"
                                        country={""}
                                        value={phoneNumber}
                                        onChange={(value, country, formattedValue) =>
                                            handlePhoneNumberChange(value, country)
                                        }
                                    />
                                    {!!errors.phoneNumber && (
                                        <p
                                            style={{
                                                marginTop: "4px",
                                                fontSize: "12px",
                                                color: "#DA1E28",
                                            }}
                                        >
                                            {errors.phoneNumber}
                                        </p>
                                    )}
                                </>
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="organizationName"
                                    ref={(el) => (inputRefs.current[9] = el)}
                                    labelText={`${t("organization-name")} *`}
                                    value={organizationName}
                                    onChange={handleOrganizationNameChange}
                                    invalid={!!errors.organizationName}
                                    invalidText={errors.organizationName}
                                    disabled={dataLoading}
                                />
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <TextInput
                                    id="vatNumber"
                                    ref={(el) => (inputRefs.current[10] = el)}
                                    labelText={`${t("organization-number")} *`}
                                    value={vatNumber}
                                    onChange={handleVatNumberChange}
                                    invalid={!!errors.vatNumber}
                                    invalidText={errors.vatNumber}
                                    disabled={dataLoading}
                                />
                            )}

                            {dataLoading ? (
                                <TextInputSkeleton className="skeleton-loading" />
                            ) : (
                                <>
                                    <Dropdown
                                        id="organizationCountry"
                                        ref={(el) => (inputRefs.current[11] = el)}
                                        titleText={`${t("organization-region")} *`}
                                        initialSelectedItem={''}
                                        items={COUNTRIES.map(obj => obj.name)}
                                        selectedItem={organizationCountry}
                                        onChange={selectedItem => handleOrganizationCountryChange(selectedItem)}
                                        itemToString={(item) => (t(`${item}`))}
                                        label={""} />
                                </>
                            )}

                        </div>
                    </div>
                </SidePanel>
            </div>
        </Theme>
    );
};

export default OrganizationAccountPanel
