import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import 'react-telephone-input/css/default.css'
import {
    formatCreditCardNumber,
    formatCVC,
    formatExpirationDate,
    formatFormData
} from "../../../src/utils/util.js";
import {
    Theme,
    Content,
    Form,
    FormGroup,
    Stack,
    Button,
    Heading,
    InlineLoading,
    Link,
    InlineNotification,
    Grid,
    Column,
    Row,
    ProgressIndicator,
    ProgressStep,
    RadioButtonGroup,
    RadioButton,
    FlexGrid,
    HeaderName,
} from '@carbon/react';
import {
    TextInput,
    Select,
    SelectItem,
} from 'carbon-components-react';
import {
    PasswordInput
} from 'carbon-components-react';
import { useNavigate } from "react-router-dom";
import '../signup/signup.scss'
import { PasswordStrength } from '../../Components/PasswordStrength/PasswordStrength';
import countrylist from '../../data/countrylist';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Loader } from '../../Components/Loader/Loader.js';
import { BaseURL } from '../../sdk/constant.js';

const Signup = () => {
    const navigate = useNavigate();
    const [errorNotification, setErrorNotification] = useState({});
    const [loading, setLoading] = useState(false);
    const [resendCodeLoading, setResendCodeLoading] = useState(false)
    const [verifyEmailLoading, setVerifyEmailLoading] = useState(false)
    const [loadingSuccess, setLoadingSuccess] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmailAddress] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordArray, setPasswordArray] = useState(Array(6).fill(false))
    const [passwordStrengthWidth, setpaswordStrengthWidth] = useState(0);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [emailIsValid, setEmailValid] = useState(true);
    const [activeStep, setActiveStep] = useState(5);
    const [verificationCode, setVerificationCode] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullName, setFullName] = useState('');
    const [isProfileInfoUpdated, setIsProfileInfoUpdated] = useState(false)
    const [isAccountInfoUpdated, setIsAccountInfoUpdated] = useState(false)
    const [country, setCountry] = useState("India");
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [isTaxInfoUpdated, setIsTaxInfoUpdated] = useState(false);
    const [vatNumber, setVatNumber] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [organizationCountry, setCountryName] = useState("India");
    const [isGstValid, setGstValid] = useState(true);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiryDate, setCardExpiryDate] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [isCardInfoUpdated, setCardInfoUpdated] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isAccountInfoError, setIsAccountInfoError] = useState(false);
    const [isVerifyEmailInfoError, setIsVerifyEmailError] = useState(false);
    const [postalCodeErrorNotification, setPostalCodeErrorNotification] = useState({});
    const [isCreateAccountError, setIsCreateAccountError] = useState(false);
    const [userId, setUserId] = useState();
    const [message, setMessage] = useState('creating account ...');
    const ref = useRef(null);
    const accountInfoButtonDisabled = !emailIsValid || email.length == 0 || isAccountInfoError;
    const personalInfoButtonDisabled = fullName.length == 0 || city.length == 0 || state.length == 0 || postalCode.length == 0 || phoneNumber.length == 0 || addressLine1.length == 0 || Object.keys(postalCodeErrorNotification).length != 0;
    const verificationEmailButtonDisabled = verificationCode.length == 0 || isVerifyEmailInfoError;

    const handleFirstNameChange = (value) => {
        setFirstName(value);
    }

    const handleLastNameChange = (value) => {
        setLastName(value);
    }

    const handleVerificationCodeChange = (value) => {
        setErrorNotification({});
        setVerificationCode(value);
        setIsError(false)
        setIsVerifyEmailError(false);
    }

    useLayoutEffect(() => {
        handlePasswordStrengthLength(password);
    }, [isPasswordVisible]);

    const handlePasswordStrengthLength = (value) => {
        const lengthRegex = /^.{8,}$/;
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialcharacterRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
        const tempArray = [lengthRegex.test(value.trim()), uppercaseRegex.test(value), lowercaseRegex.test(value), numberRegex.test(value), specialcharacterRegex.test(value), value.length == value.trim().length];
        setpaswordStrengthWidth(tempArray.filter(i => i === true).length * ref?.current?.offsetWidth / 6);
    }

    /* Function to check if email address is valid or not */
    const checkEmailValid = (value) => {
        var isEmailValid =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (value || value.length !== 0) {
            if (isEmailValid.test(value)) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    /* Function to set state, check email address validation when email address is changed  */
    const handleEmailChange = (value) => {
        setErrorNotification({});
        setIsError(false);
        setIsAccountInfoError(false);
        setEmailAddress(value);
        setEmailValid(checkEmailValid(value));
    }

    const handlePasswordChange = (value) => {
        setErrorNotification({});
        setIsError(false)
        setIsAccountInfoError(false);
        setPassword(value);
        const lengthRegex = /^.{8,}$/;
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialcharacterRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
        const tempArray = [lengthRegex.test(value.trim()), uppercaseRegex.test(value), lowercaseRegex.test(value), numberRegex.test(value), specialcharacterRegex.test(value), value.length == value.trim().length];
        setPasswordArray(tempArray)
        setpaswordStrengthWidth(tempArray.filter(i => i === true).length * ref?.current?.offsetWidth / 6);
        setPasswordIsValid(lengthRegex.test(value.trim()) && uppercaseRegex.test(value) && lowercaseRegex.test(value) && numberRegex.test(value) && specialcharacterRegex.test(value))
    };

    /* Function to send email as payload  ,if api response is 200 then proceed with email verification,otherwise in case of error show error in signup page*/
    const handleSignupRequest = () => {

        const fetchData = async () => {
            setLoading(true)
            setResendCodeLoading(true)
            try {
                const data = {
                    email: email.trim(),
                    // password: password,
                }
                const response = await fetch(`${BaseURL}/signup`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const res = await response.json();
                if (response.ok) {
                    setActiveStep(2);
                    setIsError(false);
                    setIsAccountInfoError(false);
                }
                else if (response.status === 500) {
                    setIsError(true)
                    setActiveStep(2);
                    setErrorNotification({
                        title: res.error === "username already exist" || "email is not valid" ? res.error : "Some error occured, please try after some time"
                    })
                }
                setLoading(false);
                setResendCodeLoading(false);
            }
            catch (e) {
                setLoading(false)
                console.log(e)
            }

        }
        fetchData();
    }

    const handleEditClick = (value) => {
        setActiveStep(value)
        setIsAccountInfoUpdated(true);
    }

    /* Function to verify user email during signup process , if email is verified sucessfully then proceed to next step ,otherwise in case of error show error in signup page*/
    const handleVerifyEmail = () => {

        const fetchData = async () => {
            try {
                setVerifyEmailLoading(true);
                const data = {
                    email: email,
                    code: verificationCode,
                }
                const response = await fetch(`${BaseURL}/confirm-email`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const res = await response.json();
                if (response.ok) {
                    setActiveStep(3);
                    setIsError(false)
                    setIsVerifyEmailError(false);
                    setUserId(res?.accountID);
                }
                else if (response.status === 500) {
                    setIsError(true)
                    setIsVerifyEmailError(true);
                    // setActiveStep(1);
                    setErrorNotification({
                        title: "Enter valid confirmation email code"
                    })
                    setVerificationCode('');
                }
                setVerifyEmailLoading(false);
            }
            catch (e) {
                setVerifyEmailLoading(false);
                console.log(e)
            }
        }
        fetchData();
    }

    /* Function to create user account ,if account created sucessfully then navigate to signin page ,otherwise in case of error show error in signup page */
    const handleCreateAccount = () => {
        const fetchData = async () => {
            try {
                setLoadingSuccess(true);
                const data = {
                    id: userId,
                    username: email,
                    fullName: firstName + " " + lastName,
                    country: country,
                    addressLine: addressLine1,
                    addressLine2: addressLine2,
                    city: city,
                    postalCode: parseInt(postalCode),
                    state: state,
                    phoneNumber: phoneNumber,
                    organizationName: organizationName,
                    VAT: vatNumber,
                    organisationCountry: organizationCountry,
                    isAgreementSigned: isChecked,
                }
                const response = await fetch(`${BaseURL}/create-user`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const res = await response.json();

                if (response.ok) {
                    navigate('/signin');
                }
                else if (response.status === 500) {
                    setIsError(true)
                    setErrorNotification({
                        title: 'error occured while creating user account'
                    })
                }
                setLoadingSuccess(false);
            }
            catch (e) {
                setLoadingSuccess(false);
                console.log(e)
            }

        }
        fetchData();
    }

    const handlePersonalInfo = () => {
        setIsProfileInfoUpdated(true);
        setActiveStep(4);
    }

    const handleVatNumberChange = (value) => {
        setVatNumber(value);
        // const gstRegex = /[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/;
        setGstValid(value.length > 0);
    }

    const handleTaxInfo = () => {
        setIsTaxInfoUpdated(true);
        setActiveStep(5);
    }

    const handleCardInfo = () => {
        setCardInfoUpdated(true);
        setActiveStep(6);
    }

    const handleInputChange = ({ target }) => {
        if (target.name === "number") {
            target.value = formatCreditCardNumber(target.value);
            setCardNumber(target.value);
        } else if (target.name === "expiry") {
            target.value = formatExpirationDate(target.value);
            setCardExpiryDate(target.value);
        } else if (target.name === "cvc") {
            target.value = formatCVC(target.value);
            setCardCVV(target.value)
        }
    }

    /* Function to handle postal code change and also check validations for postal code */
    const handlePostalCode = (e) => {
        setPostalCode(e.target.value);
        if (!/^\d+$/.test(e.target.value)) {
            setPostalCodeErrorNotification({ title: 'Postal code should be integer' });
        }
        else if (e.target.value.length === 0) {
            setPostalCodeErrorNotification({ title: 'Postal code should not be blank' });
        }
        else if (e.target.value.length != 6) {
            setPostalCodeErrorNotification({ title: 'Postal code should be of 6 digit' });
        }
        else {
            setPostalCodeErrorNotification({});
        }
    }

    const creditCardButtonDisabled = cardCVV.length == 0 || cardExpiryDate.length == 0 || cardNumber.length == 0;

    const taxInfoButtonDisabled = organizationName.length == 0 || (vatNumber.length === 0);

    // useEffect(() => {
    //     // 👇️ scroll to top on page load
    //     if (isError) {
    //         document.getElementById("scroller").scroll(0, 0);
    //     }
    // }, [isError]);

    return (
        <>
            <Grid className={'signup-grid'} >
                <Column className={'right-column'} style={{ background: "url(./image/signup-bg.svg) center 60% / 100% no-repeat rgb(249, 249, 249)" }} >
                    <Content className='right-content'>
                        <div className='signup-heading-text-wrapper' >
                            <HeaderName prefix="" className='signup-heading-text'>
                                Create your
                            </HeaderName>
                            <HeaderName prefix="Bynar" className='signup-heading-text'>
                                account
                            </HeaderName>
                        </div>

                    </Content>
                </Column>
                <div className='form-container'>
                    <Column className={'left-column'}>
                        <Content className={'signup-container'} >
                            <div className='heading-container' >
                                <div className="login-link" style={{ 'marginBottom': '1.5rem' }}>Already have an BYNAR account? <Link href="/signin">Log in</Link></div>
                                <Heading style={{ fontSize: '24px' }}>Sign up for an Bynar account</Heading>
                                <hr className="underline" />
                            </div>
                        </Content>
                        {typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0 ?
                            (
                                <InlineNotification
                                    className="error-notification"
                                    onClose={function noRefCheck() { }}
                                    onCloseButtonClick={() => { setErrorNotification({}); setIsError(false) }}
                                    statusIconDescription="notification"
                                    title={errorNotification.title ? errorNotification.title : ''}
                                />) : (
                                <div className="error-notification-inactive"></div>
                            )
                        }
                        <div className="signup-form">
                            {activeStep == 1 && (
                                <div className='account-info-box'>
                                    <div className='account-heading'>
                                        <p className='heading'>Organization account</p>
                                    </div>
                                    <TextInput
                                        id="email"
                                        className="email-form-input"
                                        // hideLabel={true}
                                        value={email}
                                        labelText="E-mail"
                                        onChange={(e) => handleEmailChange(e.target.value)}
                                        invalid={!emailIsValid && email.length > 0}
                                        invalidText={
                                            !emailIsValid && email.length > 0
                                                ? 'Enter valid email address' : null
                                        }
                                        disabled={loading ? true : false}
                                    />
                                    {loading ?
                                        (
                                            <div style={{ marginTop: '32px' }}>
                                                <Loader />
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: '32px' }}>
                                                <button disabled={!emailIsValid || email.length == 0 || isAccountInfoError}
                                                    className={!emailIsValid || email.length == 0 || isAccountInfoError ? 'submit-button-disabled' : 'submit-button'} onClick={() => handleSignupRequest()}>
                                                    {!isAccountInfoUpdated ? "Next" : "Update"}
                                                </button>
                                            </div>)}
                                </div>)}
                            {activeStep == 2 && (
                                <div className='account-info-box'>
                                    <div className='account-heading'>
                                        <p className='heading'>2-Verify email</p>
                                    </div>
                                    <TextInput
                                        type="text"
                                        className='verification-text-input'
                                        id="verification code"
                                        labelText="Enter verification code"
                                        value={verificationCode}
                                        onChange={(e) => handleVerificationCodeChange(e.target.value)}
                                        invalid={verificationCode.length == 0}
                                        invalidText={
                                            verificationCode.length == 0
                                                ? 'A verification code is required' : null
                                        }
                                        disabled={loading ? true : false}
                                    />
                                    <div>
                                        <p className='email-text'>Didn’t receive the email? Check your spam filter for an email from noreply@bynar.al.</p>
                                    </div>
                                    <div>
                                        {resendCodeLoading ? (
                                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
                                                <Loader />
                                                <p className='email-text'>re-sending confirmation-code </p>
                                            </div>
                                        ) : (
                                            <p className='resend-code' onClick={handleSignupRequest}>Resend code</p>
                                        )}

                                    </div>
                                    <hr />
                                    <div>
                                        <p className='verify-email-text'>Bynar may use my contact data to keep me informed of products, services and offerings:</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="checkbox" id="vehicle1" className='checkbox' name="vehicle1" value="Bike" onChange={(e) => { setIsChecked(e.target.checked) }} />
                                        <label>by email</label>
                                    </div>
                                    <div>
                                        <p className='verify-email-text'>You can withdraw your marketing consent at any time by submitting an <Link href="/signup">opt-out request</Link>. Also you may unsubscribe from receiving marketing emails by clicking the unsubscribe link in each email.</p>
                                    </div>
                                    <div>
                                        <p className='verify-email-text'>More information on our processing can be found in the <Link href="/signup">Bynar Privacy Statement.</Link> By submitting this form, I acknowledge that I have read and understand the Bynar Privacy Statement.</p>
                                    </div>
                                    <div>
                                        <p className='verify-email-text'>I accept the product <Link href="/signup">Terms and Conditions</Link> of this registration form.</p>
                                    </div>
                                    {verifyEmailLoading ?
                                        (
                                            <div style={{ marginTop: '32px' }}>
                                                <Loader />
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: '32px', marginBottom: '16px' }}>
                                                <button disabled={verificationCode.length == 0 || isVerifyEmailInfoError}
                                                    className={verificationCode.length == 0 || isVerifyEmailInfoError ? 'submit-button-disabled' : 'submit-button'} onClick={() => handleVerifyEmail()}>
                                                    Verify Email
                                                </button>
                                                <hr />
                                            </div>)}
                                </div>)}
                            {activeStep == 3 && (
                                <div className='account-info-box'>
                                    <div className='account-heading'>
                                        <p className='heading'>Account information</p>
                                    </div>
                                    <TextInput type="text"
                                        className="email-form-input"
                                        id="full name"
                                        labelText="Full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                    <Select className='country-select'
                                        value={country}
                                        id='country-ci'
                                        labelText='Country or region*'
                                        onChange={e => setCountry(e.target.value)}
                                    >
                                        {countrylist.map((countryObject, countryIndex) => (<SelectItem
                                            text={countryObject.name}
                                            value={countryObject.name}
                                            key={countryIndex}
                                        />))}

                                    </Select>
                                    <TextInput type="text"
                                        className="email-form-input"
                                        labelText="Address line 1"
                                        id="address line 1"
                                        value={addressLine1}
                                        onChange={(e) => setAddressLine1(e.target.value)}
                                    />
                                    <TextInput type="text"
                                        id="address line 2"
                                        className="email-form-input"
                                        labelText="Address line 2 (optional)"
                                        value={addressLine2}
                                        onChange={(e) => setAddressLine2(e.target.value)}
                                    />
                                    <TextInput type="text"
                                        className="email-form-input"
                                        id="city"
                                        labelText="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                    <TextInput type="text"
                                        className="email-form-input"
                                        id="state"
                                        labelText="State"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                    />
                                    <TextInput type="text"
                                        id="postalcode"
                                        labelText="Postal code"
                                        className='postalcode'
                                        value={postalCode}
                                        onChange={(e) => handlePostalCode(e)}
                                        invalid={typeof postalCodeErrorNotification == 'object' && Object.keys(postalCodeErrorNotification).length !== 0}
                                        invalidText={(postalCodeErrorNotification && postalCodeErrorNotification.title) ? postalCodeErrorNotification.title : ""}
                                    />
                                    <div>
                                        <p style={{ color: '#525252' }}>Phone number</p>
                                    </div>
                                    <PhoneInput className='phone-input'
                                        country={'in'}
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e)}
                                    />
                                    <div style={{ marginTop: '32px', marginBottom: '16px' }}>
                                        <button disabled={personalInfoButtonDisabled}
                                            className={personalInfoButtonDisabled ? 'submit-button-disabled' : 'submit-button'} onClick={() => handlePersonalInfo()}>
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeStep == 4 && (
                                <div className='account-info-box'>
                                    <div className='account-heading'>
                                        <p className='heading'>Organization information</p>
                                    </div>
                                    <TextInput type="text"
                                        className="email-form-input"
                                        id="Organization Name"
                                        labelText="Organization Name"
                                        value={organizationName}
                                        onChange={(e) => setOrganizationName(e.target.value)}
                                    />
                                    <TextInput type="text"
                                        className="email-form-input"
                                        id="VAT/GST/Tax Number"
                                        labelText="Organization Number"
                                        value={vatNumber}
                                        onChange={(e) => handleVatNumberChange(e.target.value)}
                                        invalid={!isGstValid && vatNumber.length === 0}
                                        invalidText={
                                            !isGstValid && vatNumber.length === 0
                                                ? 'Organization number cannot be blank' : null
                                        }
                                    />
                                    <div style={{ marginTop: '32px', marginBottom: '16px' }}>
                                        <button disabled={taxInfoButtonDisabled}
                                            className={taxInfoButtonDisabled ? 'submit-button-disabled' : 'submit-button'} onClick={() => handleTaxInfo()}>
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeStep == 5 && (
                                <div className='account-info-box'>
                                    <div className='account-heading'>
                                        <p className='heading'>Credit card information</p>
                                    </div>
                                    <div className="form-group">
                                        <div>
                                            <p className='input-heading'>Card number</p>
                                        </div>
                                        <input
                                            type="tel"
                                            name="number"
                                            className="form-control"
                                            placeholder=""
                                            pattern="[\d| ]{16,22}"
                                            label="card number"
                                            value={cardNumber}
                                            onChange={handleInputChange}

                                        />
                                    </div>
                                    <div style={{display:'flex',justifyContent:'space-evenly',gap:'15px'}}>
                                    <div className="form-group-one">
                                        <div>
                                            <p className='input-heading'>Expiration date</p>
                                        </div>
                                        <input
                                            type="tel"
                                            name="expiry"
                                            className="form-control"
                                            placeholder=""
                                            pattern="\d\d/\d\d"
                                            value={cardExpiryDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group-one">
                                        <div>
                                            <p className='input-heading'>Security code</p>
                                        </div>
                                        <input
                                            type="tel"
                                            name="cvc"
                                            className="form-control"
                                            placeholder=""
                                            pattern="\d{3,4}"
                                            value={cardCVV}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    </div>
                                    <div style={{ marginTop: '32px', marginBottom: '16px' }}>
                                        <button disabled={creditCardButtonDisabled}
                                            className={creditCardButtonDisabled ? 'submit-button-disabled' : 'submit-button'} onClick={() => handleCardInfo()}>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Column>
                </div>
            </Grid>
        </>
    )

};


export default Signup;