
import { SidePanel } from '@carbon/ibm-products';
import { Button, TextInput } from 'carbon-components-react';
import './SidePanel.scss'
import { AddUser } from '../../pages/AddUser/AddUser';
import countrylist from "../../data/countrylist";
import { useState, useRef, useContext, useEffect } from "react";
import {
    PasswordInput, Select,
    SelectItem
} from 'carbon-components-react';
import 'react-telephone-input/css/default.css'
import { BaseURL } from "../../sdk/constant";
import PhoneInput from 'react-phone-input-2'
// import './AddUser.scss';
import { useLocation, useNavigate ,useSearchParams} from "react-router-dom";
import { Loader } from "../../Components/Loader/Loader";
import { AuthContext } from "../../sdk/context/AuthContext";
export const SidePanels = () => {
    const [open, setOpen] = useState(true);
    const [accountInfoErrors, setAccountInfoErrors] = useState({
        userName: false,
        password: false,
        fullName: false,
        addressLine1: false,
        city: false,
        state: false,
        postalCode: false,
        phoneNumber: false,
    })
    const navigate = useNavigate();
    const authContext = useContext(AuthContext)
    const token = localStorage.getItem('token');
    const [country, setCountry] = useState("India");
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorNotification, setErrorNotification] = useState({});
    const [emailErrorNotification, setEmailErrorNotification] = useState({});
    const [addressErrorNotification, setAddressErrorNotification] = useState({});
    const [passwordErrorNotification, setPasswordErrorNotification] = useState({});
    const [cityErrorNotification, setCityErrorNotification] = useState({});
    const [stateErrorNotification, setStateErrorNotification] = useState({});
    const [postalCodeErrorNotification, setPostalCodeErrorNotification] = useState({});
    const [loading, setLoading] = useState(false);
    const emailInput = useRef(null);
    const fullNameInput = useRef(null);
    const passwordInput = useRef(null);
    const [errorMessage, setErrorMessage] = useState('')
    const [phoneNumberValid, setIsPhoneNumberValid] = useState(true)
    const [errors, setErrors] = useState({});
    const inputRefs = useRef([]);
    const [searchParams] = useSearchParams();
    const [userId,setUserId] = useState(0);


    const checkEmailValid = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    const validatePassword=(value)=>{

        if (value.trim().length === 0) {
            setPasswordErrorNotification({ title: 'Password should not be blank' })
            passwordInput.current.focus();
        }
        else {
            const uppercaseRegex = /[A-Z]/;
            const lowercaseRegex = /[a-z]/;
            const numberRegex = /[0-9]/;
            const specialcharacterRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
            if (value.trim().length >= 8 && uppercaseRegex.test(value) && lowercaseRegex.test(value) && numberRegex.test(value) && specialcharacterRegex.test(value)) {
                setPasswordErrorNotification({})
            }
            else {
                setPasswordErrorNotification({ title: 'Password should contain at least 8 character,one number,one lowercase,one uppercase' })
                passwordInput.current.focus();
            }
        }

    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value)
    }

    const validateEmail = (email) => {
        const errors = {};
        if (email.trim() === '') {
            errors.userName = 'Email is required';
        } else if (email.length > 0) {
            if (!checkEmailValid(email.trim())) {
                errors.userName = 'Suggested format (name@company.com)';
            }
        }

        return errors;
    };
    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setUserName(value)
        const errors = validateEmail(value);
        setErrors(errors);
        // setAccountInfoErrors({ ...accountInfoErrors, [name]: !validateEmail() })
        // console.log(validateEmail(), { ...accountInfoErrors, [name]: validateEmail() })
    }


    const handleFullName = (e) => {
        const { name, value } = e.target;
        setFullName(value)
        setAccountInfoErrors({ ...accountInfoErrors, [name]: value.trim().length == 0 })
    }

    const handleAddressLine1 = (e) => {
        const { name, value } = e.target;
        setAddressLine1(value)
        setAccountInfoErrors({ ...accountInfoErrors, [name]: value.trim().length == 0 })
    }

    const handleCity = (e) => {
        const { name, value } = e.target;
        setCity(value)
        setAccountInfoErrors({ ...accountInfoErrors, [name]: value.trim().length == 0 })
    }

    const handleState = (e) => {
        const { name, value } = e.target;
        setState(value)
        setAccountInfoErrors({ ...accountInfoErrors, [name]: value.trim().length == 0 })
    }

    const validatePhoneNumber = (value, country) => {

        if (value.length == 0) {
            setErrorMessage("Phone number is required")
            setIsPhoneNumberValid(false)
        }
        else {
            setErrorMessage(" ")
            setIsPhoneNumberValid(true)
        }
    }
    const handlePhoneNumber = (value, country, formattedValue) => {
        setPhoneNumber(value)
        validatePhoneNumber(value, country);
    }



    const postalCodeValidation = (value) => {
        if (value.length === 0) {
            setPostalCodeErrorNotification({ title: 'Postal code is required' });
        }
        else if (!/^\d+$/.test(value)) {
            setPostalCodeErrorNotification({ title: 'Postal code should be integer' });
        }
        else {
            setPostalCodeErrorNotification({});
        }
    }

    /* Function to handle postal code change and also check validations for postal code */
    const handlePostalCode = (e) => {
        setPostalCode(e.target.value.trim());
        postalCodeValidation(e.target.value.trim());

    }

    const handleAccountInformationFormSubmit = () => {
        // debugger;
        const error = {}
        postalCodeValidation(postalCode)
        error.fullName = fullName.trim().length == 0;
        error.addressLine1 = addressLine1.trim().length == 0;
        error.city = city.trim().length == 0;
        error.fullName = fullName.trim().length == 0;
        error.state = state.trim().length == 0;
        error.phoneNumber = phoneNumber.length == 0;
        // error.userName = !validateEmail();
        setErrors(validateEmail(userName.trim()))
        setAccountInfoErrors(error)
        validatePassword(password)
        if (phoneNumber.length == 0) {
            setErrorMessage('Phone number is required')
            setIsPhoneNumberValid(false)
        }

        // const emptyInput = inputRefs.current.find((ref) => ref && ref.value === '');

        // if (emptyInput) {
        //   emptyInput.scrollIntoView({ behavior: 'smooth' });
        // }

        // if (!personalInfoButtonDisabled) {
        //     handlePersonalInfo()
        // }    
    }


    const addUserButtonDisabled = (Object.keys(postalCodeErrorNotification).length != 0 || Object.keys(stateErrorNotification).length != 0 || Object.keys(cityErrorNotification).length != 0 || Object.keys(addressErrorNotification).length != 0 || Object.keys(passwordErrorNotification).length != 0 || Object.keys(errorNotification).length != 0 || Object.keys(emailErrorNotification).length != 0 || userName.length === 0 || fullName.length === 0 || password.length === 0 || addressLine1.length === 0 || city.length === 0 || state.length === 0 || postalCode.length === 0);
    const handleUserInfo = () => {

        if (true) {

            const fetchData = async () => {
                setLoading(true);
                try {
                    const data = {
                        id: 0,
                        username: userName,
                        fullName: fullName,
                        country: country,
                        addressLine: addressLine1,
                        addressLine2: addressLine2,
                        city: city,
                        postalCode: parseInt(postalCode),
                        state: state,
                        phoneNumber: phoneNumber,
                        organizationName: "",
                        VAT: "",
                        organisationCountry: "",
                        isAgreementSigned: false,
                        tmpPassword: password,
                        cognito_user_groups: "",
                    }

                    const response = await fetch(`${BaseURL}/user`, {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                    })

                    if (response.ok) {
                        navigate('/userlist');
                    }
                    else if (response.status === 500) {
                        navigate('/userlist');
                    }
                    setLoading(false);

                }
                catch (e) {
                    setLoading(false);
                    await authContext.signout();
                }

            }
            fetchData();
        }
    }
   

    const getUserList = async () => {
        try {
            
            const response = await fetch(`${BaseURL}/list-users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            })
            

            if (response.ok) {
                const res = await response.json();
                const userEditArray=res?.result?.filter(a => a.id === userId);
                console.log(userEditArray,"testtt",res?.result,userId,"id is ")
                setFullName(userEditArray?.fullName);
                setAddressLine1(userEditArray?.addressLine1);


                // setRow(res?.result);
            }
            else if(response.status === 500){

            }
            // setLoading(false);
        }
        catch (e) {
            await authContext.signout();
            // setLoading(false);
        }
    }


    const handleClose=()=>{
        setOpen(false);
        navigate('/home/dashboard');
    }

    const location = useLocation();
    useEffect(()=>{
    //   if(location.pathname.includes('/home/dashboard')){
    //     getUserList()
    //   }
      console.log(searchParams?.get('Id'),"id-side-panel")
      setUserId(parseInt(searchParams?.get('Id')));
    //   getUserList()
    },[searchParams?.get('editUser')])

    useEffect(()=>{
      getUserList();
    },[userId])

    console.log(fullName,"fullname")

    return (
        <div className="main--content">
            {/* <Button onClick={() => setOpen(true)}>
                Open side panel
            </Button> */}
            {/* <SidePanel
                includeOverlay
                className="test"
                open={open}
                onRequestClose={() => setOpen(false)}
                title="Incident management"
                subtitle="Testing subtitle text."
                actions={[
                    {
                        label: 'Submit',
                        onClick: () => setOpen(false),
                        kind: 'primary',
                    },
                    {
                        label: 'Cancel',
                        onClick: () => setOpen(false),
                        kind: 'secondary',
                    },
                ]}
            >
                <div className={`story__body-content`}>
                    <h5>Subtitle</h5>
                    <div className={`story__text-inputs`}>
                        <TextInput
                            labelText="Input A"
                            id="side-panel-story-text-input-a"
                            className={`story__text-input`}
                        />
                        <TextInput
                            labelText="Input B"
                            id="side-panel-story-text-input-b"
                            className={`story__text-input`}
                        />
                    </div>
                </div>
            </SidePanel> */}
            <SidePanel
                includeOverlay
                className="test"
                open={open}
                // onRequestClose={handleClose}
                title=""
                subtitle=""
                actions={[
                    {
                        label: 'Submit',
                        onClick: () => { handleAccountInformationFormSubmit() },
                        kind: 'primary',
                    },
                    {
                        label: 'Cancel',
                        onClick: () =>{ handleClose()},
                        kind: 'secondary',
                    },
                ]}
            >
                <div className="adduser-box-content">
                    <div className="adduser">
                        {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0px 16px', width: '100%' }}>
                            <p>Add User</p>
                            <button
                                className={'submit-button'} onClick={() => navigate('/userlist')} >
                                Back
                            </button>
                        </div> */}
                        <TextInput
                            ref={emailInput}
                            name="userName"
                            type="text"
                            id="username"
                            className='text-input'
                            labelText="User name"
                            value={userName}
                            onChange={handleEmailChange}
                            invalid={!!errors.userName}
                            invalidText={errors.userName}
                            disabled={loading ? true : false}

                        />
                        <TextInput
                            ref={fullNameInput}
                            type="text"
                            name="fullName"
                            id="fullname"
                            labelText="Full name"
                            className='text-input'
                            value={fullName}
                            onChange={handleFullName}
                            invalid={accountInfoErrors.fullName}
                            invalidText={"Full name is required"}
                        />
                        <PasswordInput type="text"
                            ref={passwordInput}
                            name="password"
                            id="password"
                            labelText="Password"
                            className='text-input'
                            value={password}
                            onChange={(e) => handlePasswordChange(e)}
                            invalid={typeof passwordErrorNotification == 'object' && Object.keys(passwordErrorNotification).length !== 0}
                            invalidText={(passwordErrorNotification && passwordErrorNotification.title) ? passwordErrorNotification.title : ""}
                        />
                        <Select className='country-select-dropdown'
                            value={country}
                            id='country-ci'
                            labelText='Country or region of residence*'
                            onChange={e => setCountry(e.target.value)}
                        >
                            {countrylist.map((countryObject, countryIndex) => (<SelectItem
                                text={countryObject.name}
                                value={countryObject.name}
                                key={countryIndex}
                            />))}

                        </Select>
                        <TextInput type="text"
                            name="addressLine1"
                            id="addressline"
                            className='text-input'
                            labelText="Address line 1"
                            value={addressLine1}
                            onChange={handleAddressLine1}
                            invalid={accountInfoErrors.addressLine1}
                            invalidText={"Address line1 is required"}
                        />
                        <TextInput type="text"
                            id="addressline1"
                            className='text-input'
                            labelText="Address line 1 (optional)"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                        />
                        <TextInput type="text"
                            id="city"
                            name="city"
                            labelText="City"
                            className='text-input'
                            value={city}
                            onChange={handleCity}
                            invalid={accountInfoErrors.city}
                            invalidText={"City name is required"}
                        />
                        <TextInput type="text"
                            id="state"
                            name="state"
                            labelText="State"
                            className='text-input'
                            value={state}
                            onChange={handleState}
                            invalid={accountInfoErrors.state}
                            invalidText={"State is required"}
                        />
                        <TextInput type="text"
                            id="postalcode"
                            name="postalCode"
                            labelText="Postal Code"
                            className='text-input'
                            value={postalCode}
                            onChange={handlePostalCode}
                            invalid={typeof postalCodeErrorNotification == 'object' && Object.keys(postalCodeErrorNotification).length !== 0}
                            invalidText={(postalCodeErrorNotification && postalCodeErrorNotification.title) ? postalCodeErrorNotification.title : ""}
                        />
                        <div style={{ width: '266px', margin: '4px 0px' }}>
                            <p style={{ fontSize: "0.75rem" }}>Phone number</p>
                        </div>
                        <PhoneInput
                            className='phone-input'
                            style={{ border: !phoneNumberValid ? '2px solid red' : 0 }}
                            name='phoneNumber'
                            country={''}
                            value={phoneNumber}
                            onChange={(value, country, formattedValue) => handlePhoneNumber(value, country, formattedValue)}
                        />
                        {/* <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                            {loading ?
                                (
                                    <div className="user-loader">
                                        <Loader />
                                    </div>
                                ) :
                                (
                                    <button
                                        disabled={addUserButtonDisabled}
                                        className={addUserButtonDisabled ? 'submit-button-disabled' : 'submit-button'} onClick={() => handleUserInfo()} >
                                        Submit
                                    </button>)}
                        </div> */}
                    </div>
                </div>
            </SidePanel>
        </div>
    )
}