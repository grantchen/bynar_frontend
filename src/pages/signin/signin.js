import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './signin.scss'
import { AuthContext } from '../../sdk/context/AuthContext';
import { Auth } from 'aws-amplify';
import Login from '../../Components/Login/Login';
import MagicLinkValidation from '../../Components/MagicLInkValidation/MagicLInkValidation';

import { Amplify } from 'aws-amplify';
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
    const [signInPhaseOne, setSignInPhaseOne] = useState(true); // state to store signInPhase ,initially set to true to show initial login component
    const [loading, setLoading] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [password, setPassword] = useState("")
    const [isPasswordLessSignin, setPasswordLessSignin] = useState(true)
    const cognitoUser = useRef(null);

    /** function to validate email address. */
    const validateEmail = (email) => {
        return String(email.trim())
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    /** Function to handle email submit and if email validation sucessfull then move to next part of signin flow. */
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
                setSignInPhaseOne(false);
                setServerErrorNotification({})
                setLoading(false)
            }
            catch (e) {
                setLoading(false)
                setServerErrorNotification({ title: 'Email address not verified', status: 'error' });
            }
        }
    }

    /** Function to perform action in case of sigin using password ,if any validation process failed then show error , otherwise enable user to sign in */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (password.length == 0) {
            setErrorNotification({
                title: "Password should not be blank"
            });
            setLoading(false);
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

                    if (response?.error) {

                        setServerErrorNotification({
                            title: "Wrong email or password"
                        })

                        setSignInPhaseOne(true)
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

    /** Function to perform action in case of sigin using magic link ,if any validation process failed then show error , otherwise enable user to sign in  */
    const verifyMagicLink = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (verificationCode.length == 0) {
            setErrorNotification({
                title: "Verification code should not be blank"
            });
            setLoading(false)
        }
        await Auth.sendCustomChallengeAnswer(cognitoUser.current, verificationCode);
        
        try {
            const res = await Auth.currentSession();
            setLoading(false)
            if (res?.accessToken?.jwtToken) {
                localStorage.setItem("token", res.accessToken.jwtToken);
                localStorage.setItem("theme", 'carbon-theme--white');
                localStorage.setItem("lang", "english");
                const bodyElement = document.body;
                bodyElement.className = localStorage.getItem("theme");
                navigate("/dashboard");
            }
        } catch (err) {
            console.log('Apparently the user did not enter the right code');
            setServerErrorNotification({ title: 'Enter valid code', status: 'error' });
            setSignInPhaseOne(true)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (signInPhaseOne) {
            setErrorNotification({})
            setVerificationCode('')
        }
    }, [signInPhaseOne])

    return (
        <>
            {signInPhaseOne ?
                (
                    <Login heading={"Login"} loading={loading} handleFormSubmit={handleEmailFormSubmit} setErrorNotification={setErrorNotification} setServerErrorNotification={setServerErrorNotification} serverErrorNotification={serverErrorNotification} errorNotification={errorNotification} showCreateAccount={true} createAccoutText={"Don't have an account?"} navigationUrl={"/signup"} navigationUrlText={"Create a new account"} labelText={"Email Id"} labelValue={email} setFormLabelState={setEmail} buttonText={"Continue"} enableForgotPassword={false} placeholderText={"username@gmail.com"} showRememberId={true} text={`Logging in as ${email}`} subtitle={'Not you?'} setSignInPhaseOne={setSignInPhaseOne} />
                ) : (isPasswordLessSignin ?
                    (
                        /* isPaswordLessSignin if true then sign in using magic link based on otp validation */
                        <MagicLinkValidation heading={"Login"} loading={loading} handleFormSubmit={verifyMagicLink} errorNotification={errorNotification} labelText={"Enter 6 length verification code"} labelValue={verificationCode} setFormLabelState={setVerificationCode} buttonText={"Login"} text={`Logging in as ${email}`} subtitle={'Not you?'} setSignInPhaseOne={setSignInPhaseOne} />
                    ) :
                    (
                        /* isPaswordLessSignin if false then sign in using password */
                        <Login heading={"Login"} loading={loading} handleFormSubmit={handleFormSubmit} setErrorNotification={setErrorNotification} setServerErrorNotification={setServerErrorNotification} serverErrorNotification={serverErrorNotification} errorNotification={errorNotification} showCreateAccount={false} createAccoutText={""} navigationUrl={"/signup"} navigationUrlText={""} labelText={"Password"} labelValue={password} setFormLabelState={setPassword} buttonText={"Login"} enableForgotPassword={false} placeholderText={"Password"} navigateToLogin={true} text={`Logging in as ${email}`} subtitle={'Not you?'} setSignInPhaseOne={setSignInPhaseOne} />
                    )
                )}
        </>
    );
};

export default Signin;







