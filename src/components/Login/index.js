import "../../pages/signin/signin.scss";
import {
  Form,
  Button,
  Heading,
  Checkbox,
  FormLabel,
  ToastNotification,
  TextInput,
  InlineLoading,
  Link,
} from "@carbon/react";
import { ArrowRight, ArrowLeft } from "@carbon/react/icons";
import { useNavigate } from "react-router-dom";
const Login = ({
  heading,
  loading,
  handleFormSubmit,
  setErrorNotification,
  setServerErrorNotification,
  serverErrorNotification,
  errorNotification,
  showCreateAccount,
  createAccoutText,
  navigationUrl,
  navigationUrlText,
  labelText,
  labelValue,
  setFormLabelState,
  buttonText,
  enableForgotPassword,
  placeholderText,
  showRememberId = false,
  navigateToLogin = false,
  text,
  subtitle,
  setSignInPhaseOne,
}) => {
  const navigate = useNavigate();
  return (
    <div className="signin-container">
      <div className="box-container">
        <Form onSubmit={handleFormSubmit}>
          <div style={{ paddingRight: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Heading style={{ fontSize: "28px", fontWeight: "400" }}>
                {heading}
              </Heading>
            </div>
            {navigateToLogin && (
              <p className="register-text-body-01">
                {text}
                <Link
                  className="underlined-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSignInPhaseOne(true);
                  }}
                >
                  {" "}
                  {subtitle}
                </Link>
              </p>
            )}
            {/* {showCreateAccount && <p className="register-text-body-01">{createAccoutText}<Link style={{ cursor: 'pointer' }} className="underlined-link" onClick={() => { navigate(`${navigationUrl}`) }}> {navigationUrlText}</Link></p>} */}
            {typeof serverErrorNotification === "object" &&
            Object.keys(serverErrorNotification).length !== 0 ? (
              <ToastNotification
                className="error-notification-box"
                onClose={function noRefCheck() {}}
                onCloseButtonClick={() => {
                  setErrorNotification({});
                  setServerErrorNotification({});
                }}
                statusIconDescription="notification"
                title={
                  serverErrorNotification.title
                    ? serverErrorNotification.title
                    : ""
                }
              />
            ) : (
              <div></div>
            )}
            <div className="login-input-wrapper">
              {enableForgotPassword ? (
                <FormLabel className="input-label">
                  {labelText}{" "}
                  <Link
                    style={{ cursor: "pointer" }}
                    className="forgot-link"
                    onClick={() => {
                      navigate("/forgotpassword");
                    }}
                  >
                    Forgot Password?
                  </Link>
                </FormLabel>
              ) : (
                <FormLabel className="input-label">{labelText} </FormLabel>
              )}
              <TextInput
                id="email"
                className="login-form-input"
                hideLabel={true}
                invalid={
                  typeof errorNotification === "object" &&
                  Object.keys(errorNotification).length !== 0
                }
                labelText=""
                invalidText={
                  errorNotification && errorNotification.title
                    ? errorNotification.title
                    : ""
                }
                placeholder={placeholderText}
                disabled={loading ? true : false}
                value={labelValue}
                onChange={(e) => {
                  setFormLabelState(e.target.value);
                  if (
                    typeof errorNotification === "object" &&
                    Object.keys(errorNotification).length !== 0
                  )
                    setErrorNotification({});
                  setServerErrorNotification({});
                }}
              />
            </div>
            {showRememberId && (
              <Checkbox
                className="checkbox-item"
                labelText={`Remember ID`}
                id="checkbox-label-1"
              />
            )}
          </div>
          <div className="fields-container">
            {loading ? (
              <div className="loader-signin">
                <InlineLoading
                  description={"Please wait..."}
                  className="submit-button-loading"
                />
              </div>
            ) : (
              <Button
                renderIcon={ArrowRight}
                type="submit"
                iconDescription={""}
              >
                {buttonText}
              </Button>
            )}
          </div>
          <div className="footer-container">
            {showCreateAccount && (
              <p className="register-text-body-01">
                {createAccoutText}
                <Link
                  style={{
                    cursor: "pointer",
                    textDecoration: "underline",
                    paddingLeft: "4px",
                    outline: "none",
                  }}
                  className="underlined-link"
                  href={`${navigationUrl}`}
                >
                  {" "}
                  {navigationUrlText}
                </Link>
              </p>
            )}
          </div>
        </Form>
      </div>
      <div className="footer-text">
        <p className="register-text-body-02">
          {"Need help?"}
          <Link
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              paddingLeft: "4px",
              outline: "none",
            }}
            href={`signin`}
          >
            {" "}
            {"Contact the Bynar help desk"}
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;