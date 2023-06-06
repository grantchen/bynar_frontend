import {
  Button,
  Checkbox,
  Column,
  Content,
  Grid,
  Heading,
  InlineLoading,
  Link,
  Select,
  SelectItem,
  TextInput,
  ToastNotification,
} from "@carbon/react";
import { CardFrame, Frames } from "frames-react";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BaseURL,
  COUNTRIES,
  formatCVC,
  formatCreditCardNumber,
  formatExpirationDate,
  useAuth,
} from "./../../sdk";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import "./../../styles/paymentform.scss";
import "./signup.scss";
import {
  PhoneNumberUtil} from "google-libphonenumber";

const Signup = () => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const navigate = useNavigate();
  const [errorNotification, setErrorNotification] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendCodeLoading, setResendCodeLoading] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmailAddress] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordArray, setPasswordArray] = useState(Array(6).fill(false));
  const [passwordStrengthWidth, setpaswordStrengthWidth] = useState(0);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [emailIsValid, setEmailValid] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [isProfileInfoUpdated, setIsProfileInfoUpdated] = useState(false);
  const [isAccountInfoUpdated, setIsAccountInfoUpdated] = useState(false);
  const [country, setCountry] = useState("Albania");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("0355");
  const [isTaxInfoUpdated, setIsTaxInfoUpdated] = useState(false);
  const [vatNumber, setVatNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationCountry, setCountryName] = useState("Albania");
  const [isGstValid, setGstValid] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiryDate, setCardExpiryDate] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [isCardInfoUpdated, setCardInfoUpdated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isAccountInfoError, setIsAccountInfoError] = useState(false);
  const [isVerifyEmailInfoError, setIsVerifyEmailError] = useState(false);
  const [postalCodeErrorNotification, setPostalCodeErrorNotification] =
    useState({});
  const [isCreateAccountError, setIsCreateAccountError] = useState(false);
  const [userId, setUserId] = useState();
  const [message, setMessage] = useState("creating account ...");
  const [validationToken, setValidationToken] = useState("");
  const ref = useRef(null);
  const [loadingCardSuccess, setLoadingCardSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [phoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountInfoErrors, setAccountInfoErrors] = useState({
    fullName: false,
    addressLine1: false,
    city: false,
    state: false,
    postalCode: false,
    phoneNumber: false,
  });
  const [organizationInfoErrors, setOrganizationInfoErrors] = useState({
    organizationName: false,
    organizationNumber: false,
  });
  const [countryCode, setCountryCode] = useState('AL');
  const [countryDialCode, setCountryDialCode] = useState('0355');

  const {hackPatchToken} = useAuth()


  const accountInfoButtonDisabled =
    !emailIsValid || email.length === 0 || isAccountInfoError;
  const personalInfoButtonDisabled =
    fullName.trim().length === 0 ||
    city.trim().length === 0 ||
    state.trim().length === 0 ||
    postalCode.trim().length === 0 ||
    !phoneNumberValid ||
    addressLine1.trim().length === 0 ||
    Object.keys(postalCodeErrorNotification).length != 0;
  const verificationEmailButtonDisabled =
    verificationCode.length === 0 || isVerifyEmailInfoError;

  const handleFullName = (e) => {
    const { name, value } = e.target;
    setFullName(value);
    setAccountInfoErrors({
      ...accountInfoErrors,
      [name]: value.trim().length === 0,
    });
  };

  const handleAddressLine1 = (e) => {
    const { name, value } = e.target;
    setAddressLine1(value);
    setAccountInfoErrors({
      ...accountInfoErrors,
      [name]: value.trim().length === 0,
    });
  };

  const handleCity = (e) => {
    const { name, value } = e.target;
    setCity(value);
    setAccountInfoErrors({
      ...accountInfoErrors,
      [name]: value.trim().length === 0,
    });
  };

  const handleState = (e) => {
    const { name, value } = e.target;
    setState(value);
    setAccountInfoErrors({
      ...accountInfoErrors,
      [name]: value.trim().length === 0,
    });
  };

  const validatePhoneNumber = (value, dialCode, country) => {
    if (value == dialCode) {
      setErrorMessage("Enter valid phone number")
      setIsPhoneNumberValid(false)
    }
    else {
      const phoneNumberWithoutDialCode = value.toString().replace(dialCode, '');
      if (phoneNumberWithoutDialCode.length == 0) {
        setErrorMessage("Phone number is required")
        setIsPhoneNumberValid(false)
      }
      else if (phoneNumberWithoutDialCode == value) {
        setErrorMessage("Enter valid phone number")
        setIsPhoneNumberValid(false)
      }
      else {

        try {
          const number = phoneUtil.parse(phoneNumberWithoutDialCode, country);
          const isValid = phoneUtil.isValidNumber(number);
          if (!isValid) {
            setErrorMessage("Enter valid phone number")
            setIsPhoneNumberValid(false)
          }
          else {
            setErrorMessage("")
            setIsPhoneNumberValid(true)
          }
        }
        catch (e) {
          setErrorMessage("Enter valid phone number")
          setIsPhoneNumberValid(false)
        }
      }
    }
  }

  const handlePhoneNumber = (value, country, formattedValue) => {
    setPhoneNumber(value)
    setCountryCode(country?.countryCode);
    setCountryDialCode(
        country?.dialCode.toString().replace("+", "")
    );
    validatePhoneNumber(value, country.dialCode, country?.countryCode);

  }


  const handleVerificationCodeChange = (value) => {
    setErrorNotification({});
    setVerificationCode(value);
    setIsError(false);
    setIsVerifyEmailError(false);
    const errors = validateVerifyEmailForm(value);
    setErrors(errors);
  };

  useLayoutEffect(() => {
    handlePasswordStrengthLength(password);
  }, [isPasswordVisible]);

  const handlePasswordStrengthLength = (value) => {
    const lengthRegex = /^.{8,}$/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialcharacterRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
    const tempArray = [
      lengthRegex.test(value.trim()),
      uppercaseRegex.test(value),
      lowercaseRegex.test(value),
      numberRegex.test(value),
      specialcharacterRegex.test(value),
      value.length === value.trim().length,
    ];
    setpaswordStrengthWidth(
      (tempArray.filter((i) => i === true).length * ref?.current?.offsetWidth) /
      6
    );
  };

  /* Function to check if email address is valid or not */
  const checkEmailValid = (value) => {
    return String(value)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  /* Function to set state, check email address validation when email address is changed  */
  const handleEmailChange = (value) => {
    setErrorNotification({});
    setIsError(false);
    setIsAccountInfoError(false);
    setEmailAddress(value);
    const errors = validateOrganizationForm(value);
    setErrors(errors);
    // setEmailValid(checkEmailValid(value));
  };

  const handlePasswordChange = (value) => {
    setErrorNotification({});
    setIsError(false);
    setIsAccountInfoError(false);
    setPassword(value);
    const lengthRegex = /^.{8,}$/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialcharacterRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
    const tempArray = [
      lengthRegex.test(value.trim()),
      uppercaseRegex.test(value),
      lowercaseRegex.test(value),
      numberRegex.test(value),
      specialcharacterRegex.test(value),
      value.length === value.trim().length,
    ];
    setPasswordArray(tempArray);
    setpaswordStrengthWidth(
      (tempArray.filter((i) => i === true).length * ref?.current?.offsetWidth) /
      6
    );
    setPasswordIsValid(
      lengthRegex.test(value.trim()) &&
      uppercaseRegex.test(value) &&
      lowercaseRegex.test(value) &&
      numberRegex.test(value) &&
      specialcharacterRegex.test(value)
    );
  };

  /* Function to send email as payload  ,if api response is 200 then proceed with email verification,otherwise in case of error show error in signup page*/
  const handleSignupRequest = () => {
    const fetchData = async () => {
      setLoading(true);
      setResendCodeLoading(true);
      setErrorNotification({});
      setIsError(false);
      try {
        const data = {
          email: email.trim(),
          // password: password,
        };
        const response = await fetch(`${BaseURL}/signup`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = await response.json();
        if (response.ok) {
          setActiveStep(2);
          setIsError(false);
          setIsAccountInfoError(false);
          if (activeStep === 2) {
            setErrorNotification({
              title: `verification code re-send to ${email}`,
              status: "success",
            });
            setIsError(true);
          }
        } else if (response.status === 500) {
          setIsError(true);
          setActiveStep(1);
          setErrorNotification({
            title:
              res.error === "username already exist" || "email is not valid"
                ? res.error
                : "Some error occured, please try after some time",
            status: "error",
          });
        }
        setLoading(false);
        setResendCodeLoading(false);
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    };
    fetchData();
  };

  const handleEditClick = (value) => {
    setActiveStep(value);
    setIsAccountInfoUpdated(true);
  };

  /* Function to verify user email during signup process , if email is verified sucessfully then proceed to next step ,otherwise in case of error show error in signup page*/
  const handleVerifyEmail = () => {
    const fetchData = async () => {
      setErrorNotification({});
      setIsError(false);
      try {
        setVerifyEmailLoading(true);
        const data = {
          email: email,
          code: verificationCode,
        };
        // debugger
        // await Auth.confirmSignUp(email, verificationCode);
        // debugger
        const response = await fetch(`${BaseURL}/confirm-email`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = await response.json();
        if (response.ok) {
          setActiveStep(3);
          setIsError(false);
          setIsVerifyEmailError(false);
          setUserId(res?.accountID);
        } else if (response.status === 500) {
          setIsError(true);
          setIsVerifyEmailError(true);
          setErrorNotification({
            title: "Enter valid confirmation email code",
            status: "error",
          });
          setVerificationCode("");
        }
        setVerifyEmailLoading(false);
      } catch (e) {
        setVerifyEmailLoading(false);
        console.log(e);
      }
    };
    fetchData();
  };

  const handleVerifyCard = (token) => {
    const fetchData = async () => {
      try {
        // setLoadingCardSuccess(true)
        const data = {
          id: userId,
          token: token,
          email: email,
          name: fullName,
        };
        const response = await fetch(`${BaseURL}/verify-card`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = await response.json();

        if (response.ok) {
          handleCreateAccount();
        } else if (response.status === 500) {
          setIsError(true);
          setErrorNotification({
            title: "error occured while validating card",
            status: "error",
          });
        }
        setLoadingCardSuccess(false);
      } catch (e) {
        setLoadingCardSuccess(false);
        console.log(e);
      }
    };
    fetchData();
  };

  /* Function to create user account ,if account created sucessfully then navigate to signin page ,otherwise in case of error show error in signup page */
  const handleCreateAccount = () => {
    const fetchData = async () => {
      try {
        setLoadingSuccess(true);
        const data = {
          id: userId,
          username: email,
          fullName: fullName,
          country: country,
          addressLine: addressLine1,
          addressLine2: addressLine2,
          city: city,
          postalCode: postalCode,
          state: state,
          phoneNumber: phoneNumber,
          organizationName: organizationName,
          VAT: vatNumber,
          organisationCountry: organizationCountry,
          isAgreementSigned: true,
        };
        const response = await fetch(`${BaseURL}/create-user`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const res = await response.json();
          hackPatchToken(res.token)
        } else if (response.status === 500) {
          setIsError(true);
          setErrorNotification({
            title: "error occured while creating user account",
            status: "error",
          });
          setVerificationCode("");
          setIsChecked(false);
          setActiveStep(1);
        }
        setLoadingSuccess(false);
      } catch (e) {
        setLoadingSuccess(false);
        console.log(e);
      }
    };
    fetchData();
  };

  const handlePersonalInfo = () => {
    setIsProfileInfoUpdated(true);
    setActiveStep(4);
  };

  const handleVatNumberChange = (e) => {
    const { name, value } = e.target;
    setVatNumber(value);
    setOrganizationInfoErrors({
      ...organizationInfoErrors,
      [name]: value.trim().length === 0,
    });
    // const gstRegex = /[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/;
    setGstValid(value.length > 0);
  };

  const handleOrganizationNameChange = (e) => {
    const { name, value } = e.target;
    setOrganizationName(value);
    setOrganizationInfoErrors({
      ...organizationInfoErrors,
      [name]: value.trim().length === 0,
    });
  };

  const handleTaxInfo = () => {
    setIsTaxInfoUpdated(true);
    setActiveStep(5);
  };

  const handleCardInfo = () => {
    setCardInfoUpdated(true);
    setActiveStep(6);
  };

  const handleInputChange = ({ target }) => {
    if (target.name === "number") {
      target.value = formatCreditCardNumber(target.value);
      setCardNumber(target.value);
    } else if (target.name === "expiry") {
      target.value = formatExpirationDate(target.value);
      setCardExpiryDate(target.value);
    } else if (target.name === "cvc") {
      target.value = formatCVC(target.value);
      setCardCVV(target.value);
    }
  };

  const postalCodeValidation = (value) => {
    if (value.length === 0) {
      setPostalCodeErrorNotification({ title: "Postal code is required" });
    } else {
      setPostalCodeErrorNotification({});
    }
  };

  /* Function to handle postal code change and also check validations for postal code */
  const handlePostalCode = (e) => {
    setPostalCode(e.target.value.trim());
    postalCodeValidation(e.target.value.trim());
  };

  const handleVerifyCardDetails = async (e) => {
    e.preventDefault();
    setLoadingCardSuccess(true);
    try {
      const res = await Frames.submitCard();
      setValidationToken(res.token);
      handleVerifyCard(res.token);
    } catch (e) {
      setLoadingCardSuccess(false);
      setIsError(true);
      setErrorNotification({
        title:
          e === "Card form invalid"
            ? "Invalid card details"
            : "error occured while creating user account",
        status: "error",
      });

      console.log(e);
    }
    Frames.init("pk_sbox_u4jn2iacxvzosov4twmtl2yzlqe");
  };

  const creditCardButtonDisabled =
    cardCVV.length === 0 ||
    cardExpiryDate.length === 0 ||
    cardNumber.length === 0;

  const taxInfoButtonDisabled =
    organizationName.length === 0 || vatNumber.length === 0;

  const selectedTab = useRef(null);

  const containerRef = useRef(0);

  const cardElement = useRef(null);

  const inputRefs = useRef([]);

  useEffect(() => {
    // 👇️ scroll to top on page load

    if (isError && activeStep != 1 && activeStep != 5 && activeStep != 4) {
      const currentWidth = containerRef.current
        ? containerRef.current.offsetWidth
        : 0;
      if (currentWidth >= 1055) {
        document.getElementById("scroller").scroll(0, 0);
      } else {
        selectedTab.current.scrollIntoView();
      }
    }
  }, [isError]);

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

  const validateVerifyEmailForm = (verificationCode) => {
    const errors = {};
    if (verificationCode.trim() == "") {
      errors.verificationCode = "A verification code is required";
    } else if (verificationCode.length > 0) {
      if (verificationCode.trim().length != 6) {
        errors.verificationCode = "Code should be 6 digit long";
      }
    }

    return errors;
  };

  const handleOrganizationFormSubmit = () => {
    const errors = validateOrganizationForm(email);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      handleSignupRequest();
    }
  };

  const handleVerifyEmailFormSubmit = () => {
    const errors = validateVerifyEmailForm(verificationCode);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      handleVerifyEmail();
    } else {
      setIsError(true);
    }
  };

  const handleAccountInformationFormSubmit = () => {
    const error = {};
    postalCodeValidation(postalCode);
    error.fullName = fullName.trim().length === 0;
    error.addressLine1 = addressLine1.trim().length === 0;
    error.city = city.trim().length === 0;
    error.fullName = fullName.trim().length === 0;
    error.state = state.trim().length === 0;
    error.phoneNumber = phoneNumber.length === 0;
    setAccountInfoErrors(error);
    if (phoneNumber.length == 0) {
      setErrorMessage('Phone number is required')
      setIsPhoneNumberValid(false)
    }
    else {
      validatePhoneNumber(phoneNumber, countryDialCode, countryCode)
    }

    const emptyInput = inputRefs.current.find((ref) => ref && ref.value === "");

    if (emptyInput) {
      emptyInput.scrollIntoView({ behavior: "smooth" });
    }

    if (!personalInfoButtonDisabled) {
      handlePersonalInfo();
    }
  };

  const handleOrganizationInformationFormSubmit = () => {
    const error = {};
    error.organizationName = organizationName.trim().length === 0;
    error.organizationNumber = vatNumber.trim().length === 0;
    setOrganizationInfoErrors(error);
    if (!taxInfoButtonDisabled) {
      handleTaxInfo();
    }
  };

  const handleCountryChange = (e) => {
    const selectedItem = COUNTRIES.find((item) => item.name === e.target.value);
    if (Object.keys(selectedItem).length == 0) {
      setPhoneNumber('')
    }
    else {
      setCountry(e.target.value)
      setPhoneNumber(selectedItem?.dial_code.toString())
      setCountryCode(selectedItem?.code)
      setCountryDialCode(selectedItem?.dial_code.toString().replace("+", ""))
    }
  }

  return (
    <>
      {loadingSuccess ? (
        <>
          <div className="loader-page">
            <InlineLoading description="Creating Account" />
          </div>
        </>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column" }}
          ref={containerRef}
        >
          <Grid className={"signup-grid"}>
            <Column className={"right-column"}>
              <Content className="right-content">
                <div className="signup-heading-text-wrapper">
                  <span>
                    <Heading prefix="" className="signup-heading-text bold">
                      Create your
                    </Heading>
                    <span style={{ display: "flex" }}>
                      <Heading prefix="" className="signup-heading-text ">
                        Bynar&nbsp;
                      </Heading>
                      <Heading
                        prefix="Bynar"
                        className="signup-heading-text bold"
                      >
                        account
                      </Heading>
                    </span>
                  </span>
                  <div className="signup-text">
                    <p className="content">
                      Access to trials, demos, starter kits, services and APIs
                    </p>
                  </div>
                </div>
              </Content>
            </Column>
            <div className="form-container" ref={selectedTab}>
              <Column className={"left-column"} id="scroller">
                <Content className={"signup-container"} style={{ padding: 0 }}>
                  <div className="heading-container">
                    <div
                      className="login-link"
                      style={{ marginBottom: "1.5rem" }}
                    >
                      Already have an BYNAR account?{" "}
                      <Link href="/signin">Log in</Link>
                    </div>
                    <Heading
                      style={{
                        fontSize: "28px",
                        fontWeight: "400",
                        marginBottom: "16px",
                      }}
                    >
                      Sign up for an Bynar account
                    </Heading>
                  </div>
                  <hr className="underline" />
                </Content>
                {typeof errorNotification === "object" &&
                  Object.keys(errorNotification).length !== 0 ? (
                  <div>
                    <ToastNotification
                      className="error-notification-box"
                      iconDescription="describes the close button"
                      subtitle={errorNotification?.title}
                      timeout={0}
                      title={""}
                      kind={errorNotification?.status}
                      onCloseButtonClick={() => {
                        setErrorNotification({});
                        setIsError(false);
                      }}
                    />
                  </div>
                ) : (
                  <div></div>
                )}

                <div className="signup-form">
                  {activeStep === 1 && (
                    <div className="account-info-box">
                      <div className="account-heading">
                        <p className="heading">1. Organization account</p>
                      </div>
                      <TextInput
                        id="email"
                        className="email-form-input"
                        // hideLabel={true}
                        value={email}
                        labelText="E-mail"
                        onChange={(e) => handleEmailChange(e.target.value)}
                        invalid={!!errors.email}
                        invalidText={errors.email}
                        disabled={loading ? true : false}
                      />
                      {loading ? (
                        <div style={{ marginTop: "32px" }}>
                          <InlineLoading
                            description={""}
                            className="submit-button-loading"
                          />
                        </div>
                      ) : (
                        <div style={{ marginTop: "32px" }}>
                          <Button
                            kind="tertiary"
                            onClick={handleOrganizationFormSubmit}
                          >
                            {"Next"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  {activeStep === 2 && (
                    <div className="account-info-box">
                      <div className="account-heading">
                        <p className="heading">2. Verify email</p>
                      </div>
                      <div className="verification-box">
                        <TextInput
                          type="text"
                          className="verification-text-input"
                          id="verification code"
                          labelText="Verification token"
                          placeholder="6 digit code"
                          value={verificationCode}
                          onChange={(e) =>
                            handleVerificationCodeChange(e.target.value)
                          }
                          invalid={!!errors.verificationCode}
                          invalidText={errors.verificationCode}
                          disabled={loading ? true : false}
                        />
                      </div>
                      <div>
                        <p className="email-text">
                          Didn’t receive the email? Check your spam filter for
                          an email from noreply@bynar.al.
                        </p>
                      </div>
                      <div>
                        {resendCodeLoading ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <InlineLoading
                              description={"re-sending confirmation-code"}
                              className="submit-button-loading"
                            />
                            {/* <p className='email-text'>re-sending confirmation-code </p> */}
                          </div>
                        ) : (
                          <p
                            className="resend-code"
                            onClick={handleSignupRequest}
                          >
                            Resend code
                          </p>
                        )}
                      </div>
                      <hr className="underline-border" />
                      <div>
                        <p className="verify-email-text">
                          Bynar may use my contact data to keep me informed of
                          products, services and offerings:
                        </p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          labelText="by email"
                          checked={isChecked}
                          id="checkbox-label-1"
                          onChange={(_, { checked }) => {
                            setIsChecked(checked);
                          }}
                        />
                      </div>
                      <div>
                        <p className="verify-email-text">
                          You can withdraw your marketing consent at any time by
                          submitting an{" "}
                          <Link href="/signup">opt-out request</Link>. Also you
                          may unsubscribe from receiving marketing emails by
                          clicking the unsubscribe link in each email.
                        </p>
                      </div>
                      <div>
                        <p className="verify-email-text">
                          More information on our processing can be found in the{" "}
                          <Link href="/signup">Bynar Privacy Statement.</Link>{" "}
                          By submitting this form, I acknowledge that I have
                          read and understand the Bynar Privacy Statement.
                        </p>
                      </div>
                      <div>
                        <p className="verify-email-text">
                          I accept the product{" "}
                          <Link href="/signup">Terms and Conditions</Link> of
                          this registration form.
                        </p>
                      </div>
                      {verifyEmailLoading ? (
                        <div style={{ marginTop: "32px" }}>
                          <InlineLoading
                            description={""}
                            className="submit-button-loading"
                          />
                        </div>
                      ) : (
                        <div
                          style={{ marginTop: "32px", marginBottom: "16px" }}
                        >
                          <Button
                            kind="tertiary"
                            onClick={() => handleVerifyEmailFormSubmit()}
                          >
                            Verify Email
                          </Button>
                          <hr className="underline-border" />
                        </div>
                      )}
                    </div>
                  )}
                  {activeStep === 3 && (
                    <div className="account-info-box">
                      <div className="account-heading">
                        <p className="heading">3. Account information</p>
                      </div>
                      <TextInput
                        type="text"
                        ref={(el) => (inputRefs.current[0] = el)}
                        name="fullName"
                        className="email-form-input"
                        id="full name"
                        labelText="Full name *"
                        value={fullName}
                        onChange={handleFullName}
                        invalid={accountInfoErrors.fullName}
                        invalidText={"Full name is required"}
                      />
                      <Select
                        className="country-select"
                        value={country}
                        id="country-ci"
                        labelText="Country or region *"
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
                      <TextInput
                        type="text"
                        name="addressLine1"
                        className="email-form-input"
                        labelText="Address line 1 *"
                        ref={(el) => (inputRefs.current[1] = el)}
                        id="address line 1"
                        value={addressLine1}
                        onChange={handleAddressLine1}
                        invalid={accountInfoErrors.addressLine1}
                        invalidText={"Address line1 is required"}
                      />
                      <TextInput
                        type="text"
                        id="address line 2"
                        className="email-form-input"
                        labelText="Address line 2 (optional)"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                      />
                      <TextInput
                        type="text"
                        name="city"
                        className="email-form-input"
                        id="city"
                        ref={(el) => (inputRefs.current[2] = el)}
                        labelText="City *"
                        value={city}
                        onChange={handleCity}
                        invalid={accountInfoErrors.city}
                        invalidText={"City name is required"}
                      />
                      <TextInput
                        type="text"
                        name="state"
                        className="email-form-input"
                        ref={(el) => (inputRefs.current[3] = el)}
                        id="state"
                        labelText="State *"
                        value={state}
                        onChange={handleState}
                        invalid={accountInfoErrors.state}
                        invalidText={"State is required"}
                      />
                      <TextInput
                        type="text"
                        name="postalCode"
                        ref={(el) => (inputRefs.current[4] = el)}
                        id="postalcode"
                        labelText="Postal code *"
                        className="postalcode"
                        value={postalCode}
                        onChange={handlePostalCode}
                        invalid={
                          typeof postalCodeErrorNotification === "object" &&
                          Object.keys(postalCodeErrorNotification).length !== 0
                        }
                        invalidText={
                          postalCodeErrorNotification &&
                            postalCodeErrorNotification.title
                            ? postalCodeErrorNotification.title
                            : ""
                        }
                      />
                      <div style={{ marginTop: "6px" }}>
                        <p className="input-heading">Phone number *</p>
                      </div>
                      <PhoneInput
                        className="phone-input-signup"
                        ref={(el) => (inputRefs.current[5] = el)}
                        style={{
                          border: !phoneNumberValid && errorMessage.length>0 ? "2px solid red" : 0,
                        }}
                        name="phoneNumber"
                        country={""}
                        value={phoneNumber}
                        onChange={(value, country, formattedValue) =>
                          handlePhoneNumber(value, country, formattedValue)
                        }
                      />
                      {!phoneNumberValid && errorMessage.length>0 && (
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
                      <div style={{ marginTop: "32px", marginBottom: "16px" }}>
                        <Button
                          className={"submit-button"}
                          onClick={handleAccountInformationFormSubmit}
                        >
                          Next
                        </Button>
                        <hr class="underline-border"></hr>
                      </div>
                    </div>
                  )}
                  {activeStep === 4 && (
                    <div className="account-info-box">
                      <div className="account-heading">
                        <p className="heading">4. Organization information</p>
                      </div>
                      <TextInput
                        type="text"
                        name="organizationName"
                        className="email-form-input"
                        id="Organization Name"
                        labelText="Organization Name"
                        value={organizationName}
                        onChange={handleOrganizationNameChange}
                        invalid={organizationInfoErrors.organizationName}
                        invalidText={"Organization name is required"}
                      />
                      <TextInput
                        type="text"
                        name="organizationNumber"
                        className="email-form-input"
                        id="VAT/GST/Tax Number"
                        labelText="Organization Number"
                        value={vatNumber}
                        onChange={handleVatNumberChange}
                        invalid={organizationInfoErrors.organizationNumber}
                        invalidText={"Organization number is required"}
                      />
                      <div style={{ marginTop: "32px", marginBottom: "16px" }}>
                        <Button
                          className={"submit-button"}
                          onClick={handleOrganizationInformationFormSubmit}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                  {activeStep === 5 && (
                    <>
                      <div className="account-info-box">
                        <div className="account-heading">
                          <p className="heading">5. Credit card information</p>
                        </div>
                      </div>
                      <Frames
                        config={{
                          publicKey: "pk_sbox_u4jn2iacxvzosov4twmtl2yzlqe",
                        }}
                        ref={cardElement}
                      >
                        <div
                          className="card-input-container"
                        >
                          <div>
                            <p className="input-heading">Card details</p>
                          </div>
                          <div>
                            <CardFrame className="card-number" />
                          </div>

                          {loadingCardSuccess ? (
                            <div className="create-account-loader">
                              <InlineLoading
                                description={"verifying card details..."}
                                className="submit-button-loading"
                              />
                            </div>
                          ) : (
                            <div className="create-account">                           
                                <Button
                                  className="submit-button"
                                  onClick={handleVerifyCardDetails}
                                >
                                  Verify card
                                </Button>
                            </div>
                          )}
                        </div>
                      </Frames>
                    </>
                  )}
                </div>
              </Column>
            </div>
          </Grid>
          <footer
            className="carbon-footer"
            role="contentinfo"
            aria-label="BYNAR"
          >
            <div className="footer-nav-container">
              <ul className="list">
                <li className="ui-list">
                  <Link href="#">Contact</Link>
                </li>
                <li className="ui-list">
                  <Link href="#">Privacy</Link>
                </li>
                <li className="ui-list" style={{ width: "400px" }}>
                  <Link href="#">Terms Of Use</Link>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default Signup;
