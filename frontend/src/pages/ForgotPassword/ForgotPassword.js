import React, { useState, useRef, useContext } from 'react';
import {
  Theme,
  Content,
  Form,
  FormGroup,
  Stack,
  TextInput,
  Button,
  Heading,
  InlineLoading,
  Link,
  Row,
  FormLabel,
} from '@carbon/react';

import { ArrowRight, ArrowLeft } from '@carbon/react/icons';
import { useNavigate } from "react-router-dom";
import { CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js'
import UserPool from "../../UserPool";
import { AccountContext } from '../../components/Accounts';



const ForgotPassword = () => {
  
  let navigate = useNavigate();
  const { authenticate, logout, getSession } = useContext(AccountContext);

  const [loading, setLoading] = useState(false);
  const [secLoading, setSecLoading] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [secLoadingSuccess, setSecLoadingSuccess] = useState(false);
  const [errorNotification, setErrorNotification] = useState({});
  const [errorNotification1, setErrorNotification1] = useState({});
  const [activeStep, setActiveStep] = useState(1);
  
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  
  const emailInput = useRef(null);
  const verificationCodeInput = useRef(null);
  const passwordInput = useRef(null);

  
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
  
  const startSecLoading = () => {
    setSecLoading(true);
  }
  
  const stopSecLoading = (callback) => {
    setSecLoadingSuccess(true);
    setTimeout(() => {
      setSecLoadingSuccess(false);
      setSecLoading(false);
      callback();
    }, 500);
  }

  const getUser = () => {
    return new CognitoUser({ Username: email.toLowerCase(), Pool: UserPool })
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (activeStep == 1) {
      requestVerificationCode();
    } else if (activeStep == 2){
      if (!verificationCode || !password) {
        if (!verificationCode) {
          setErrorNotification({
            title: "Please insert verification code",
            subtitle: "Try again.",
          });
        }
        if (!password) {
          setErrorNotification1({
            title: "Password cannot be empty",
            subtitle: "Try again.",
          });
        }
        return;
      }
      if (!password.match(/(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/)) {
        setErrorNotification1({
          title: "Password does not meet minimum requirements.",
          subtitle: "Try again.",
        });
        return;
      }
      verifyCodeAction();
    }
  }

  const requestVerificationCode = () => {
    if (email.trim()) {

      startLoading();
      getUser().forgotPassword({
        onSuccess: data => {
          console.log(data);
          stopLoading(() => {
            setActiveStep(2);
          });
        },
        onFailure: err => {
          console.log(err);
          stopLoading(() => {
            setErrorNotification({
              title: err,
              subtitle: "Try again.",
            });
          });
        },
        inputVerificationCode: data => {
          console.log(data);
          stopLoading(() => {
            setActiveStep(2);
          });
        }
      });
    } else {
      setErrorNotification({
        title: "Email cannot be empty",
        subtitle: "Try again.",
      });
    }
  }
  
  const verifyCodeAction = () => {
    if (verificationCode) {
      startLoading();
      getUser().confirmPassword(verificationCode, password, {
        onSuccess: data => {
          stopLoading(() => {
            navigate("/");
          });
        },
        onFailure: err => {
          stopLoading(() => {
            setErrorNotification({
              title: 'Verification code mismatch',
              subtitle: "Try again.",
            });
          });
        }
      });
    } else {
      setErrorNotification({
        title: "Please fill all inputs.",
        subtitle: "Try again.",
      });
    }
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
                                  <Heading>Forgot password</Heading>
                                </div>
                                    {(() => {
                                      switch (activeStep) {
                                        case 1:
                                          return(
                                            <div className='login-input-wrapper' >
                                              <p>Enter your E-Mail to reset your password.</p>
                                            <TextInput
                                              ref={emailInput}
                                              id="email"
                                              labelText="E-mail"
                                              invalid= {typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0}
                                              invalidText={(errorNotification && errorNotification.title) ? errorNotification.title : ""}
                                              className="login-form-input"
                                              placeholder=""
                                              disabled={loading ? true : false}
                                              value={email}
                                              onChange={e => { setEmail(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                              />
                                              
                                            </div>
                                          );
                                          break;
                                        case 2:
                                          return (
                                            <div className='login-input-wrapper' >
                                              <p>If there is an account associated with {email}, you will receive an email with a 6-digit temporary code.</p>
                                            <TextInput
                                          ref={verificationCodeInput}
                                          id="verification-code"
                                          labelText="Verification code"
                                          className="login-form-input"
                                          invalid= {typeof errorNotification == 'object' && Object.keys(errorNotification).length !== 0}
                                          invalidText={(errorNotification && errorNotification.title) ? errorNotification.title : ""}
                                          placeholder=""
                                          disabled={loading ? true : false}
                                          value={verificationCode}
                                          onChange={e => { setVerificationCode(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                          />
                                    
                                          <TextInput.PasswordInput
                                          ref={passwordInput}
                                          id="password"
                                          invalid= {typeof errorNotification1 == 'object' && Object.keys(errorNotification1).length !== 0}
                                          invalidText={(errorNotification1 && errorNotification1.title) ? errorNotification1.title : ""}
                                          className="login-form-input"
                                          labelText="Password"
                                          placeholder=""
                                          disabled={loading ? true : false}
                                          value={password}
                                          onChange={e => { setPassword(e.target.value); if (typeof errorNotification1 == 'object'  && Object.keys(errorNotification1).length !== 0) setErrorNotification1({}); }}
                                          />
                                          
                                            </div>
                                          );
                                          break;
                                      
                                        default:
                                          break;
                                      }
                                    })()}
                                        
                                        
                                    
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
                                  iconDescription="Next"
                                  size="xl"
                                  className="submit-button"
                                  >{activeStep == 1 ? "Next" : "Submit"}</Button>
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
                                        
                                        export default ForgotPassword;