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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountType, setAccountType] = useState("personal");
  const [password, setPassword] = useState("");
  const [passwordStorage, setPasswordStorage] = useState("");
  const [emailCode, setEmailCode] = useState("");
  
  const [fullName_bi, setFullName_bi] = useState("");
  const [country_bi, setCountry_bi] = useState(countries[0].code);
  const [address_bi, setAddress_bi] = useState("");
  const [address2_bi, setAddress2_bi] = useState("");
  const [city_bi, setCity_bi] = useState("");
  const [postalCode_bi, setPostalCode_bi] = useState("");
  const [state_bi, setState_bi] = useState("");
  const [phoneNumber_bi, setPhoneNumber_bi] = useState("");

  const [organizationName_ti, setOrganizationName_ti] = useState("");
  const [taxNumber_ti, setTaxNumber_ti] = useState("");

  const [cardNumber_cci, setCardNumber_cci] = useState("");
  const [expiryDate_cci, setExpiryDate_cci] = useState("");
  const [securityCode_cci, setSecurity_cci] = useState("");
  
  const emailInput = useRef(null);
  const firstNameInput = useRef(null);
  const lastNameInput = useRef(null);
  const accountTypeInput = useRef(null);
  const passwordInput = useRef(null);
  const emailCodeInput = useRef(null);
  
  const fullName_biInput = useRef(null);
  const country_biInput = useRef(null);
  const address_biInput = useRef(null);
  const address2Input = useRef(null);
  const city_biInput = useRef(null);
  const postalCode_biInput = useRef(null);
  const state_biInput = useRef(null);
  const phoneNumber_biInput = useRef(null);
  
  const organizationName_tiInput = useRef(null);
  const taxNumber_tiInput = useRef(null);

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
      startLoading();
      UserPool.signUp(email.trim(), password.trim(), [], null, (err, data) => {
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
    if (firstName && lastName && phoneNumber) {
      
      startLoading();
      authenticate(email, passwordStorage)
      .then(data => {
        var cognitoUser = UserPool.getCurrentUser();
        
        cognitoUser.getSession((err, res) => {
          const fullNameAttr = new CognitoUserAttribute({
            Name: "name",
            Value: (firstName + ' ' + lastName).trim()
          });
          
          const phoneNumberAttr = new CognitoUserAttribute({
            Name: "phone_number",
            Value: phoneNumber,
          });

          const accountIdAttr = new CognitoUserAttribute({
            Name: "custom:account_id",
            Value: generateRandomId(),
          });

          const tenantIdAttr = new CognitoUserAttribute({
            Name: "custom:tenant_id",
            Value: generateRandomId(),
          });

          const accountTypeAttr = new CognitoUserAttribute({
            Name: "custom:account_type",
            Value: accountType,
          });

          const roleAttr = new CognitoUserAttribute({
            Name: "custom:role",
            Value: 'Root',
          });
          
          cognitoUser.updateAttributes([fullNameAttr, phoneNumberAttr, accountIdAttr, tenantIdAttr, accountTypeAttr, roleAttr], function(err, res) {
            console.log('err: ', err);
            console.log('res: ', res);
            if (err) {
              stopLoading(() => {
                setErrorNotification({
                  title: err.message,
                  subtitle: "Try again.",
                });
                firstNameInput.current.focus();
              });
            } else {
              stopLoading(() => {
                setActiveStep(4);
                setTimeout(() => fullName_biInput.current.focus());
              });
              
            }
          });
        });
        
      })
      .catch(err => {
        stopLoading(() => {
          setErrorNotification({
            title: err.message,
            subtitle: "Try again.",
          });
          firstNameInput.current.focus();
        });
      });
    } else {
      setErrorNotification({
        title: "Please fill all inputs.",
        subtitle: "Try again.",
      });
    }
    
    
  } 

  const saveBillingInformation = (e) => {
    e.preventDefault();
    if (fullName_bi && country_bi && address_bi && address2_bi && city_bi && postalCode_bi && !isNaN(postalCode_bi) && state_bi && phoneNumber_bi) {
      startLoading();
      
      setTimeout(() => {
        stopLoading(() => {
          setActiveStep(5);
          setTimeout(() => organizationName_tiInput.current.focus());
        });
      }, 500);
      

    } else {
      setErrorNotification({
        title: "Input error.",
        subtitle: "Try again.",
      });
    }
    
    
  } 

  const saveTaxInformation = (e) => {
    e.preventDefault();
    if (fullName_bi && country_bi && address_bi && address2_bi && city_bi && postalCode_bi && !isNaN(postalCode_bi) && state_bi && phoneNumber_bi && organizationName_ti && taxNumber_ti) {
      startLoading();

      setTimeout(() => {
        stopLoading(() => {
          setActiveStep(6);
          setTimeout(() => cardNumber_cciInput.current.focus());
        });
      }, 500);
      return;
      authenticate(email, passwordStorage).then(data => {
        getSession().then(({ user, accessToken, headers, attributes }) => {
  
          console.log(attributes);
          var dataObject = {
            "account_id": attributes['custom:account_id'],
            "company_id": attributes['custom:tenant_id'],
            "full_name": fullName_bi,
            "country": country_bi,
            "address": address2_bi,
            "address_2": address2_bi,
            "city": city_bi,
            "postal_code": postalCode_bi,
            "state": state_bi,
            "phone": phoneNumber_bi,
            "organizaton_name": organizationName_ti,
            "vat_number": taxNumber_ti
          };
          const uri = `https://bb990eda7j.execute-api.eu-central-1.amazonaws.com/dev`
    
          fetch(uri, {
            method: 'POST',
            headers,
            body: JSON.stringify(dataObject),
          })
            .then((data) => data.json())
            .then((response) => {
              console.log(response);
              stopLoading(() => {
                setActiveStep(6);
                setTimeout(() => cardNumber_cciInput.current.focus());
              });
            })
            .catch((error) => {
              setErrorNotification({
                title: "Unable to save tax information.",
                subtitle: "Try again.",
              });
            })
          });
      })
      

    } else {
      setErrorNotification({
        title: "Input error.",
        subtitle: "Try again.",
      });
    }
    
  } 

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
    <Column className={'left-column'} xlg={9} lg={9} md={8} sm={16}>
    <Content className={'signup-container'} >
    <Theme theme="white">
    
    <div className='heading-container' >
    <div className="login-link" style={{'marginBottom':'1.5rem'}}>Already have an IBM account? <Link href="/signin">Log in</Link></div>
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
      <Grid>
        <Row className="signup-grid-row" >
        <Column xlg={3} lg={3} md={2} sm={6} >
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
          label="Billing Information"
          description="Step 4:"
          />
          <ProgressStep
          complete={activeStep > 5}
          current={activeStep == 5}
          label="Tax Information"
          description="Step 5:"
          />
          <ProgressStep
          complete={activeStep > 6}
          current={activeStep == 6}
          label="Credit Card Information"
          description="Step 6:"
          />
          <ProgressStep
          complete={activeStep > 7}
          current={activeStep == 7}
          label="Account Notice"
          description="Step 7:"
          />
          </ProgressIndicator>
          </div>
        </Column>
        <Column xlg={6} lg={6} md={6} sm={10} >
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
                            ref={firstNameInput}
                            id="first-name"
                            labelText="First name"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={firstName}
                            onChange={e => { setFirstName(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />
                            
                            <TextInput
                            ref={lastNameInput}
                            id="last-name"
                            labelText="Last name"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={lastName}
                            onChange={e => { setLastName(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />
                            
                            <TextInput
                            ref={lastNameInput}
                            id="phone-number"
                            labelText="Phone Number"
                            invalidText=""
                            placeholder=""
                            disabled={loading ? true : false}
                            value={phoneNumber}
                            onChange={e => { setPhoneNumber(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                            />


                            <RadioButtonGroup
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
                            </RadioButtonGroup>
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
                                  <div className='signupStep-billingInformation' >
                                  <h1 style={{paddingBottom: '20px'}} >Billing Information</h1>
                                  <Form onSubmit={saveBillingInformation}>
                                  
                                  <Stack orientation={'vertical'} gap={5}>
                                  
                                  <TextInput
                                  ref={fullName_biInput}
                                  id="first-name-bi"
                                  labelText="First name"
                                  invalidText=""
                                  placeholder=""
                                  disabled={loading ? true : false}
                                  value={fullName_bi}
                                  onChange={e => { setFullName_bi(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                  />
                                  
                                  <Select 
                                  ref={country_biInput}
                                  id='country-bi'
                                  labelText='Country or region of residence'
                                  onChange={e => setCountry_bi(e.target.value)}
                                  >
                                  {countries.map((countryObject, countryIndex) => (<SelectItem
                                    text={countryObject.name}
                                    value={countryObject.name}
                                    key={countryIndex}
                                    />))}
                                    
                                    </Select>
                                    
                                    <TextInput
                                    ref={address_biInput}
                                    id="address-bi"
                                    labelText="Address"
                                    invalidText=""
                                    placeholder=""
                                    disabled={loading ? true : false}
                                    value={address_bi}
                                    onChange={e => { setAddress_bi(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                    />
                                    
                                    <TextInput
                                    ref={address2Input}
                                    id="address2-bi"
                                    labelText="Address 2"
                                    invalidText=""
                                    placeholder=""
                                    disabled={loading ? true : false}
                                    value={address2_bi}
                                    onChange={e => { setAddress2_bi(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                    />
                                    
                                    <TextInput
                                    ref={city_biInput}
                                    id="city-bi"
                                    labelText="City"
                                    invalidText=""
                                    placeholder=""
                                    disabled={loading ? true : false}
                                    value={city_bi}
                                    onChange={e => { setCity_bi(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                    />
                                    
                                    <TextInput
                                    ref={postalCode_biInput}
                                    id="postal-code-bi"
                                    labelText="Postal Code"
                                    invalidText=""
                                    placeholder=""
                                    disabled={loading ? true : false}
                                    value={postalCode_bi}
                                    onChange={e => { setPostalCode_bi(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                    />
                                    
                                    <TextInput
                                    ref={state_biInput}
                                    id="state-bi"
                                    labelText="State / Province / Region"
                                    invalidText=""
                                    placeholder=""
                                    disabled={loading ? true : false}
                                    value={state_bi}
                                    onChange={e => { setState_bi(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                    />
                                    
                                    <TextInput
                                    ref={phoneNumber_biInput}
                                    id="phone-number-bi"
                                    labelText="Phone Number"
                                    invalidText=""
                                    placeholder=""
                                    disabled={loading ? true : false}
                                    value={phoneNumber_bi}
                                    onChange={e => { setPhoneNumber_bi(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
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
                                        
                                        case 5:
                                        return (
                                          <div className='signupStep-taxInformation' >
                                          <h1 style={{paddingBottom: '20px'}} >Tax Information</h1>
                                          <Form onSubmit={saveTaxInformation}>
                            
                                          <Stack orientation={'vertical'} gap={5}>
                                          
                                          <TextInput
                                          ref={organizationName_tiInput}
                                          id="organization-name-ti"
                                          labelText="Organization Name"
                                          invalidText=""
                                          placeholder=""
                                          disabled={loading ? true : false}
                                          value={organizationName_ti}
                                          onChange={e => { setOrganizationName_ti(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
                                          />
                                          
                                          <TextInput
                                          ref={taxNumber_tiInput}
                                          id="tax-number-ti"
                                          labelText="Tax Number"
                                          invalidText=""
                                          placeholder=""
                                          disabled={loading ? true : false}
                                          value={taxNumber_ti}
                                          onChange={e => { setTaxNumber_ti(e.target.value); if (typeof errorNotification == 'object'  && Object.keys(errorNotification).length !== 0) setErrorNotification({}); }}
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
                                            
                                            case 7:
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
    <Column className={'right-column'} lg={7} md={8} sm={0}>
    <Content className='right-content' >
    <h1>Create your account</h1>
    </Content>
    </Column>
    
                                          </Grid>
                                          
                                          
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
                                        
                                        export default Signup;