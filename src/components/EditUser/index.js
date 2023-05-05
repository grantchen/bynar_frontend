import { useState, useRef, useContext } from "react";
import { TextInput, Select, SelectItem, InlineLoading } from "@carbon/react";
import { BaseURL } from "../../sdk/constant";
import PhoneInput from "react-phone-input-2";
import "./EditUser.scss";
import { AuthContext, COUNTRIES } from "../../sdk";

export const EditUser = ({
  userDetails,
  setIsEditUserDetail,
  setServerNotification,
  setServerErrorNotification,
}) => {
  const token = localStorage.getItem("token");
  const authContext = useContext(AuthContext);
  const [country, setCountry] = useState(userDetails?.country ?? "");
  const [addressLine1, setAddressLine1] = useState(
    userDetails?.addressLine ?? ""
  );
  const [addressLine2, setAddressLine2] = useState(
    userDetails?.addressLine2 ?? ""
  );
  const [city, setCity] = useState(userDetails?.city ?? "");
  const [state, setState] = useState(userDetails?.state ?? "");
  const [postalCode, setPostalCode] = useState(userDetails?.postalCode ?? "");
  const [phoneNumber, setPhoneNumber] = useState(userDetails?.phoneNumber ?? 0);
  const [fullName, setFullName] = useState(userDetails?.fullName ?? "");
  const [userName, setUserName] = useState(userDetails?.username ?? "");

  const [errorNotification, setErrorNotification] = useState({});
  const [emailErrorNotification, setEmailErrorNotification] = useState({});
  const [addressErrorNotification, setAddressErrorNotification] = useState({});
  const [passwordErrorNotification, setPasswordErrorNotification] = useState(
    {}
  );
  const [cityErrorNotification, setCityErrorNotification] = useState({});
  const [stateErrorNotification, setStateErrorNotification] = useState({});
  const [postalCodeErrorNotification, setPostalCodeErrorNotification] =
    useState({});

  const emailInput = useRef(null);
  const fullNameInput = useRef(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleEmailChange = (e) => {
    setUserName(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailErrorNotification({ title: "Username must be email" });
      emailInput.current.focus();
    } else {
      setEmailErrorNotification({});
    }
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
    if (e.target.value.length === 0) {
      setErrorNotification({ title: "Full name should not be blank" });
    } else {
      setErrorNotification({});
    }
  };

  const handleAddressChange = (e) => {
    setAddressLine1(e.target.value);
    if (e.target.value.length === 0) {
      setAddressErrorNotification({ title: "Address should not be blank" });
    } else {
      setAddressErrorNotification({});
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    if (e.target.value.length === 0) {
      setCityErrorNotification({ title: "City should not be blank" });
    } else {
      setCityErrorNotification({});
    }
  };

  const handleState = (e) => {
    setState(e.target.value);
    if (e.target.value.length === 0) {
      setStateErrorNotification({ title: "Full name should not be blank" });
    } else {
      setStateErrorNotification({});
    }
  };

  const handlePostalCode = (e) => {
    setPostalCode(e.target.value);
    if (!/^\d+$/.test(e.target.value)) {
      setPostalCodeErrorNotification({
        title: "Postal code should be integer",
      });
    } else if (e.target.value.length === 0) {
      setPostalCodeErrorNotification({
        title: "Postal code should not be blank",
      });
    } else if (e.target.value.length != 6) {
      setPostalCodeErrorNotification({
        title: "Postal code should be of 6 digit",
      });
    } else {
      setPostalCodeErrorNotification({});
    }
  };

  const addUserButtonDisabled =
    Object.keys(postalCodeErrorNotification).length != 0 ||
    Object.keys(stateErrorNotification).length != 0 ||
    Object.keys(cityErrorNotification).length != 0 ||
    Object.keys(addressErrorNotification).length != 0 ||
    Object.keys(errorNotification).length != 0 ||
    Object.keys(emailErrorNotification).length != 0 ||
    fullName.length === 0 ||
    addressLine1.length === 0 ||
    city.length === 0 ||
    state.length === 0 ||
    postalCode.length === 0;

  const handleUserInfo = () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = {
          id: userDetails?.id,
          username: userName,
          fullName: fullName,
          country: country,
          addressLine: addressLine1,
          addressLine2: addressLine2,
          city: city,
          postalCode: parseInt(postalCode),
          state: state,
          phoneNumber: phoneNumber,
          organisationId: userDetails?.organisationId,
          organisationAccount: userDetails?.organisationAccount,
        };

        const response = await fetch(`${BaseURL}/user`, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (response.ok) {
          setIsEditUserDetail(false);
          setServerNotification(true);
          setServerErrorNotification({
            message: "User detail edited sucessfully",
            status: "success",
          });
        } else if (response.status === 500) {
          // setErrorNotification({
          //     title: response.error
          // })
          setIsEditUserDetail(false);
          setServerNotification(true);
          setServerErrorNotification({
            message: "Failed to edit user",
            status: "error",
          });
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        await authContext.signout();
      }
    };
    fetchData();
  };
  return (
    <div className="edituser-box">
      <div className="edituser">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
            padding: "0px 16px",
            width: "100%",
          }}
        >
          <p>Edit User</p>
          <button
            className={"submit-button"}
            onClick={() => setIsEditUserDetail(false)}
          >
            Back
          </button>
        </div>
        {/* <TextInput
                    ref={emailInput}
                    type="text"
                    id="username"
                    className='text-input'
                    labelText="User name"
                    value={userName}
                    onChange={(e) => handleEmailChange(e)}
                    invalid={typeof emailErrorNotification == 'object' && Object.keys(emailErrorNotification).length !== 0}
                    invalidText={(emailErrorNotification && emailErrorNotification.title) ? emailErrorNotification.title : ""}
                /> */}
        <TextInput
          ref={fullNameInput}
          type="text"
          id="fullname"
          labelText="Full name"
          className="text-input"
          value={fullName}
          onChange={(e) => handleFullNameChange(e)}
          invalid={
            typeof errorNotification == "object" &&
            Object.keys(errorNotification).length !== 0 &&
            fullName.length === 0
          }
          invalidText={
            errorNotification &&
            errorNotification.title &&
            fullName.length === 0
              ? "full name not be blank"
              : ""
          }
        />
        <Select
          className="country-select-dropdown"
          value={country}
          id="country-ci"
          labelText="Country or region of residence*"
          onChange={(e) => setCountry(e.target.value)}
        >
          {COUNTRIES.map((countryObject, countryIndex) => (
            <SelectItem
              text={countryObject.name}
              value={countryObject.name}
              key={countryIndex}
            />
          ))}
        </Select>
        <TextInput
          type="text"
          id="addressline"
          className="text-input"
          labelText="Address line 1"
          value={addressLine1}
          onChange={(e) => handleAddressChange(e)}
          invalid={
            typeof addressErrorNotification == "object" &&
            Object.keys(addressErrorNotification).length !== 0
          }
          invalidText={
            addressErrorNotification && addressErrorNotification.title
              ? addressErrorNotification.title
              : ""
          }
        />
        <TextInput
          type="text"
          id="addressline1"
          className="text-input"
          labelText="Address line 1 (optional)"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
        />
        <TextInput
          type="text"
          id="city"
          labelText="City"
          className="text-input"
          value={city}
          onChange={(e) => handleCityChange(e)}
          invalid={
            typeof cityErrorNotification == "object" &&
            Object.keys(cityErrorNotification).length !== 0
          }
          invalidText={
            cityErrorNotification && cityErrorNotification.title
              ? cityErrorNotification.title
              : ""
          }
        />
        <TextInput
          type="text"
          id="state"
          labelText="State"
          className="text-input"
          value={state}
          onChange={(e) => handleState(e)}
          invalid={
            typeof stateErrorNotification == "object" &&
            Object.keys(stateErrorNotification).length !== 0
          }
          invalidText={
            stateErrorNotification && stateErrorNotification.title
              ? stateErrorNotification.title
              : ""
          }
        />
        <TextInput
          type="text"
          id="postalcode"
          labelText="Postal Code"
          className="text-input"
          value={postalCode}
          onChange={(e) => handlePostalCode(e)}
          invalid={
            typeof postalCodeErrorNotification == "object" &&
            Object.keys(postalCodeErrorNotification).length !== 0
          }
          invalidText={
            postalCodeErrorNotification && postalCodeErrorNotification.title
              ? postalCodeErrorNotification.title
              : ""
          }
        />
        <div style={{ width: "266px", margin: "4px 0px" }}>
          <p style={{ fontSize: "0.75rem" }}>Phone number</p>
        </div>
        <PhoneInput
          className="phone-input"
          country={"in"}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e)}
        />
        <div style={{ marginTop: "12px", marginBottom: "12px" }}>
          {loading ? (
            <div className="edituser-loader">
              <InlineLoading description="Loading..." />
            </div>
          ) : (
            <button
              disabled={addUserButtonDisabled}
              className={
                addUserButtonDisabled
                  ? "submit-button-disabled"
                  : "submit-button"
              }
              onClick={() => handleUserInfo()}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
