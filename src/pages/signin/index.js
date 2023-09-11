import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./signin.scss";
import { AuthContext, BaseURL, useAuth } from "../../sdk";
import Login from "../../components/Login";
import MagicLinkValidation from "../../components/MagicLInkValidation";

const Signin = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const authContext = useContext(AuthContext);
    const [signInPhaseOne, setSignInPhaseOne] = useState(true); // state to store signInPhase ,initially set to true to show initial login component
    const [loading, setLoading] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [email, setEmail] = useState("");
    const [loadingSucess, setLoadingSucess] = useState(false);
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
            setLoadingSucess(true);
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
                    setLoadingSucess(false);
                    setServerErrorNotification({
                        title: `Login link sent to ${email}`,
                        status: "success",
                    });
                } else if (response.status === 500) {
                    setLoadingSucess(false);
                    setServerErrorNotification({
                        title: res.error,
                        status: "success",
                    });
                }
            } catch (e) {
                console.log(e);
                setLoadingSucess(false);
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
            signin(email, window.location.href)
            setLoading(false);
        } catch (err) {
            console.log(err);
            setServerErrorNotification({
                title: "Login failed",
                status: "error",
            });
            // setSignInPhaseOne(true)
            setLoading(false);
        }
    };

    // handle magic link redirection from email
    const handleEmailLinkRedirect = () => {
        const urlEmail = searchParams.get("email")
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

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {signInPhaseOne ? (
                    <Login
                        heading={"Log in to Bynar"}
                        loading={loadingSucess}
                        handleFormSubmit={handleEmailFormSubmit}
                        setErrorNotification={setErrorNotification}
                        setServerErrorNotification={setServerErrorNotification}
                        serverErrorNotification={serverErrorNotification}
                        errorNotification={errorNotification}
                        showCreateAccount={true}
                        createAccoutText={"Don't have an account?"}
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
                        loadingSucess={loadingSucess}
                        handleFormSubmit={verifyMagicLink}
                        errorNotification={errorNotification}
                        buttonText={"Login"}
                        text={`Logging in as ${email}`}
                        subtitle={"Not you?"}
                        setSignInPhaseOne={setSignInPhaseOne}
                        showCreateAccount={true}
                        createAccoutText={"Don't have an account?"}
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
