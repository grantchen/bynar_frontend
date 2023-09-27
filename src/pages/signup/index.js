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
import React, { useEffect, useRef, useState } from "react";
import {
  BaseURL,
  COUNTRIES,
  CheckoutPublicKey,
  DATA_SOVEREIGNTY_REGION_NAMES,
  getQueryVariable,
  useAuth,
} from "./../../sdk";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import "./../../styles/paymentform.scss";
import "./signup.scss";
import {
  PhoneNumberUtil,
} from "google-libphonenumber";
import {
  parseTabMessage,
  sendCloseTabMessage,
  sendTabMessage,
  SubscribeCloseTabMessage,
  SubscribeTabMessage
} from "../../sdk/tabMessage";
import SignHeader from "../../components/SignHeader";
import {Footer} from "@carbon/ibmdotcom-react";

const Signup = () => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const navigate = useNavigate();
  const [errorNotification, setErrorNotification] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendCodeLoading, setResendCodeLoading] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [email, setEmailAddress] = useState("");
  const [emailVerificationTimeStamp, setEmailVerificationTimeStamp] = useState("");
  const [emailVerificationSignature, setEmailVerificationSignature] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("Albania");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("355");
  const [vatNumber, setVatNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationCountry, setOrganizationCountry] = useState("Albania");
  const [isByEmailChecked, setIsByEmailChecked] = useState(true);
  const [isAgreementSigned, setIsAgreementSigned] = useState(false);
  const [dataSovereignty, setDataSovereignty] = useState("us-east-1");
  const [isError, setIsError] = useState(false);
  const [postalCodeErrorNotification, setPostalCodeErrorNotification] =
    useState({});
  const [cardValidationToken, setCardValidationToken] = useState("");
  const [cardCustomerID, setCardCustomerID] = useState("");
  const [cardSourceID, setCardSourceID] = useState("");
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
    organizationCountry: false,
  });
  const [countryCode, setCountryCode] = useState('AL');
  const [countryDialCode, setCountryDialCode] = useState('355');

  const { signinWithCustomToken } = useAuth()

  const personalInfoButtonDisabled =
    fullName.trim().length === 0 ||
    city.trim().length === 0 ||
    state.trim().length === 0 ||
    postalCode.trim().length === 0 ||
    !phoneNumberValid ||
    addressLine1.trim().length === 0 ||
    Object.keys(postalCodeErrorNotification).length !== 0;

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

  const handlePhoneNumber = (value, country) => {
    setPhoneNumber(value)
    setCountryCode(country?.countryCode);
    setCountryDialCode(
      country?.dialCode.toString().replace("+", "")
    );
    validatePhoneNumber(value, country.dialCode, country?.countryCode);
  }

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
    setEmailAddress(value);
    const errors = validateOrganizationForm(value);
    setErrors(errors);
    // change email needs to verify again
  };

  // handle magic link redirection from email
  const handleEmailLinkRedirect = () => {
    const urlEmail = getQueryVariable(window.location.href, "email")
    const urlTimestamp = getQueryVariable(window.location.href, "timestamp")
    const urlSignature = getQueryVariable(window.location.href, "signature")
    if (urlEmail && urlTimestamp && urlSignature) {
      sendTabMessage('signup-verification', {
        email: urlEmail,
        timestamp: urlTimestamp,
        signature: urlSignature,
      })

      setEmailAddress(urlEmail)
      setEmailVerificationTimeStamp(urlTimestamp)
      setEmailVerificationSignature(urlSignature)
      setActiveStep(2)
      handleVerifyEmail(urlEmail, urlTimestamp, urlSignature)
    }
  };

  /* Function to send email as payload  ,if api response is 200 then proceed with email verification,otherwise in case of error show error in signup page*/
  const handleSignupRequest = () => {
    const fetchData = async () => {
      setLoading(true);
      setIsEmailVerified(false)
      setResendCodeLoading(true);
      setErrorNotification({});
      setIsError(false);
      try {
        const data = {
          email: email.trim(),
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

          if (activeStep === 2) {
            setErrorNotification({
              title: `verification email re-send to ${email}`,
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
                : "Some error occurred, please try after some time",
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

  /* Function to verify user email during signup process ,
   if email is verified successfully then proceed to next step ,
   otherwise in case of error show error in signup page
  */
  const handleVerifyEmail = (email, timestamp, signature) => {
    const fetchData = async () => {
      setErrorNotification({});
      setIsError(false);
      try {
        setVerifyEmailLoading(true);
        const data = {
          email: email,
          timestamp: timestamp,
          signature: signature,
        };
        const response = await fetch(`${BaseURL}/confirm-email`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = await response.json();
        if (response.ok) {
          setIsError(false);
          setIsEmailVerified(true);
          // record verified email
          setEmailVerified(email);
          setActiveStep(3);
        } else if (response.status === 500) {
          setIsError(true);
          setIsEmailVerified(false);
          setEmailVerified("");
          setErrorNotification({
            title: res.error,
            status: "error",
          });
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
        const data = {
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
          setCardCustomerID(res.customerID);
          setCardSourceID(res.sourceID);
          setActiveStep(6);
        } else if (response.status === 500) {
          setIsError(true);
          let title = "error occurred while validating card"
          if (res?.error){
            title = res?.error
          }
          setErrorNotification({
            title: title,
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

  /* Function to create user account ,if account created successfully then navigate to signin page ,otherwise in case of error show error in signup page */
  const handleCreateAccount = () => {
    const fetchData = async () => {
      try {
        setLoadingSuccess(true);
        const data = {
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
          isAgreementSigned: isAgreementSigned,
          token: cardValidationToken,
          timestamp: emailVerificationTimeStamp,
          signature: emailVerificationSignature,
          customerID: cardCustomerID,
          sourceID: cardSourceID,
          tenantCode: dataSovereignty,
        };
        const response = await fetch(`${BaseURL}/create-user`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const res = await response.json();
        if (response.ok) {
          await signinWithCustomToken(res.token)
          navigate('/home/dashboard');
          return
        } else if (response.status === 500) {
          setIsError(true);
          setErrorNotification({
            title: res.error,
            status: "error",
          });
          setActiveStep(1);
        }
        setLoadingSuccess(false);
      } catch (e) {
        setLoadingSuccess(false);
        setIsError(true);
        setErrorNotification({
          title: 'error occurred while creating environment',
          status: "error",
        });
        console.log(e);
      }
    };
    fetchData();
  };

  const handlePersonalInfo = () => {
    setActiveStep(4);
  };

  const handleVatNumberChange = (e) => {
    const { name, value } = e.target;
    setVatNumber(value);
    setOrganizationInfoErrors({
      ...organizationInfoErrors,
      [name]: value.trim().length === 0,
    });
  };

  const handleOrganizationNameChange = (e) => {
    const { name, value } = e.target;
    setOrganizationName(value);
    setOrganizationInfoErrors({
      ...organizationInfoErrors,
      [name]: value.trim().length === 0,
    });
  };

  const handleOrganizationCountryChange = (e) => {
    const { name, value } = e.target;
    setOrganizationCountry(value);
    setOrganizationInfoErrors({
      ...organizationInfoErrors,
      [name]: value.trim().length === 0,
    });
  };

  const handleDataSovereigntyChange = (e) => {
    const { name, value } = e.target;
    setDataSovereignty(value);
  }

  const handleTaxInfo = () => {
    setActiveStep(5);
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
    setIsError(false);
    setErrorNotification({})
    try {
      const res = await Frames.submitCard();
      setCardValidationToken(res.token);
      handleVerifyCard(res.token);
    } catch (e) {
      setLoadingCardSuccess(false);
      setIsError(true);
      setErrorNotification({
        title:
          e === "Card form invalid"
            ? "Invalid card details"
            : "error occurred while creating user account",
        status: "error",
      });

      console.log(e);
    }
  };

  const handleCreateEnvironment = async (e) => {
    e.preventDefault();
    handleCreateAccount();
  };

  const taxInfoButtonDisabled =
    organizationName.length === 0 || vatNumber.length === 0;

  const selectedTab = useRef(null);

  const containerRef = useRef(0);

  const cardElement = useRef(null);

  const inputRefs = useRef([]);

  useEffect(() => {
    // 👇️ scroll to top on page load

    if (isError && activeStep !== 1 && activeStep !== 5 && activeStep !== 4) {
      const currentWidth = containerRef.current
        ? containerRef.current.offsetWidth
        : 0;
      if (currentWidth >= 1055) {
        document.getElementById("scroller").scroll(0, 0);
      } else {
        selectedTab.current?.scrollIntoView();
      }
    }
  }, [isError]);

  useEffect(() => {
    // get custom signature from url on page load
    handleEmailLinkRedirect()
  }, [])

  // verify email and close other tab
  const checkOtherTabVerification = (e) => {
    parseTabMessage(e, 'signup-verification', (data, e) => {
      if (data?.message?.email) {
        sendCloseTabMessage(data?.from)
        window.focus()
        setEmailAddress(data.message.email)
        setEmailVerificationTimeStamp(data.message.timestamp)
        setEmailVerificationSignature(data.message.signature)
        setActiveStep(2)
        handleVerifyEmail(data.message.email, data.message.timestamp, data.message.signature)
      }
    })
  }

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

  // sign up first step submit
  const handleOrganizationFormSubmit = () => {
    const errors = validateOrganizationForm(email);
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (isEmailVerified && emailVerified === email) {
        setErrorNotification({});
        setActiveStep(2);
        setIsError(false);
      } else {
        handleSignupRequest();
      }
    }
  };
  // sign up second step submit
  const handleVerifyEmailFormSubmit = () => {
    if (isEmailVerified) {
      setErrorNotification({});
      setActiveStep(3);
    } else {
      setErrorNotification({
        title: "email not verified",
        status: "error",
      });
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
    if (phoneNumber.length === 0) {
      setErrorMessage('Phone number is required')
      setIsPhoneNumberValid(false)
    } else {
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
    if (Object.keys(selectedItem).length === 0) {
      setPhoneNumber('')
    } else {
      setCountry(e.target.value)
      setPhoneNumber(selectedItem?.dial_code.toString())
      setCountryCode(selectedItem?.code)
      setCountryDialCode(selectedItem?.dial_code.toString().replace("+", ""))
    }
  }

  return (
    <div>
      <SubscribeCloseTabMessage></SubscribeCloseTabMessage>
      <SubscribeTabMessage
        subscribe={ checkOtherTabVerification }>
      </SubscribeTabMessage>
      {(
        <div className={"main-container Aligner two-column"}>
          <div className={"Aligner-item--top header-container"}>
              <SignHeader></SignHeader>
          </div>

          <div
            ref={containerRef}
            className={"bg-container"}
          >
            <Grid fullWidth className={"signup-grid"}>
              <Column sm={{span:4}} lg={{span: 6,offset:5}} md={{span:5,offset:2}} id="scroller">
                <Content className={"signup-container"}>
                  <div className="heading-container">
                    <Heading className={"form-mainHeading"}>
                      Sign up for an Bynar account
                    </Heading>
                    <div
                      className="login-link"
                    >
                      Already have an BYNAR account?{" "}
                      <Link href="/signin">Log in</Link>
                    </div>
                  </div>
                </Content>
                {(typeof errorNotification === "object" &&
                Object.keys(errorNotification).length !== 0) && (
                  <div style={{paddingLeft: 16,paddingRight: 16}}>
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
                        value={email}
                        labelText="E-mail"
                        onChange={(e) => handleEmailChange(e.target.value)}
                        invalid={!!errors.email}
                        invalidText={errors.email}
                        disabled={loading ? true : false}
                      />
                      {loading ? (
                        <div style={{marginTop: "32px"}}>
                          <InlineLoading
                            description={"sending confirmation email"}
                            className="submit-button-loading"
                          />
                        </div>
                      ) : (
                        <div style={{marginTop: "32px"}}>
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
                      <div>
                        <p className="email-text">
                          {isEmailVerified ? (
                            <>
                              Email has been verified.
                            </>
                          ) : (
                            <>
                              Didn’t receive the email? Check your spam filter for
                              an email from noreply@bynar.al.
                            </>
                          )}
                        </p>
                      </div>
                      <div>
                        {(resendCodeLoading || verifyEmailLoading) ? (
                          <div
                            style={{marginTop: "32px"}}
                          >
                            <InlineLoading
                              description={ resendCodeLoading ? "re-sending confirmation email" : ""}
                              className="submit-button-loading"
                            />
                          </div>
                        ) : !isEmailVerified && (
                          <p
                            className="resend-code"
                            onClick={handleSignupRequest}
                          >
                            Resend confirmation email
                          </p>
                        )}
                      </div>
                      {isEmailVerified && (
                          <div
                              style={{ marginTop: "32px", marginBottom: "16px" }}
                          >
                            <Button
                                kind="tertiary"
                                disabled={!isEmailVerified}
                                onClick={() => handleVerifyEmailFormSubmit()}
                            >
                              Next
                            </Button>
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
                      <div style={{marginTop: "6px"}}>
                        <p className="input-heading">Phone number *</p>
                      </div>
                      <PhoneInput
                        className="phone-input-signup"
                        ref={(el) => (inputRefs.current[5] = el)}
                        style={{
                          border: !phoneNumberValid && errorMessage.length > 0 ? "2px solid red" : 0,
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
                      <div style={{marginTop: "32px", marginBottom: "16px"}}>
                        <Button
                          kind="tertiary"
                          onClick={handleAccountInformationFormSubmit}
                        >
                          Next
                        </Button>
                        <hr className="underline-border"></hr>
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
                        labelText="Organization Name *"
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
                        labelText="Organization Number *"
                        value={vatNumber}
                        onChange={handleVatNumberChange}
                        invalid={organizationInfoErrors.organizationNumber}
                        invalidText={"Organization number is required"}
                      />
                      <Select
                        name="organizationCountry"
                        className="country-select"
                        value={organizationCountry}
                        id="organization-country-ci"
                        labelText="Organization Country or region *"
                        onChange={handleOrganizationCountryChange}
                        invalid={organizationInfoErrors.organizationCountry}
                      >
                        {COUNTRIES.map((countryObject, countryIndex) => (
                          <SelectItem
                            text={countryObject.name}
                            value={countryObject.name}
                            key={countryIndex}
                          />
                        ))}
                      </Select>
                      <div style={{marginTop: "32px", marginBottom: "16px"}}>
                        <Button
                          kind="tertiary"
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
                          publicKey: CheckoutPublicKey,
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
                            <CardFrame className="card-number"/>
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
                                kind="tertiary"
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
                  {activeStep === 6 && (
                    <>
                      <div className="account-info-box">
                        <div className="account-heading">
                          <p className="heading">6. Account notice</p>
                        </div>

                        <Select
                          className="country-select"
                          value={dataSovereignty}
                          id="data-sovereignty"
                          labelText="Data Sovereignty *"
                          onChange={handleDataSovereigntyChange}
                          disabled={!isAgreementSigned || loadingSuccess}
                        >
                          {Object.keys(DATA_SOVEREIGNTY_REGION_NAMES).map((regionCode, index) => (
                            <SelectItem
                              text={DATA_SOVEREIGNTY_REGION_NAMES[regionCode]}
                              value={regionCode}
                              key={index}
                            />
                          ))}
                        </Select>

                        <div>
                          <p className="account-notice-text">
                            Bynar may use my contact data to keep me informed of
                            products, services and offerings:
                          </p>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                          <Checkbox
                            labelText="by email"
                            checked={isByEmailChecked}
                            id="by-email"
                            onChange={(_, {checked}) => {
                              setIsByEmailChecked(checked);
                            }}
                            disabled={loadingSuccess}
                          />
                        </div>
                        <div>
                          <p className="account-notice-text">
                            You can withdraw your marketing consent at any time by
                            submitting an{" "}
                            <Link href="/signup">opt-out request</Link>. Also you
                            may unsubscribe from receiving marketing emails by
                            clicking the unsubscribe link in each email.
                          </p>
                        </div>
                        <div>
                          <p className="account-notice-text">
                            More information on our processing can be found in the{" "}
                            <Link href="/signup">Bynar Privacy Statement.</Link>{" "}
                            By submitting this form, I acknowledge that I have
                            read and understand the Bynar Privacy Statement.
                          </p>
                        </div>
                        <div>
                          <p className="account-notice-text">
                            <Checkbox
                              labelText={<>
                                I accept the product{" "}
                                <Link href="/signup">Terms and Conditions</Link> of
                                this registration form.
                              </>}
                              checked={isAgreementSigned}
                              disabled={loadingSuccess}
                              id="is-accept-agreement"
                              onChange={(_, {checked}) => {
                                setIsAgreementSigned(checked);
                              }}
                            />
                          </p>
                        </div>
                        {loadingSuccess ? (
                        <>
                          <div style={{marginTop: "32px"}}>
                            <InlineLoading description="Creating Account" />
                          </div>
                        </>
                        ): (
                          <div className="create-account">
                            <Button
                              kind="tertiary"
                              onClick={handleCreateEnvironment}
                              disabled={!isAgreementSigned}
                            >
                              Create environment
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Column>
            </Grid>
          </div>
            <div className={"Aligner-item--bottom"}>
                <Footer
                    type="micro"
                    disableLocaleButton={true}
                    navigation={
                        {
                            footerThin: [{
                                title: "Contact",
                                url: "#"
                            },{
                                title: "Privacy",
                                url: "#"
                            },{
                                title: "Terms Of Use",
                                url: "#"
                            }]
                        }}
                />
            </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
