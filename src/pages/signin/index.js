import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./signin.scss";
import { BaseURL, getQueryVariable, useAuth } from "../../sdk";
import Login from "../../components/Login";
import MagicLinkValidation from "../../components/MagicLInkValidation";
import {
    parseTabMessage,
    sendTabMessage,
    SubscribeCloseTabMessage,
    SubscribeTabMessage
} from "../../sdk/tabMessage";
import {useTranslation} from "react-i18next";

const Signin = () => {
    const navigate = useNavigate();
    const [signInPhaseOne, setSignInPhaseOne] = useState(true); // state to store signInPhase ,initially set to true to show initial login component
    const [loading, setLoading] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [email, setEmail] = useState("");
    const [loadingSuccess, setLoadingSuccess] = useState(false);
    const { signin } = useAuth();
    const { t } = useTranslation();

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
                title: t("email-should-not-blank"),
            });
        } else if (!validateEmail(email)) {
            setErrorNotification({
                title: t("enter-valid-email"),
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
                        title: `${t("login-link-sent")} ${email}`,
                        status: "success",
                    });
                } else if (response.status === 500) {
                    setLoadingSuccess(false);
                    let err = res.error
                    if (err.includes("no user found")) {
                        err = t("no-user-found")
                    } else if (err.includes("email not signed up")) {
                        err = t("email-not-signed-up")
                    } else if (err.includes("set custom user claims fail")) {
                        err = t("set-custom-fail")
                    } else if (err.includes("send email fail")) {
                        err = t("send-email-fail")
                    }
                    setServerErrorNotification({
                        title: err,
                        status: "success",
                    });
                }
            } catch (e) {
                console.log(e);
                setLoadingSuccess(false);
                setServerErrorNotification({
                    title: t("something-went-wrong"),
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
            sendTabMessage('signin-verification', { email: email })
            // close tab before 300ms, it cannot be closed after navigating to other page
            // setTimeout(() => {
            //     setLoading(false);
            //     navigate("/home/dashboard");
            // }, 300)
            setLoading(false);
            navigate("/home/dashboard");
        } catch (err) {
            console.log(err);
            let title = "Login fail"
            if (err?.message){
              title = err?.message
            }
            setServerErrorNotification({
                title: title,
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

    // check if other tab is open and user is trying to login
    const checkOtherTabVerification = (e) => {
        parseTabMessage(e, 'signin-verification', (data, e) => {
            if (data?.message?.email) {
                // sendCloseTabMessage(data?.from)
                window.focus()
                window.location.href = "/home/dashboard"
            }
        })
    }

    return (
        <>
            <SubscribeCloseTabMessage></SubscribeCloseTabMessage>
            <SubscribeTabMessage
              subscribe={ checkOtherTabVerification }>
            </SubscribeTabMessage>
            <div style={{ height:"100%" }}>
                {signInPhaseOne ? (
                    <Login
                        heading={t("login-to-bynar")}
                        loading={loadingSuccess}
                        handleFormSubmit={handleEmailFormSubmit}
                        setErrorNotification={setErrorNotification}
                        setServerErrorNotification={setServerErrorNotification}
                        serverErrorNotification={serverErrorNotification}
                        errorNotification={errorNotification}
                        showCreateAccount={true}
                        createAccountText={t("have-an-account")}
                        navigationUrl={"/signup"}
                        navigationUrlText={t("create-account")}
                        labelText={t("email-label")}
                        labelValue={email}
                        setFormLabelState={setEmail}
                        buttonText={t("continue")}
                        enableForgotPassword={false}
                        placeholderText={" "}
                        showRememberId={false}
                        text={`${t("logging-in-as")} ${email}`}
                        subtitle={t("not-you")}
                        setSignInPhaseOne={setSignInPhaseOne}
                    />
                ) : (
                    /* isPaswordLessSignin if true then sign in using magic link based on otp validation */
                    <MagicLinkValidation
                        heading={t("login-to-bynar")}
                        loading={loading}
                        loadingSuccess={loadingSuccess}
                        handleFormSubmit={verifyMagicLink}
                        errorNotification={errorNotification}
                        buttonText={"Login"}
                        text={`${t("logging-in-as")} ${email}`}
                        subtitle={t("not-you")}
                        setSignInPhaseOne={setSignInPhaseOne}
                        showCreateAccount={true}
                        createAccountText={t("have-an-account")}
                        navigationUrl={"/signup"}
                        navigationUrlText={t("create-account")}
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
