import React, { useState, useRef, useContext } from 'react';
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
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleEmailFormSubmit = (e) => {
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
            setAskForPassword(false);
        }



    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (password.length == 0) {
            setErrorNotification({
                title: "Password should not be blank"
            });
        }
        else {
            setErrorNotification({
            })
            const fetchData = async () => {
                try {
                    const data = {
                        email: email,
                        password: password,
                    }
                    const response = await authContext.signin(data, false)
                    // if(response?.mfaEnabled){
                    //     setMultiFactorAuthEnable(true);      
                    // }
                    if (response?.error) {
                        
                        setServerErrorNotification({
                            title: "Wrong email or password"
                        })
                       
                        setAskForPassword(true)
                    }
                    setLoading(false);
                }
                catch (e) {
                    console.log("error");
                    setLoading(false);
                }
            }
            fetchData();
        }
        
    }

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
                                        <Heading>Login In</Heading>
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
                                        <p className="register-text body-01">Don't have an account? <Link style={{cursor:'pointer'} } className="underlined-link" onClick={() => { navigate("/signup") }}>Create an IBMid</Link></p>
                                        <div className='login-input-wrapper' >
                                            <FormLabel className='input-label' >IBMid <Link style={{cursor:'pointer'} } className="forgot-link" onClick={() => { navigate("/forgotpassword") }}>Forgot ID?</Link></FormLabel>
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
                                        <Checkbox
                                            className='checkbox-item'
                                            labelText={`Remember ID`}
                                            id="checkbox-label-1"
                                        />
                                    </div>
                                    <div className='fields-container'>
                                        <Button

                                            type="submit"
                                            iconDescription={""}
                                            size="xl"
                                            className="submit-button"
                                        >{"Continue"}</Button>
                                    </div>

                                </Form>
                            </div>
                        </div>) : (
                            <div className='signin-container' >
                                <div className='box-container'>
                                    <Form onSubmit={handleFormSubmit}>
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







