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
import countries from './countries';



const Signup = () => {
  
  let navigate = useNavigate();
  const { authenticate, logout, getSession } = useContext(AccountContext);

  const [loading, setLoading] = useState(false);
  const [secLoading, setSecLoading] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [secLoadingSuccess, setSecLoadingSuccess] = useState(false);
  const [errorNotification, setErrorNotification] = useState({});
  const [activeStep, setActiveStep] = useState(1);
  
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("personal");
  const [password, setPassword] = useState("");
  const [passwordStorage, setPasswordStorage] = useState("");
  const [emailCode, setEmailCode] = useState("");

  const [username_ci, setUsername_ci] = useState("");
  const [fullName_ci, setFullName_ci] = useState("");
  const [country_ci, setCountry_ci] = useState("Albania");
  const [addressLine_ci, setAddressLine_ci] = useState("");
  const [addressLine2_ci, setAddressLine2_ci] = useState("");
  const [city_ci, setCity_ci] = useState("");
  const [postalCode_ci, setPostalCode_ci] = useState("");
  const [state_ci, setState_ci] = useState("");
  const [phoneNumber_ci, setPhoneNumber_ci] = useState("");

  const [organizationName_ti, setOrganizationName_ti] = useState("");
  const [taxNumber_ti, setTaxNumber_ti] = useState("");
  const [country_ti, setCountry_ti] = useState("Albania");

  const [cardNumber_cci, setCardNumber_cci] = useState("");
  const [expiryDate_cci, setExpiryDate_cci] = useState("");
  const [securityCode_cci, setSecurity_cci] = useState("");
  
  const emailInput = useRef(null);
  const accountTypeInput = useRef(null);
  const passwordInput = useRef(null);
  const emailCodeInput = useRef(null);

  const username_ciInput = useRef(null);
  const fullName_ciInput = useRef(null);
  const country_ciInput = useRef(null);
  const addressLine_ciInput = useRef(null);
  const addressLine2_ciInput = useRef(null);
  const city_ciInput = useRef(null);
  const postalCode_ciInput = useRef(null);
  const state_ciInput = useRef(null);
  const phoneNumber_ciInput = useRef(null);
  
  const organizationName_tiInput = useRef(null);
  const taxNumber_tiInput = useRef(null);
  const country_tiInput = useRef(null);

  const cardNumber_cciInput = useRef(null);
  const expiryDate_cciInput = useRef(null);
  const securityCode_cciInput = useRef(null);

  const generateRandomId = () => {
    var array = new Uint32Array(3);
    window.crypto.getRandomValues(array);
    return (new Date().valueOf().toString(36)+Array.from(array).map(A => A.toString(36)).join("")).replace(/\./g,"");  
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
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.trim() && password.trim()) {

      if (!password.match(/(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/)) {
        setErrorNotification({
          title: "Password does not meet minimum requirements.",
          subtitle: "Try again.",
        });
        return;
      }

      startLoading();
      const attributeList = [];
      attributeList.push(
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        })
      );
      UserPool.signUp(email, password.trim(), attributeList, null, (err, data) => {
        console.log(err);
        console.log(data);
        if (err && err.name.match(/UsernameExistsException/)) {
          //--- User exist
          authenticate(email, passwordStorage)
          .then(data => {
            stopLoading(() => {
              setErrorNotification({
                title: "User with same email already exists.",
                subtitle: "Try again.",
              });
              setPassword("");
              emailInput.current.focus();
            });
          })
          .catch(err => {
            if (err && err.name.match(/UserNotConfirmedException/)) {
              stopLoading(() => {
                setPassword("");
                setActiveStep(2);
                emailCodeInput.current.focus();
              });
            } else {
              stopLoading(() => {
                setErrorNotification({
                  title: "User with same email already exists.",
                  subtitle: "Try again.",
                });
                setPassword("");
                emailInput.current.focus();
              });
            }
          });
        } else if (err) {
          //--- generic error
          stopLoading(() => {
            setErrorNotification({
              title: err.message,
              subtitle: "Try again.",
            });
            setPassword("");
            emailInput.current.focus();
          });
        } else {
          //--- Success
          stopLoading(() => {
            setPassword("");
            setActiveStep(2);
            if (emailCodeInput.current) emailCodeInput.current.focus();
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
  
  const verifyEmailCodeAction = (e) => {
    e.preventDefault();
    if (emailCode) {
      startLoading();
      const cognitoUser = new CognitoUser({
        Username: email.trim(),
        Pool: UserPool
      });
      cognitoUser.confirmRegistration(emailCode.trim(), true, (err, result) => {
        if (err) {
          stopLoading(() => {
            setErrorNotification({
              title: "Invalid verification code.",
              subtitle: "Try again.",
            });
            emailCodeInput.current.focus();
          });
          console.log('error', err.message);
        } else {
          stopLoading(() => {
            setEmailCode("");
            setActiveStep(3);
            emailCodeInput.current.focus();
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
  
  const resendVerificationCode = () => {
    console.log("Resending verification code");
    startSecLoading();
    const cognitoUser = new CognitoUser({
      Username: email.trim(),
      Pool: UserPool
    });
    
    cognitoUser.resendConfirmationCode((err, res) => {
      if (err) {
        stopSecLoading(() => {
          setErrorNotification({
            title: err.message,
            subtitle: "Try again.",
          });
        });
        console.log(err);
      } else {
        stopSecLoading(() => {
          emailCodeInput.current.focus();
        });
        console.log(res);
      }
    });
  }
  
  const savePersonalInformation = (e) => {
    e.preventDefault();

    startLoading();
    if (!username_ci.trim() || !fullName_ci.trim() || !country_ci.trim() || !addressLine_ci.trim() || !city_ci.trim() || !postalCode_ci.trim() || !state_ci.trim() || !phoneNumber_ci.trim()) {
      
      stopLoading(() => {
        setErrorNotification({
          title: "Please fill all required inputs.",
          subtitle: "Try again.",
        });
      });
      return;
    }

    if (isNaN(postalCode_ci.trim())) {
      stopLoading(() => {
        setErrorNotification({
          title: "Postal code should be number.",
          subtitle: "Try again.",
        });
      });
      return;
    }

    stopLoading(() => {
      setEmailCode("");
      setActiveStep(4);
    });
    
  } 

  const saveTaxInformation = (e) => {
    e.preventDefault();
    
    startLoading();
    if (!organizationName_ti.trim() || !taxNumber_ti.trim() || !country_ti.trim()) {
      
      stopLoading(() => {
        setErrorNotification({
          title: "Please fill all inputs.",
          subtitle: "Try again.",
        });
      });
      return;
    }

    // authenticate('asad@byom.de', 'As@d1234')
    //       .then(data => {
            
    //       })
    //       .catch(err => {
    //         console.log(err);
    //       });

    insertUserDataIntoDB();
    
  } 

  const insertUserDataIntoDB = () => {
    getSession().then(({ accessToken, headers, user }) => {
      if (typeof accessToken !== 'string') {
        accessToken = accessToken.jwtToken
      }

      const uri = `https://n6vnntb0y9.execute-api.eu-central-1.amazonaws.com/Prod/account/signup`
      
      const dataUnit = {
        "username": username_ci,
        "full_name": fullName_ci,
        "country_ci": country_ci,
        "address_line": addressLine_ci,
        "address_line2": addressLine2_ci,
        "city": city_ci,
        "postal_code": postalCode_ci,
        "state": state_ci,
        "phone_number": phoneNumber_ci,
        "organization_name": organizationName_ti,
        "tax_number": taxNumber_ti,
        "country_ti": country_ti,
        "sub": user.username,
      };

      console.log('dataUnit: ', dataUnit);

      fetch(uri, {
        method:"post",
        headers,
        body: JSON.stringify(dataUnit),
      })
      .then(response => response.json())
      .then(data => {
        stopLoading(() => {
          console.log(data);
          if (data.error) {
            console.log(data.message);
            if (data.message.match(/Username already exists/)) {
              setActiveStep(3);
            }
            setErrorNotification({
              title: data.message,
              subtitle: "Try again.",
            });
          } else {
            setActiveStep(5);
          }
        });
      })
      .catch(console.error)
    })
  };

  const saveCreditCardInformation = (e) => {
    e.preventDefault();
    if (cardNumber_cci && expiryDate_cci && securityCode_cci) {
      startLoading();
      
      setTimeout(() => {
        stopLoading(() => {
          setActiveStep(7);
        });
      }, 500);
      

    } else {
      setErrorNotification({
        title: "Input error.",
        subtitle: "Try again.",
      });
    }
    
    
  } 
  
  const finishSignupProcess = () => {
    navigate("/");
  }
  
  return (
    <> 
    <Theme theme="g10" className={'theme-container'} >
    <Grid className={'signup-grid'} >
    <Column className={'right-column'} xlg={7} lg={7} md={8} sm={4} style={{ 'background': "url(signup-bg.svg) center 60% / 100% no-repeat rgb(249, 249, 249)" }} >
    <Content className='right-content'>
      <div className='signup-heading-text-wrapper' >
        <HeaderName prefix="" className='signup-heading-text'>
          Create your 
        </HeaderName>
        <HeaderName prefix="BYNAR" className='signup-heading-text'>
          account
        </HeaderName>
      </div>
    
    </Content>
    </Column>
    <Column className={'left-column'} xlg={9} lg={9} md={8} sm={12}>
    <Content className={'signup-container'} >
    <Theme theme="white">
    
    <div className='heading-container' >
    <div className="login-link" style={{'marginBottom':'1.5rem'}}>Already have an BYNAR account? <Link href="/signin">Log in</Link></div>
    <Heading>Sign Up</Heading>
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
          label="Account Information"
          description="Step 1:"
          onClick={() => setActiveStep(1)}
          />
          <ProgressStep
          complete={activeStep > 2}
          current={activeStep == 2}
          label="Verify E-mail"
          description="Step 2:"
          />
          <ProgressStep
          complete={activeStep > 3}
          current={activeStep == 3}
          label="Personal Information"
          description="Step 3:"
          />
          <ProgressStep
          complete={activeStep > 4}
          current={activeStep == 4}
          label="Tax Information"
          description="Step 4:"
          />
          <ProgressStep
          complete={activeStep > 5}
          current={activeStep == 5}
          label="Credit Card Information"
          description="Step 5:"
          />
          <ProgressStep
          complete={activeStep > 6}
          current={activeStep == 6}
          label="Account Notice"
          description="Step 6:"
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
            
            <TextInput.PasswordInput
            ref={passwordInput}
            id="password"
            invalidText="Invalid error message."
            labelText="Password"
            placeholder=""
            disabled={loading ? true : false}
            value={password}
            onChange={e => { setPassword(e.target.value); setPasswordStorage(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
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
                  <Form onSubmit={verifyEmailCodeAction}>
                  <Stack orientation={'vertical'} gap={5}>
                  
                  <TextInput
                  ref={emailCodeInput}
                  id="email-code"
                  labelText="Verification code"
                  invalidText=""
                  placeholder=""
                  disabled={loading ? true : false}
                  value={emailCode}
                  onChange={e => { setEmailCode(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
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
                        iconDescription="Verify Code"
                        >Verify Code</Button>
                        )
                      }
                      {secLoading ? 
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
                          }
                          
                          </Row>
                          
                          </Stack>
                          </Form>
                          </div>
                          );
                          break;
                          
                          case 3:
                          return (
                            <div className='signupStep-personalInformation' >
                            <h1 style={{paddingBottom: '20px'}} >Personal Information</h1>
                            <Form onSubmit={savePersonalInformation}>
                            
                            <Stack orientation={'vertical'} gap={5}>
                            
                            <TextInput
                            ref={username_ciInput}
                            id="username-ci"
                            labelText="Username*"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={username_ci}
                            onChange={e => { setUsername_ci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />

                            <TextInput
                              ref={fullName_ciInput}
                              id="fullname-ci"
                              labelText="Fullname*"
                              invalidText=""
                              placeholder=""
                              disabled={loading ? true : false}
                              value={fullName_ci}
                              onChange={e => { setFullName_ci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />

                            <Select 
                              ref={country_ciInput}
                              id='country-ci'
                              labelText='Country or region of residence*'
                              onChange={e => setCountry_ci(e.target.value)}
                              >
                              {countries.map((countryObject, countryIndex) => (<SelectItem
                                text={countryObject.name}
                                value={countryObject.name}
                                key={countryIndex}
                                />))}
                                
                            </Select>
                            
                            <TextInput
                            ref={addressLine_ciInput}
                            id="addressLine-ci"
                            labelText="Address Line*"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={addressLine_ci}
                            onChange={e => { setAddressLine_ci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />

                          <TextInput
                            ref={addressLine2_ciInput}
                            id="addressLine2-ci"
                            labelText="Address Line 2"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={addressLine2_ci}
                            onChange={e => { setAddressLine2_ci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />

                          <TextInput
                            ref={city_ciInput}
                            id="city-ci"
                            labelText="City*"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={city_ci}
                            onChange={e => { setCity_ci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />

                          <TextInput
                            ref={postalCode_ciInput}
                            id="postalCode-ci"
                            labelText="Postal Code*"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={postalCode_ci}
                            onChange={e => { setPostalCode_ci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />

                          <TextInput
                            ref={state_ciInput}
                            id="state-ci"
                            labelText="State, Province, or Region*"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={state_ci}
                            onChange={e => { setState_ci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />
                            
                            <TextInput
                            ref={phoneNumber_ciInput}
                            id="phoneNumnber-ci"
                            labelText="Phone Number*"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={phoneNumber_ci}
                            onChange={e => { setPhoneNumber_ci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />


                            {/* <RadioButtonGroup
                            name="account-type" 
                            id="account-type" 
                            legendText="Account Type"
                            ref={accountTypeInput}
                            defaultSelected={accountType}
                            value={accountType}
                            onChange={value => { setAccountType(value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            >
                              <RadioButton
                              value="personal"
                              labelText="Personal"
                              />
                              <RadioButton 
                              value="company"
                              labelText="Company"
                              />
                            </RadioButtonGroup> */}
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
                                );
                                break;
                                        
                          case 4:
                          return (
                            <div className='signupStep-taxInformation' >
                            <h1 style={{paddingBottom: '20px'}} >Tax Information</h1>
                            <Form onSubmit={saveTaxInformation}>
              
                            <Stack orientation={'vertical'} gap={5}>
                            
                            <TextInput
                            ref={organizationName_tiInput}
                            id="organization-name-ti"
                            labelText="Organization Name*"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={organizationName_ti}
                            onChange={e => { setOrganizationName_ti(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />
                            
                            <TextInput
                            ref={taxNumber_tiInput}
                            id="tax-number-ti"
                            labelText="VAT/GST/Tax Number*"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={taxNumber_ti}
                            onChange={e => { setTaxNumber_ti(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />

                          <Select 
                            ref={country_tiInput}
                            id='country-ti'
                            labelText='Country*'
                            onChange={e => setCountry_ti(e.target.value)}
                            >
                            {countries.map((countryObject, countryIndex) => (<SelectItem
                              text={countryObject.name}
                              value={countryObject.name}
                              key={countryIndex}
                              />))}
                              
                          </Select>
                            
                            
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
                            );
                            break;
                            
                            case 5:
                            return (
                              <div className='signupStep-creditCardInformation' >
                              <h1 style={{paddingBottom: '20px'}} >Credit Card Information</h1>
                              <Form onSubmit={saveCreditCardInformation}>
              
                              <Stack orientation={'vertical'} gap={5}>
                              
                              <TextInput
                              ref={cardNumber_cciInput}
                              id="card-number-cci"
                              labelText="Card Number"
                              invalidText=""
                              placeholder=""
                              disabled={loading ? true : false}
                              value={cardNumber_cci}
                              onChange={e => { setCardNumber_cci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                              />
                              
                              <TextInput
                              ref={expiryDate_cciInput}
                              id="expiry-date-cci"
                              labelText="Expiry Date"
                              invalidText=""
                              placeholder=""
                              disabled={loading ? true : false}
                              value={expiryDate_cci}
                              onChange={e => { setExpiryDate_cci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                              />
                              
                              <TextInput
                              ref={securityCode_cciInput}
                              id="security-code-cci"
                              labelText="Security Code"
                              invalidText=""
                              placeholder=""
                              disabled={loading ? true : false}
                              value={securityCode_cci}
                              onChange={e => { setSecurity_cci(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
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
                              );
                              break;
                              
                              case 6:
                              return (
                                <div className='signupStep-accountNotice' >
                                <h1 style={{paddingBottom: '20px'}} >Account Notice</h1>
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
      
                                          
                                          <hr/>
                                          <Button
                                          renderIcon={ArrowRight} 
                                          type="submit"
                                          iconDescription="Continue"
                                          style={{ margin: '15px', width: '100%' }}
                                          disabled={activeStep != 7}
                                          onClick={finishSignupProcess}
                                          >Continue</Button>
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
                                        
                                        export default Signup;