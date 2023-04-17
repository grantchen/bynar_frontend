import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Form,
    Button,
    Heading,
    Checkbox,
    FormLabel,
    Link,
    InlineNotification,
} from '@carbon/react';
import {
    PasswordInput, TextInput
} from 'carbon-components-react';
import './signin.scss'
import { MultiFactorAuthentication } from '../../Components/MultiFactorAuthentication/MultiFactorAuthentication';
import { Loader } from '../../Components/Loader/Loader';
import { AuthContext } from '../../sdk/context/AuthContext';
import { BaseURL } from '../../sdk/constant';
import { Amplify } from 'aws-amplify';
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import OtpInput from 'react-otp-input';

Amplify.configure({
    Auth: {
        region: 'eu-central-1',
        userPoolId: 'eu-central-1_IWbh7BLrz',
        userPoolWebClientId: '1bmp66b2352s3c0bsll8c5qfd9',
    }
});

const Signin = () => {

    const navigate = useNavigate();
    const authContext = useContext(AuthContext)
    const [askForPassword, setAskForPassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadingSuccess, setLoadingSuccess] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [multiFactorAuthEnabled, setMultiFactorAuthEnable] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const emailInput = useRef(null);
    const cognitoUser = useRef(null);
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleEmailFormSubmit = async (e) => {
        e.preventDefault();
        if (email.length == 0) {
            setErrorNotification({
                title: "Email should not be blank"
            });
        }
        else if (!validateEmail(email)) {
            setErrorNotification({
                title: "Enter valid email"
            });
        }
        else {
            setErrorNotification({
            })
            setLoading(true);
            try {
                cognitoUser.current = await Auth.signIn({
                    username: email,
                });
                setAskForPassword(false);
                setServerErrorNotification({})
                setLoading(false)
            }
            catch (e) {
                setLoading(false)
                setServerErrorNotification({ title: 'Email address not verified', status: 'error' });
            }
        }
    }

    // const handleFormSubmit = (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     if (password.length == 0) {
    //         setErrorNotification({
    //             title: "Password should not be blank"
    //         });
    //     }
    //     else {
    //         setErrorNotification({
    //         })
    //         const fetchData = async () => {
    //             try {
    //                 const data = {
    //                     email: email,
    //                     password: password,
    //                 }
    //                 const response = await authContext.signin(data, false)
    //                 // if(response?.mfaEnabled){
    //                 //     setMultiFactorAuthEnable(true);      
    //                 // }
    //                 if (response?.error) {

    //                     setServerErrorNotification({
    //                         title: "Wrong email or password"
    //                     })

    //                     setAskForPassword(true)
    //                 }
    //                 setLoading(false);
    //             }
    //             catch (e) {
    //                 console.log("error");
    //                 setLoading(false);
    //             }
    //         }
    //         fetchData();
    //     }

    // }

    const verifyMagicLink = async (e) => {
        e.preventDefault()
        if (verificationCode.length == 0) {
            setErrorNotification({
                title: "Verification code should not be blank"
            });
        }
        await Auth.sendCustomChallengeAnswer(cognitoUser.current, verificationCode);
        try {
            const res = await Auth.currentSession();
            if (res.accessToken.jwtToken) {
                localStorage.setItem("token", res.accessToken.jwtToken);
                localStorage.setItem("theme", 'carbon-theme--white');
                localStorage.setItem("lang", "english");
                const bodyElement = document.body;
                bodyElement.className = localStorage.getItem("theme");
                navigate("/dashboard");
            }
        } catch {
            console.log('Apparently the user did not enter the right code');
            setErrorNotification({ title: 'Enter valid code', status: 'error' });
            setAskForPassword(true)
        }
    }

    useEffect(()=>{
       if(askForPassword){
        setErrorNotification({})
        setVerificationCode('')
       }
    },[askForPassword])
    return (
        <>
            {multiFactorAuthEnabled ? (
                <MultiFactorAuthentication email={email} errorNotification={errorNotification} loading={loading} setLoading={setLoading} setErrorNotification={setErrorNotification} />
            ) : (
                <>
                    {askForPassword ?
                        (<div className='signin-container' >
                            <div className='box-container'>
                                <Form onSubmit={handleEmailFormSubmit}>
                                    <div style={{ paddingRight: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Heading>Login</Heading>
                                            {/* <Link style={{cursor:'pointer'} } className="underlined-link" onClick={() => { navigate("/magic-link") }}>Sign In using magic link</Link> */}
                                        </div>
                                        {typeof serverErrorNotification == 'object' && Object.keys(serverErrorNotification).length !== 0 ?
                                            (
                                                <InlineNotification
                                                    className="error-notification-box"
                                                    onClose={function noRefCheck() { }}
                                                    onCloseButtonClick={() => { setErrorNotification({}) }}
                                                    statusIconDescription="notification"
                                                    title={serverErrorNotification.title ? serverErrorNotification.title : ''}
                                                />) : (
                                                <div className="error-notification-box-inactive"></div>
                                            )
                                        }
                                        <p className="register-text body-01">Don't have an account? <Link style={{ cursor: 'pointer' }} className="underlined-link" onClick={() => { navigate("/signup") }}>Create a new account</Link></p>
                                        <div className='login-input-wrapper' >
                                            {/* <FormLabel className='input-label' >Email Id <Link style={{ cursor: 'pointer' }} className="forgot-link" onClick={() => { navigate("/forgotpassword") }}>Forgot ID?</Link></FormLabel> */}
                                            <FormLabel className='input-label' >Email Id </FormLabel>
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
                                                onChange={e => { setEmail(e.target.value); if (typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0) setErrorNotification({}); setServerErrorNotification({}); }}
                                            />
                                        </div>
                                        <Checkbox
                                            className='checkbox-item'
                                            labelText={`Remember ID`}
                                            id="checkbox-label-1"
                                        />
                                    </div>
                                    <div className='fields-container'>
                                    {loading ?
                                                (<div className='loader-signin'>
                                                    <Loader />
                                                </div>) :
                                                (<Button
                                                    type="submit"
                                                    iconDescription={""}
                                                    size="xl"
                                                    className="submit-button"
                                                >Continue</Button>)}
                                    </div>

                                </Form>
                            </div>
                        </div>) : (
                            <div className='signin-container' >
                                <div className='box-container'>
                                    {/* <Form onSubmit={handleFormSubmit}>
                                        <div style={{ paddingRight: '20px' }}>
                                            <Heading>Login In</Heading>
                                            <p className="register-text body-01">Logging in as {email}&nbsp; <Link className="underlined-link" style={{ cursor: 'pointer' }} onClick={() => { setAskForPassword(true) }}> Not you?</Link></p>
                                            <div className='login-input-wrapper' >
                                                <FormLabel className='input-label' >Password <Link style={{cursor:'pointer'} } className="forgot-link" onClick={() => { navigate("/forgotpassword") }}>Forgot Password?</Link></FormLabel>
                                                <PasswordInput
                                                    type="password"
                                                    className="login-form-input"
                                                    id="password"

                                                    labelText=""
                                                    invalid={typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0}
                                                    invalidText={(errorNotification && errorNotification.title) ? errorNotification.title : ""}
                                                    placeholder=""
                                                    value={password}
                                                    onChange={e => { setPassword(e.target.value); if (typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                                />
                                            </div>
                                        </div>

                                        <div className='fields-container'>

                                            {loading ?
                                                (<div className='loader-signin'>
                                                    <Loader />
                                                </div>) :
                                                (<Button
                                                    type="submit"
                                                    iconDescription={""}
                                                    size="xl"
                                                    className="submit-button"
                                                >Login</Button>)}
                                        </div>

                                    </Form> */}
                                    <Form onSubmit={verifyMagicLink}>
                                        <div style={{ paddingRight: '20px' }}>
                                            <Heading>Login </Heading>
                                            <p className="register-text body-01">Logging in as {email}&nbsp; <Link className="underlined-link" style={{ cursor: 'pointer' }} onClick={() => { setAskForPassword(true) }}> Not you?</Link></p>
                                            <div className='login-input-wrapper' >
                                                <FormLabel className='input-label' >Enter 6 Character Verification Code </FormLabel>
                                                {/* <TextInput
                                                    id="email"
                                                    className="login-form-input"
                                                    hideLabel={false}
                                                    invalid={typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0}
                                                    labelText=""
                                                    invalidText={(errorNotification && errorNotification.title) ? errorNotification.title : ""}
                                                    placeholder=""
                                                    disabled={loading ? true : false}
                                                    value={verificationCode}
                                                    onChange={e => { setVerificationCode(e.target.value); if (typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                                /> */}
                                                <OtpInput
                                                    value={verificationCode}
                                                    onChange={setVerificationCode}
                                                    numInputs={6}
                                                    renderSeparator={<span>-</span>}
                                                    renderInput={(props) => <input {...props} />}
                                                    inputStyle={{width:'56px'}}
                                                />
                                                <div>
                                                {(errorNotification && errorNotification.title && verificationCode.length ==0) ? <p style={{color:'#DA1E28',fontSize:'12px',marginTop:'4px'}}>{errorNotification.title}</p>: ""}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='fields-container'>

                                            {loading ?
                                                (<div className='loader-signin'>
                                                    <Loader />
                                                </div>) :
                                                (<Button
                                                    type="submit"
                                                    iconDescription={""}
                                                    size="xl"
                                                    className="submit-button"
                                                >Login</Button>)}
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        )}
                </>
            )}
        </>
    );
};

export default Signin;







