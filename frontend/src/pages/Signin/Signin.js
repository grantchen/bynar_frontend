import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import UserPool from "../../UserPool";
import { AccountContext } from '../../components/Accounts';

import {
    Theme,
    Content,
    Form,
    Stack,
    TextInput,
    Button,
    Heading,
    Checkbox,
    InlineLoading,
    FormLabel,
    Link,
    InlineNotification,
  } from '@carbon/react';
import { ArrowRight, ArrowLeft } from '@carbon/react/icons';

const Signin = () => {

    let navigate = useNavigate();
    const { authenticate } = useContext(AccountContext);

    const [askForPassword, setAskForPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingSuccess, setLoadingSuccess] = useState(false);
    const [errorNotification, setErrorNotification] = useState({});
    const [submitText, setSubmitText] = useState("Continue");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailInput = useRef(null);
    const passwordInput = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (askForPassword) {
            startLoading();
            authenticate(email, password)
            .then(data => {
                stopLoading(() => {
                    navigate("/");
                });
            })
            .catch(err => {
                stopLoading(() => {
                    setErrorNotification({
                        title: "Password is invalid.",
                        subtitle: "Try again.",
                    });
                    setPassword("");
                    passwordInput.current.focus();
                });
            });
        } else {
            startLoading();
            UserPool.signUp(email, '123', [], null, (err, data) => {
                if (err.name.match(/UsernameExistsException/)) {
                    //--- User exist
                    stopLoading(() => {
                        setInputMode("password");
                    });
                } else {
                    //--- User does not exist
                    stopLoading(() => {
                        setErrorNotification({
                            title: "Email does not exist.",
                            subtitle: "Try again.",
                        });
                        setEmail("");
                        emailInput.current.focus();
                    });
                }
            });
        }
        
    }

    const startLoading = () => {
        setLoading(true);
    }

    const stopLoading = (callback) => {
        setLoadingSuccess(true);
        setTimeout(() => {
            setLoadingSuccess(false);
            setLoading(false);
            callback();
        }, 500);
    }

    const setInputMode = (mode) => {
        if (mode === "password") {
            setAskForPassword(true);
            setSubmitText("Login");
            setTimeout(() => passwordInput.current.focus());
        } else {
            setAskForPassword(false);
            setSubmitText("Continue");
            setTimeout(() => emailInput.current.focus());
        }
    };

    const setEmailInputMode = (event) => {
        event.preventDefault();
        setInputMode();
    }

  return (
    <>
            <Theme theme="g10" className={'theme-container'} >
            
                <div className='outer' >
                    <div className='middle' >
                        <div className='inner' >


                        <Form onSubmit={handleSubmit}>
                            <Content className={'signin-container'} >
                            
                                <Theme theme="white">
                                <div className='heading-container' >
                                    <Heading>Login In</Heading>
                                    {(() => {
                                    if (askForPassword) {
                                    return (
                                        // <p className='headingSubtitle' > 
                                        // <Link className="backToEmailLink" onClick={setEmailInputMode} >
                                        //     <ArrowLeft className="backToEmailLinkIcon" /> Logging in as {email}
                                        // </Link>
                                        // </p>
                                        <p className='headingSubtitle' > 
                                          Logging in as {email}&nbsp;
                                          <Link className="underlined-link" onClick={setEmailInputMode} >
                                              Not you?
                                          </Link>
                                        </p>
                                    )
                                    } else {
                                      return (
                                        <p className="register-text body-01">Don't have an account? <Link className="underlined-link" href="/signup">Create an IBMid</Link></p>
                                      )
                                    }
                                    })()}
                                </div>
                                {/* {(() => {
                                    if (typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0) {
                                        return (
                                            <InlineNotification 
                                                onClose={function noRefCheck(){}}
                                                onCloseButtonClick={() => { setErrorNotification({}) }}
                                                statusIconDescription="notification"
                                                subtitle={errorNotification.subtitle ? errorNotification.subtitle : ''}
                                                title={errorNotification.title ? errorNotification.title : ''}
                                            />
                                        );
                                    }
                                })()} */}
                                        
                                        <Stack orientation={'vertical'} gap={7}>
                                            
                                            {
                                                askForPassword ? 
                                                    (
                                                      <div className='login-input-wrapper' >
                                                        <FormLabel className={'input-label'} >Password <Link className="forgot-link" href="#">Forgot Password?</Link></FormLabel>
                                                        <TextInput.PasswordInput
                                                            ref={passwordInput}
                                                            id="password"
                                                            className="login-form-input"
                                                            labelText=""
                                                            invalid= {typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0}
                                                            invalidText={(errorNotification && errorNotification.title) ? errorNotification.title : ""}
                                                            placeholder=""
                                                            disabled={loading ? true : false}
                                                            value={password}
                                                            onChange={e => setPassword(e.target.value)}
                                                        />
                                                      </div>
                                                    ) 
                                                : 
                                                    (
                                                        <div className='login-input-wrapper' >
                                                            <FormLabel className={'input-label'} >IBMid <Link className="forgot-link" href="#">Forgot ID?</Link></FormLabel>
                                                            <TextInput
                                                                ref={emailInput}
                                                                id="email"
                                                                className="login-form-input"
                                                                hideLabel={true}
                                                                invalid= {typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0}
                                                                labelText=""
                                                                invalidText={(errorNotification && errorNotification.title) ? errorNotification.title : ""}
                                                                placeholder="username@ibm.com"
                                                                disabled={loading ? true : false}
                                                                value={email}
                                                                onChange={e => { setEmail(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                                            />
                                                        </div>
                                                        
                                                    )
                                            }
                                            
                                            {
                                              !askForPassword ? 
                                              (<Checkbox 
                                                labelText={`Remember ID`} 
                                                id="checkbox-label-1"
                                            />)
                                              :
                                              (<div style={{'height': '1.5rem'}} ></div>)
                                            }
                                            
                                        
                                        </Stack>
                                    
                                </Theme>
                                
                            </Content>
                            <div className="fields-container bottom-link-container">
                              {loading ? 
                                  (
                                      <InlineLoading description={loadingSuccess ? 'Done!' : 'Please wait...'} className="submit-button-loading" status={loadingSuccess ? 'finished' : 'active'} />
                                  ) : 
                                  (
                                      <Button
                                          renderIcon={ArrowRight} 
                                          type="submit"
                                          iconDescription={submitText}
                                          size="xl"
                                          className="submit-button"
                                      >{submitText}</Button>
                                  )
                              }      
                            </div>
                            </Form>
                        </div>
                    </div>
                </div>
                
                <footer className="carbon-footer" role="contentinfo" aria-label="IBM">
                    <div className='footer-nav-container' >
                        
                        <ul className="horizontal ibm-padding-bottom-0 bx--legal-nav__holder">
                            <li>
                                <Link href='#' >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href='#' >
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href='#' >
                                    Terms Of Use
                                </Link>
                            </li>
                        </ul>
                    </div>
                </footer>
            </Theme>

  
    </>
  );
};

export default Signin;