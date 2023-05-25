import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./signin.scss";
import { AuthContext } from "../../sdk";
import { Auth } from "aws-amplify";
import Login from "../../components/Login";
import MagicLinkValidation from "../../components/MagicLInkValidation";

const Signin = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [signInPhaseOne, setSignInPhaseOne] = useState(true); // state to store signInPhase ,initially set to true to show initial login component
    const [loading, setLoading] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordLessSignin, setPasswordLessSignin] = useState(true);
    const cognitoUser = useRef(null);
    const [loadingSucess, setLoadingSucess] = useState(false);

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
                cognitoUser.current = await Auth.signIn({
                    username: email.trim(),
                });
                setSignInPhaseOne(false);
                setLoadingSucess(false);
                setVerificationCode("");
                if (!signInPhaseOne)
                    setServerErrorNotification({
                        title: `security code sent to ${email}`,
                        status: "success",
                    });
            } catch (e) {
                console.log(e);
                setLoadingSucess(false);
                setVerificationCode("");
                setServerErrorNotification({
                    title: "Email address not verified",
                    status: "error",
                });
            }
        }
    };

    /** Function to perform action in case of sigin using password ,if any validation process failed then show error , otherwise enable user to sign in */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (password.length === 0) {
            setErrorNotification({
                title: "Password should not be blank",
            });
            setLoading(false);
        } else {
            setErrorNotification({});
            const fetchData = async () => {
                try {
                    const data = {
                        email: email,
                        password: password,
                    };
                    const response = await authContext.signin(data, false);

                    if (response?.error) {
                        setServerErrorNotification({
                            title: "Wrong email or password",
                        });

                        setSignInPhaseOne(true);
                    }
                    setLoading(false);
                } catch (e) {
                    console.log("error");
                    setLoading(false);
                }
            };
            fetchData();
        }
    };

    /** Function to perform action in case of sigin using magic link ,if any validation process failed then show error , otherwise enable user to sign in  */
    const verifyMagicLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        setServerErrorNotification({});
        if (verificationCode.trim().length === 0) {
            setErrorNotification({
                title: "Security code should not be blank",
            });
            setLoading(false);
            setVerificationCode("");
        } else {
            try {
                await Auth.sendCustomChallengeAnswer(
                    cognitoUser.current,
                    verificationCode
                );
                await authContext.refreshPostSignIn();

                setLoading(false);
            } catch (err) {
                console.log(err);
                if (
                    err ===
                    "NotAuthorizedException: Invalid session for the user."
                ) {
                    setServerErrorNotification({
                        title: "Maximum attempts reached , please login using new code",
                        status: "error",
                    });
                } else
                    setServerErrorNotification({
                        title: "Enter correct security code",
                        status: "error",
                    });
                // setSignInPhaseOne(true)
                setLoading(false);
                setVerificationCode("");
            }
        }
    };

    useEffect(() => {
        if (signInPhaseOne) {
            setErrorNotification({});
            setVerificationCode("");
        }
    }, [signInPhaseOne]);

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
                ) : isPasswordLessSignin ? (
                    /* isPaswordLessSignin if true then sign in using magic link based on otp validation */
                    <MagicLinkValidation
                        heading={"Log in to Bynar"}
                        loading={loading}
                        loadingSucess={loadingSucess}
                        handleFormSubmit={verifyMagicLink}
                        errorNotification={errorNotification}
                        labelText={"Security code"}
                        labelValue={verificationCode}
                        setFormLabelState={setVerificationCode}
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
                ) : (
                    /* isPaswordLessSignin if false then sign in using password */
                    <Login
                        heading={"Login"}
                        loading={loading}
                        handleFormSubmit={handleFormSubmit}
                        setErrorNotification={setErrorNotification}
                        setServerErrorNotification={setServerErrorNotification}
                        serverErrorNotification={serverErrorNotification}
                        errorNotification={errorNotification}
                        showCreateAccount={false}
                        createAccoutText={""}
                        navigationUrl={"/signup"}
                        navigationUrlText={""}
                        labelText={"Password"}
                        labelValue={password}
                        setFormLabelState={setPassword}
                        buttonText={"Login"}
                        enableForgotPassword={false}
                        placeholderText={"Password"}
                        navigateToLogin={true}
                        text={`Logging in as ${email}`}
                        subtitle={"Not you?"}
                        setSignInPhaseOne={setSignInPhaseOne}
                    />
                )}
            </div>
        </>
    );
};

export default Signin;
