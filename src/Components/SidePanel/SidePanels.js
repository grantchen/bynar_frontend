
import { SidePanel } from '@carbon/ibm-products';
import { Button, TextInput } from 'carbon-components-react';
import './SidePanel.scss'
import { AddUser } from '../../pages/AddUser/AddUser';
import countrylist from "../../data/countrylist";
import { useState, useRef, useContext, useEffect } from "react";
import {
    PasswordInput, Select,
    SelectItem,
    ToastNotification
} from 'carbon-components-react';
import 'react-telephone-input/css/default.css'
import { BaseURL } from "../../sdk/constant";
import PhoneInput from 'react-phone-input-2'
// import { countries } from 'react-phone-input-2/countries';
// import 'react-phone-input-2/dist/style.css'
import 'react-phone-input-2/lib/style.css';
// import './AddUser.scss';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "../../Components/Loader/Loader";
import { DataLoader } from '../Loader/DataLoder';
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
        role: false,
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
    const [phoneNumber, setPhoneNumber] = useState('91');
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Users")
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
    const [userId, setUserId] = useState(0);
    const [serverErrorNotification, setServerErrorNotification] = useState({})
    const [serverNotification, setServerNotification] = useState(false);
    const [isUserEdit, setUserEdit] = useState(false);
    const [organisationID, setOrganizationId] = useState(0)
    const roleslist = [
        { "name": "Owner" },
        { "name": "Administrator" },
        { "name": "Users" }]
    const [countryCode, setCountryCode] = useState('IN');


    const checkEmailValid = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePassword = (value) => {

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

    const handleRoleChange = (e) => {
        const { name, value } = e.target;
        setRole(value)
        setAccountInfoErrors({ ...accountInfoErrors, [name]: value.trim().length == 0 })
    }
    // invalidText={(passwordErrorNotification && passwordErrorNotification.title) ? passwordErrorNotification.title : ""}
    const personalInfoButtonDisabled = fullName.trim().length == 0 || city.trim().length == 0 || state.trim().length == 0 || postalCode.toString().trim().length == 0 || !phoneNumberValid || addressLine1.trim().length == 0 || Object.keys(postalCodeErrorNotification).length != 0;
    const handleAccountInformationFormSubmit = () => {

        const error = {}
        postalCodeValidation(postalCode)
        error.fullName = fullName.trim().length == 0;
        error.addressLine1 = addressLine1.trim().length == 0;
        error.city = city.trim().length == 0;
        error.fullName = fullName.trim().length == 0;
        error.state = state.trim().length == 0;
        error.phoneNumber = phoneNumber.length == 0;
        error.role = role.length == 0;
        const emailError = validateEmail(userName.trim())
        setErrors(validateEmail(userName.trim()))
        setAccountInfoErrors(error)
        // validatePassword(password)
        if (phoneNumber.length == 0) {
            setErrorMessage('Phone number is required')
            setIsPhoneNumberValid(false)
        }

        if (Object.keys(emailError).length == 0 && !personalInfoButtonDisabled) {
            handleAddUser();
        }
        // const emptyInput = inputRefs.current.find((ref) => ref && ref.value === '');

        // if (emptyInput) {
        //   emptyInput.scrollIntoView({ behavior: 'smooth' });
        // }

        // if (!personalInfoButtonDisabled) {
        //     handlePersonalInfo()
        // }    
    }

    const editInfoButtonDisabled = fullName.trim().length == 0 || city.trim().length == 0 || state.trim().length == 0 || postalCode.toString().trim().length == 0 || !phoneNumberValid || addressLine1.trim().length == 0 || Object.keys(postalCodeErrorNotification).length != 0;
    const handleEditInformationFormSubmit = () => {

        const error = {}
        postalCodeValidation(postalCode)
        error.fullName = fullName.trim().length == 0;
        error.addressLine1 = addressLine1.trim().length == 0;
        error.city = city.trim().length == 0;
        error.fullName = fullName.trim().length == 0;
        error.state = state.trim().length == 0;
        error.phoneNumber = phoneNumber.length == 0;
        const emailError = validateEmail(userName.trim())
        setErrors(validateEmail(userName.trim()))
        setAccountInfoErrors(error)
        if (phoneNumber.length == 0) {
            setErrorMessage('Phone number is required')
            setIsPhoneNumberValid(false)
        }
        console.log(emailError, personalInfoButtonDisabled, "test")

        if (Object.keys(emailError).length == 0 && !editInfoButtonDisabled) {
            handleEditUser();
        }
        // const emptyInput = inputRefs.current.find((ref) => ref && ref.value === '');

        // if (emptyInput) {
        //   emptyInput.scrollIntoView({ behavior: 'smooth' });
        // }

        // if (!personalInfoButtonDisabled) {
        //     handlePersonalInfo()
        // }    
    }


    // const addUserButtonDisabled = (Object.keys(postalCodeErrorNotification).length != 0 || Object.keys(stateErrorNotification).length != 0 || Object.keys(cityErrorNotification).length != 0 || Object.keys(addressErrorNotification).length != 0 || Object.keys(passwordErrorNotification).length != 0 || Object.keys(errorNotification).length != 0 || Object.keys(emailErrorNotification).length != 0 || userName.length === 0 || fullName.length === 0 || password.length === 0 || addressLine1.length === 0 || city.length === 0 || state.length === 0 || postalCode.length === 0);
    const handleAddUser = () => {



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
                    cognitoUserGroup: role,
                }

                const response = await fetch(`${BaseURL}/user`, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                })

                const res = await response.json();

                if (response.ok) {
                    navigate('/home/dashboard?addUserMessage=true&messageId=0');
                }
                else if (response.status === 500) {
                    setServerErrorNotification({ message: res.error, status: 'error' })
                    setServerNotification(true)
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

    const handleEditUser = () => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = {
                    id: userId,
                    username: userName,
                    fullName: fullName,
                    country: country,
                    addressLine: addressLine1,
                    addressLine2: addressLine2,
                    city: city,
                    postalCode: parseInt(postalCode),
                    state: state,
                    phoneNumber: phoneNumber,
                }

                const response = await fetch(`${BaseURL}/user`, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                })

                const res = await response.json();

                if (response.ok) {
                    navigate('/home/dashboard?addUserMessage=true&messageId=0');
                }
                else if (response.status === 500) {
                    setServerErrorNotification({ message: res.error, status: 'error' })
                    setServerNotification(true)
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

    const getUserList = async (userid) => {
        try {
            setLoading(true)
            const response = await fetch(`${BaseURL}/list-users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
            })


            if (response.ok) {
                const res = await response.json();
                const userEditArray = res?.result?.filter(a => a.id === userid);
                setFullName(userEditArray[0]?.fullName);
                setUserName(userEditArray[0]?.username);
                setCountry(userEditArray[0]?.country);
                setAddressLine1(userEditArray[0]?.addressLine);
                setAddressLine2(userEditArray[0]?.addressLine2);
                setCity(userEditArray[0]?.city);
                setState(userEditArray[0]?.state);
                setPostalCode(userEditArray[0]?.postalCode);
                setPhoneNumber(userEditArray[0]?.phoneNumber);
                setOrganizationId(userEditArray[0]?.organisationID)
            }
            else if (response.status === 500) {

            }
            setLoading(false);
        }
        catch (e) {
            await authContext.signout();
            setLoading(false);
        }
    }


    const handleClose = () => {
        setOpen(false);
        navigate('/home/dashboard');
    }

    useEffect(() => {
        setUserId(parseInt(searchParams?.get('Id')));
        if (parseInt(searchParams?.get('Id')) > 0) {
            getUserList(parseInt(searchParams?.get('Id')));
            setUserEdit(true);
        }

    }, [open])

    const handleCountryChange = (e) => {
        const selectedItem = countrylist.find((item) => item.name === e.target.value);
        if (Object.keys(selectedItem).length == 0) {
            setPhoneNumber('')
        }
        else {
            setCountry(e.target.value)
            setPhoneNumber(selectedItem?.dial_code.toString())
        }
    }

    return (
        <div className="main--content">
            <SidePanel
                includeOverlay
                className="test"
                open={open}
                onRequestClose={handleClose}
                title={isUserEdit?'Edit User':'Add User'}
                subtitle=""
                actions={[
                    {
                        label: isUserEdit ? 'Update' : 'Submit',
                        onClick: () => { isUserEdit ? handleEditInformationFormSubmit() : handleAccountInformationFormSubmit() },
                        kind: 'primary',
                    },
                    {
                        label: 'Cancel',
                        onClick: () => { handleClose() },
                        kind: 'secondary',
                    },
                ]}
            >
                <div className={`story__body-content`}>
                    {/* <h5>{isUserEdit?'EditUser':'AddUser'}</h5> */}
                    <div className={`story__text-inputs`}>
                        {/* <TextInput
                            labelText="Input A"
                            id="side-panel-story-text-input-a"
                            className={`story__text-input`}
                        /> */}
                        <TextInput
                            ref={emailInput}
                            name="userName"
                            type="text"
                            id="username"
                            className={`story__text-input`}
                            labelText="User Name *"
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
                            labelText="Full Name *"
                            className={`story__text-input`}
                            value={fullName}
                            onChange={handleFullName}
                            invalid={accountInfoErrors.fullName}
                            invalidText={"Full name is required"}
                        />
                    </div>
                    <div className={`story__text-inputs`}>
                        {!isUserEdit && <Select className={`story__text-input`}
                            name="role"
                            value={role}
                            id='country-ci'
                            labelText='Role *'
                            onChange={handleRoleChange}
                            invalid={accountInfoErrors.role}
                            invalidText={"User role is required"}
                        // defaultValue={''}
                        >
                            {roleslist.map((rolesObject, rolesIndex) => (<SelectItem
                                text={rolesObject.name}
                                value={rolesObject.name}
                                key={rolesIndex}
                            />))}

                        </Select>}
                        <Select
                            className={`story__text-input`}
                            value={country}
                            id='country-ci'
                            labelText='Country or region of residence*'
                            onChange={handleCountryChange}
                        >
                            {countrylist.map((countryObject, countryIndex) => (<SelectItem
                                text={countryObject.name}
                                value={countryObject.name}
                                key={countryIndex}
                            />))}

                        </Select>
                    </div>
                    <div className={`story__text-inputs`}>
                        <TextInput type="text"
                            name="addressLine1"
                            id="addressline"
                            className={`story__text-input`}
                            labelText="Address line 1 *"
                            value={addressLine1}
                            onChange={handleAddressLine1}
                            invalid={accountInfoErrors.addressLine1}
                            invalidText={"Address line1 is required"}
                        />
                        <TextInput type="text"
                            id="addressline1"
                            className={`story__text-input`}
                            labelText="Address line 2 (optional)"
                            value={addressLine2}
                            onChange={(e) => setAddressLine2(e.target.value)}
                        />
                    </div>
                    <div className={`story__text-inputs`}>
                        <TextInput type="text"
                            id="city"
                            name="city"
                            labelText="City *"
                            className={`story__text-input`}
                            value={city}
                            onChange={handleCity}
                            invalid={accountInfoErrors.city}
                            invalidText={"City name is required"}
                        />
                        <TextInput type="text"
                            id="state"
                            name="state"
                            labelText="State *"
                            className={`story__text-input`}
                            value={state}
                            onChange={handleState}
                            invalid={accountInfoErrors.state}
                            invalidText={"State is required"}
                        />
                    </div>
                    <div className={`story__text-inputs`}>
                        <TextInput type="text"
                            id="postalcode"
                            name="postalCode"
                            labelText="Postal Code *"
                            className={`story__text-inputs`}
                            value={postalCode}
                            onChange={handlePostalCode}
                            invalid={typeof postalCodeErrorNotification == 'object' && Object.keys(postalCodeErrorNotification).length !== 0}
                            invalidText={(postalCodeErrorNotification && postalCodeErrorNotification.title) ? postalCodeErrorNotification.title : ""}
                        />
                        <div>
                            <div className='phone-label-wrapper'>
                                <p className='phone-label'>Phone Number *</p>
                            </div>
                            <PhoneInput
                                className='phone-input'
                                // defaultCountry="in"
                                style={{ border: !phoneNumberValid ? '2px solid red' : 0 }}
                                name='phoneNumber'
                                country={'IN'}
                                value={phoneNumber}
                                onChange={(value, country, formattedValue) => handlePhoneNumber(value, country, formattedValue)}
                            />
                            {!phoneNumberValid && <p style={{ marginTop: '4px', fontSize: '12px', color: '#DA1E28' }}>{errorMessage}</p>}
                        </div>
                    </div>
                    </div>
            </SidePanel >
        </div >
    )
}