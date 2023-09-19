import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./signin.scss";
import { BaseURL, getQueryVariable, useAuth } from "../../sdk";
import Login from "../../components/Login";
import MagicLinkValidation from "../../components/MagicLInkValidation";

const Signin = () => {
    const navigate = useNavigate();
    const [signInPhaseOne, setSignInPhaseOne] = useState(true); // state to store signInPhase ,initially set to true to show initial login component
    const [loading, setLoading] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [email, setEmail] = useState("");
    const [loadingSuccess, setLoadingSuccess] = useState(false);
    const { signin } = useAuth();


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
        if (email.length === 0) {
            setErrorNotification({
                title: "Email should not be blank",
            });
        } else if (!validateEmail(email)) {
            setErrorNotification({
                title: "Enter valid email",
            });
        } else {
            setErrorNotification({});
            setServerErrorNotification({});
            setLoadingSuccess(true);
            try {
                const data = {
                    email: email.trim(),
                };
                const response = await fetch(`${BaseURL}/signin-email`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const res = await response.json();
                if (response.ok) {
                    setSignInPhaseOne(false);
                    setLoadingSuccess(false);
                    setServerErrorNotification({
                        title: `Login link sent to ${email}`,
                        status: "success",
                    });
                } else if (response.status === 500) {
                    setLoadingSuccess(false);
                    setServerErrorNotification({
                        title: res.error,
                        status: "success",
                    });
                }
            } catch (e) {
                console.log(e);
                setLoadingSuccess(false);
                setServerErrorNotification({
                    title: "Email address not verified",
                    status: "error",
                });
            }
        }
    };

    /** Function to perform action in case of sigin using magic link ,if any validation process failed then show error , otherwise enable user to sign in  */
    const verifyMagicLink = async (email) => {
        setLoading(true);
        setSignInPhaseOne(false)
        setServerErrorNotification({});
        try {
            await signin(email, window.location.href)
            setLoading(false);
            window.localStorage.setItem('signin-verification', JSON.stringify({
                email: email,
            }));
            navigate("/home/dashboard");
        } catch (err) {
            console.log(err);
            setServerErrorNotification({
                title: "Login failed",
                status: "error",
            });
            setLoading(false);
        }
    };

    // handle magic link redirection from email
    const handleEmailLinkRedirect = () => {
        const urlEmail = getQueryVariable(window.location.href, "email")
        if (urlEmail) {
            setEmail(urlEmail)
            verifyMagicLink(urlEmail).then(r => {})
        }
    };

    useEffect(() => {
        if (signInPhaseOne) {
            setErrorNotification({});
        }
    }, [signInPhaseOne]);

    useEffect(() => {
        // get login info from url on page load
        handleEmailLinkRedirect()
    }, []);

    useEffect(() => {
        window.localStorage.removeItem('signin-verification');
        window.addEventListener('storage', checkOtherTabVerification);

        return () => {
            window.removeEventListener('storage', checkOtherTabVerification);
        }
    }, [])

    const checkOtherTabVerification = (e) => {
        if (e.key === 'signin-verification') {
            const data = JSON.parse(e.newValue);
            console.log('[Storage I] receive message:', data);
            if (data?.email) {
                window.localStorage.setItem('signin-close-tab', String(+(new Date)))
                window.location.href = "/home/dashboard"
            }
        } else if (e.key === 'signin-close-tab') {
            console.log('[Storage I] receive message:', e.newValue);
            // TODO Scripts may close only the windows that were opened by them.
            window.close()
        }
    }

    return (
        <>
            <div style={{ height:"100%" }}>
                {signInPhaseOne ? (
                    <Login
                        heading={"Log in to Bynar"}
                        loading={loadingSuccess}
                        handleFormSubmit={handleEmailFormSubmit}
                        setErrorNotification={setErrorNotification}
                        setServerErrorNotification={setServerErrorNotification}
                        serverErrorNotification={serverErrorNotification}
                        errorNotification={errorNotification}
                        showCreateAccount={true}
                        createAccountText={"Don't have an account?"}
                        navigationUrl={"/signup"}
                        navigationUrlText={"Create an Bynar account"}
                        labelText={"E-mail"}
                        labelValue={email}
                        setFormLabelState={setEmail}
                        buttonText={"Continue"}
                        enableForgotPassword={false}
                        placeholderText={" "}
                        showRememberId={false}
                        text={`Logging in as ${email}`}
                        subtitle={"Not you?"}
                        setSignInPhaseOne={setSignInPhaseOne}
                    />
                ) : (
                    /* isPaswordLessSignin if true then sign in using magic link based on otp validation */
                    <MagicLinkValidation
                        heading={"Log in to Bynar"}
                        loading={loading}
                        loadingSucess={loadingSuccess}
                        handleFormSubmit={verifyMagicLink}
                        errorNotification={errorNotification}
                        buttonText={"Login"}
                        text={`Logging in as ${email}`}
                        subtitle={"Not you?"}
                        setSignInPhaseOne={setSignInPhaseOne}
                        showCreateAccount={true}
                        createAccountText={"Don't have an account?"}
                        navigationUrl={"/signup"}
                        navigationUrlText={"Create an Bynar account"}
                        placeholderText={""}
                        setErrorNotification={setErrorNotification}
                        setServerErrorNotification={setServerErrorNotification}
                        serverErrorNotification={serverErrorNotification}
                        handleEmailFormSubmit={handleEmailFormSubmit}
                    />
                )}
            </div>
        </>
    );
};

export default Signin;
