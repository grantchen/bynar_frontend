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
  InlineNotification,
  Grid,
  Column,
  Row,
  ProgressIndicator,
  ProgressStep,
  Select,
  SelectItem,
  RadioButtonGroup,
  RadioButton,
  FlexGrid,
  HeaderName,
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
    if (email.trim()) {

      startLoading();
      getUser().forgotPassword({
        onSuccess: data => {
          stopLoading(() => {
            setActiveStep(2);
          });
        },
        onFailure: err => {
          stopLoading(() => {
            setErrorNotification({
              title: err,
              subtitle: "Try again.",
            });
          });
        },
        inputVerificationCode: data => {
          stopLoading(() => {
            setActiveStep(2);
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
  
  const verifyCodeAction = (e) => {
    e.preventDefault();
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
              title: err,
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
    <Grid className={'signup-grid'} >
    <Column className={'right-column'} xlg={7} lg={7} md={8} sm={4} style={{ 'background': "url(signup-bg.svg) center 60% / 100% no-repeat rgb(249, 249, 249)" }} >
    <Content className='right-content'>
      <div className='signup-heading-text-wrapper' >
        <HeaderName prefix="" className='signup-heading-text'>
          Recover your 
        </HeaderName>
        <HeaderName prefix="BYNAR" className='signup-heading-text'>
          account password
        </HeaderName>
      </div>
    
    </Content>
    </Column>
    <Column className={'left-column'} xlg={9} lg={9} md={8} sm={12}>
    <Content className={'signup-container'} >
    <Theme theme="white">
    
    <div className='heading-container' >
    <div className="login-link" style={{'marginBottom':'1.5rem'}}>Already have an BYNAR account? <Link href="/signin">Log in</Link></div>
    <Heading>Forgot password</Heading>
    </div>
    {(() => {
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
      })()}
      <Grid className='signup-form-grid' >
        <Row className="signup-grid-row" >
        <Column className='progress-bar-column' xlg={3} lg={3} md={2} sm={8} >
          <div className='progress-container' >
          <ProgressIndicator vertical={true} currentIndex={activeStep - 1}>
          <ProgressStep
          complete={activeStep > 1}
          current={activeStep == 1}
          label="Account Email"
          description="Step 1:"
          onClick={() => setActiveStep(1)}
          />
          <ProgressStep
          complete={activeStep > 2}
          current={activeStep == 2}
          label="Change password"
          description="Step 2:"
          />
          </ProgressIndicator>
          </div>
        </Column>
        <Column className='signup-form-column' xlg={6} lg={6} md={6} sm={10} >
        <div className='signupStepsWrapper' >
      {(() => {
        switch (activeStep) {
          case 1:
          return (
            <div className='signupStep-accountInformation' >
            <div className='account-information-container' >
            <h1 style={{paddingBottom: '20px'}} >Account Information</h1>
            <Form onSubmit={handleSubmit}>
            
            <Stack orientation={'vertical'} gap={5}>
            
            <TextInput
            ref={emailInput}
            id="email"
            labelText="E-mail"
            invalidText="Email does not exist"
            placeholder=""
            disabled={loading ? true : false}
            value={email}
            onChange={e => { setEmail(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
            />
            
            {loading ? 
              (
                <InlineLoading description={loadingSuccess ? 'Done!' : 'Please wait...'} status={loadingSuccess ? 'finished' : 'active'} />
                ) : 
                (
                  <Button
                  renderIcon={ArrowRight} 
                  type="submit"
                  iconDescription="Next"
                  >Next</Button>
                  )
                }
                
                </Stack>
                </Form>
                </div>
                </div>
                );
                break;
                
                case 2:
                return (
                  <div className='signupStep-verifyEmail' >
                  <h1 style={{paddingBottom: '20px'}} >Verify E-mail</h1>
                  <Form onSubmit={verifyCodeAction}>
                  <Stack orientation={'vertical'} gap={5}>

                  <TextInput
                  ref={verificationCodeInput}
                  id="verification-code"
                  labelText="Verification code"
                  invalidText=""
                  placeholder=""
                  disabled={loading ? true : false}
                  value={verificationCode}
                  onChange={e => { setVerificationCode(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                  />
            
                  <TextInput.PasswordInput
                  ref={passwordInput}
                  id="password"
                  invalidText="Invalid error message."
                  labelText="Password"
                  placeholder=""
                  disabled={loading ? true : false}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                  />
                  
                  <Row style={{display: 'flex'}} >
                  {loading ? 
                    (
                      <InlineLoading style={{width: 'fit-content'}} description={loadingSuccess ? 'Done!' : 'Verifying code...'} status={loadingSuccess ? 'finished' : 'active'} />
                      ) : 
                      (
                        <Button
                        renderIcon={ArrowRight} 
                        type="submit"
                        iconDescription="Change password"
                        >Verify Code</Button>
                        )
                      }
                      {/* {secLoading ? 
                        (
                          <InlineLoading style={{marginLeft: '10px'}} description={secLoadingSuccess ? 'Done!' : 'Sending email...'} status={secLoadingSuccess ? 'finished' : 'active'} />
                          ) : 
                          (
                            <Button 
                            kind="ghost"
                            onClick={resendVerificationCode}
                            style={{marginLeft: '10px'}}
                            >Resend Code</Button>
                            )
                          } */}
                          
                          </Row>
                          
                          </Stack>
                          </Form>
                          </div>
                          );
                          break;

                          default:
                          break;
                              }
                              
                            })()}
                            </div>
        </Column>
        </Row>
      </Grid>
      
                                          
                                          {/* <hr/>
                                          <Button
                                          renderIcon={ArrowRight} 
                                          type="submit"
                                          iconDescription="Continue"
                                          style={{ margin: '15px', width: '100%' }}
                                          disabled={activeStep != 7}
                                          onClick={finishSignupProcess}
                                          >Continue</Button> */}
                                          <div style={{height: '30px'}} ></div>
                                          </Theme>
                                          </Content>
                                          </Column>
                                          </Grid>
                                          
                                          
                                          <footer className="carbon-footer" role="contentinfo" aria-label="BYNAR">
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