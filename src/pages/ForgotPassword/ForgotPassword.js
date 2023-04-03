import React, { useState, useRef, useContext, useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";

import {
    Form,
    Button,
    Heading,
    FormLabel,
    Link,
    InlineNotification,
} from '@carbon/react';
import {
    PasswordInput, TextInput
} from 'carbon-components-react';
import './ForgotPassword.scss'
import { Loader } from '../../Components/Loader/Loader';
import { BaseURL } from '../../sdk/constant';
import { PasswordStrength } from '../../Components/PasswordStrength/PasswordStrength';
import { ForgotPasswordStrengthChecker } from './ForgotPasswordStrengthChecker';

const ForgotPassword = () => {
    let navigate = useNavigate();
    const [askForPassword, setAskForPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [passwordErrorNotification, setPasswordErrorNotification] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordArray, setPasswordArray] = useState(Array(6).fill(false))
    const [passwordStrengthWidth, setpaswordStrengthWidth] = useState(0);
    const [passwordIsValid, setPasswordIsValid] = useState(false);
    const ref = useRef(null);
    const emailInput = useRef(null);
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    useLayoutEffect(() => {
        // setWidth(ref?.current?.offsetWidth);
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

    const handlePasswordChange = (value) => {
        setErrorNotification({});
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

    const handleEmailFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (email.length == 0) {
            setErrorNotification({
                title: "Email should not be blank"
            });
            setLoading(false);
        }
        else if (!validateEmail(email)) {
            setErrorNotification({
                title: "Enter valid email"
            });
            setLoading(false);
        }
        else {
            setLoading(true);
            setErrorNotification({
            })
            const fetchData = async () => {
                try {
                    const data = {
                        email: email,
                    }
                    const response = await fetch(`${BaseURL}/forgot-password`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    if (response.ok) {
                        setAskForPassword(false);
                    }
                    else if (response.status === 500) {
                        setServerErrorNotification({
                            title: "Email not registered"
                        })
                    }
                    setLoading(false);
                }
                catch (e) {
                    setLoading(false);
                }
            }
            fetchData();

        }
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (verificationCode.length == 0 || password.length == 0) {
            setErrorNotification({
                title: "field should  not be blank"
            });
            setLoading(false);
        }
        else if (!passwordIsValid) {
            setLoading(false);
        }
        else {

            const fetchData = async () => {
                try {
                    const data = {
                        email: email,
                        newPassword: password,
                        code: verificationCode,
                    }
                    const response = await fetch(`${BaseURL}/confirm-forget-password`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    const res= await response.json();
                    if (response.ok) {
                        navigate("/signin");
                    }
                    else if (response.status === 500) {
                        if(res.error === "error resetting passwordLimitExceededException: Attempt limit exceeded, please try after some time.")
                        setServerErrorNotification({
                            title: "Maximum attemps to reset password failed,try after some time"
                        })
                        else{
                            setServerErrorNotification({
                                title: "Enter valid verification code"
                            })
                        }
                        setAskForPassword(true);
                    }
                    setLoading(false);
                }
                catch (e) {
                    setLoading(false);
                }
            }
            fetchData();
        }
    }


    return (
        <>
            {askForPassword ?
                (<div className='forgotpasword-container' >
                    <div className='box-container'>
                        <Form onSubmit={handleEmailFormSubmit}>
                            <div style={{ paddingRight: '20px' }}>
                                <Heading>Forgot Password</Heading>
                                {typeof serverErrorNotification == 'object' && Object.keys(serverErrorNotification).length !== 0 ?
                                    (
                                        <InlineNotification
                                            className="error-notification-box"
                                            onClose={function noRefCheck() { }}
                                            onCloseButtonClick={() => { setServerErrorNotification({}) }}
                                            statusIconDescription="notification"
                                            title={serverErrorNotification.title ? serverErrorNotification.title : ''}
                                        />) : (
                                        <div className="error-notification-box-inactive"></div>
                                    )
                                }
                                <div className='login-input-wrapper' >
                                    <FormLabel className='input-label' >Enter your E-Mail to reset your password.</FormLabel>
                                    <TextInput
                                        ref={emailInput}
                                        id="email"
                                        className="login-form-input"
                                        hideLabel={true}
                                        invalid={typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0}
                                        labelText=""
                                        invalidText={(errorNotification && errorNotification.title) ? errorNotification.title : ""}
                                        placeholder="username@ibm.com"
                                        disabled={loading ? true : false}
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); if (typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                    />
                                </div>
                            </div>
                            <div className='fields-container'>
                                {loading ?
                                    (<div className='forgot-password-loader-signin'>
                                        <Loader />
                                    </div>) : (
                                        <Button
                                            type="submit"
                                            iconDescription={''}
                                            size="xl"
                                            className="submit-button"
                                        >{"Continue"}</Button>)}
                            </div>

                        </Form>
                    </div>
                </div >) : (
                    <>
                        <div className='forgotpasword-container' >
                            <div className='box-container-second'>
                                <Form onSubmit={handleFormSubmit}>
                                    <div style={{ paddingRight: '20px' }}>
                                        <Heading>Forgot Password</Heading>
                                        <p className="register-text body-01">If there is an account associated with {email}, you will receive an email with a 6-digit temporary code</p>
                                        <div className='login-input-wrapper' >
                                            <TextInput
                                                id="email"
                                                className="login-form-input"
                                                hideLabel={false}
                                                invalid={typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0 }
                                                labelText="Enter Verification Code"
                                                invalidText={(errorNotification && errorNotification.title ) ? errorNotification.title : ""}
                                                placeholder=""
                                                disabled={loading ? true : false}
                                                value={verificationCode}
                                                onChange={e => { setVerificationCode(e.target.value); if (typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                            />
                                            <PasswordInput ref={ref}
                                                type="password"
                                                className="login-form-input"
                                                id="password"
                                                labelText="Enter Password"
                                                invalid={!passwordIsValid && password.length > 0}
                                                invalidText={
                                                    !passwordIsValid && password.length > 0
                                                        ? 'Aleast 8 characters are required including uppercase, lowercase and a number.'
                                                        : null
                                                }
                                                placeholder=""
                                                disabled={loading ? true : false}
                                                value={password}
                                                onChange={(e) => handlePasswordChange(e.target.value)}
                                                onFocus={() => { setIsPasswordVisible(true) }}
                                                onBlur={() => { setIsPasswordVisible(false) }}
                                            />
                                            {isPasswordVisible && <div style={{ width: `${passwordStrengthWidth}px`, height: '4px', backgroundColor: 'green', marginTop: '2px' }}></div>}
                                            <div style={{ position: "absolute" }}>
                                                {isPasswordVisible && <ForgotPasswordStrengthChecker passwordArray={passwordArray} />}
                                            </div>

                                        </div>
                                    </div>
                                    <div className='fields-container'>
                                        {loading ?
                                            (<div className='forgot-password-loader-signin'>
                                                <Loader />
                                            </div>) :
                                            (<Button
                                                type="submit"
                                                iconDescription={''}
                                                size="xl"
                                                className="submit-button"
                                            >Reset Password</Button>)}

                                    </div>

                                </Form>
                            </div>
                        </div>
                    </>

                )}
        </>
    );
};

export default ForgotPassword;







