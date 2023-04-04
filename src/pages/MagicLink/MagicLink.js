import {
    Button,
    Form,
    FormLabel,
    Heading
} from '@carbon/react';
import { Auth } from 'aws-amplify';
import {
    TextInput, ToastNotification
} from 'carbon-components-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    useLocation, useNavigate,
    useSearchParams
} from 'react-router-dom';
import { Loader } from '../../Components/Loader/Loader';
import { AuthContext } from '../../sdk/context/AuthContext';
import './MagicLink.scss';
import { MagicLinkPopup } from './MagicLinkPopup';
import { Amplify } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';

Amplify.configure({
    Auth: {
        region: 'eu-central-1',
        userPoolId: 'eu-central-1_IWbh7BLrz',
        userPoolWebClientId: '1bmp66b2352s3c0bsll8c5qfd9',
    }
});
export const MagicLink = () => {

    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const authContext = useContext(AuthContext)
    const [error, setError] = useState("");
    const [isMagicLink, setIsMagicLink] = useState(true);
    const [loading, setLoading] = useState(false);
    const [userSignIn, setUserSignIn] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [serverErrorNotification, setServerErrorNotification] = useState({});
    const [userEmail, setEmail] = useState("");
    const [loginToken, setLoginToken] = useState("");
    const [serverNotification, setServerNotification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const cognitoUser = useRef(null);

    const emailInput = useRef(null);
    const validateEmail = (userEmail) => {
        return String(userEmail)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleEmailFormSubmit = async (e) => {
        e.preventDefault();
        if (userEmail.length == 0) {
            setErrorNotification({
                title: "Email should not be blank"
            });
        }
        else if (!validateEmail(userEmail)) {
            setErrorNotification({
                title: "Enter valid email"
            });
        }
        else {
            setErrorNotification({
            })
            setServerNotification(false);
            try {
                cognitoUser.current = await Auth.signIn({
                    username: userEmail,
                });

                setIsMagicLink(false);
            }
            catch (e) {
                setServerErrorNotification({ title: 'Email address not verified', status: 'error' });
                setServerNotification(true);

            }

        }

    }


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
            setServerErrorNotification({ title: 'Enter valid code', status: 'error' });
            setServerNotification(true);
            setIsMagicLink(true);
        }
    }

    useEffect(async () => {
        const tokenCheck = localStorage.getItem("token");
        if (tokenCheck !== null) {
            setUserSignIn(true);

        }

    }, []);

    return (
        <>
            {userSignIn ? (
                <MagicLinkPopup />
            ) : (
                <>
                    {isMagicLink ?
                        (<div className='magiclink-container' >
                            <div className='box-container'>
                                <Form onSubmit={handleEmailFormSubmit}>
                                    <div style={{ paddingRight: '20px' }}>
                                        <Heading>Magic Link</Heading>
                                        {serverNotification ? (
                                            <div className='magiclink-notification-box'>
                                                <ToastNotification
                                                    iconDescription="describes the close button"
                                                    subtitle={serverErrorNotification?.title}
                                                    timeout={0}
                                                    title={""}
                                                    kind={serverErrorNotification?.status}
                                                />
                                            </div>
                                        ) :
                                            (
                                                <div className='magiclink-notification-box'>

                                                </div>
                                            )}
                                        <div className='login-input-wrapper' >
                                            <FormLabel className='input-label' >Enter your Email for magic link </FormLabel>
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
                                                value={userEmail}
                                                onChange={e => { setEmail(e.target.value); if (typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0) setErrorNotification({}); setErrorNotification(false) }}
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
                                            >{"Continue"}</Button>)}

                                    </div>

                                </Form>
                            </div>
                        </div>) : (
                            <div className='magiclink-container' >
                                <div className='box-container'>
                                    <Form onSubmit={verifyMagicLink}>
                                        <div style={{ paddingRight: '20px' }}>
                                            <div className='login-input-wrapper' >
                                                <FormLabel className='input-label' >Enter Verification Code </FormLabel>
                                                <TextInput
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
                                                >{"Verify"}</Button>)}

                                        </div>

                                    </Form>
                                </div>
                            </div>
                        )}
                </>
            )}
        </>
    )
}