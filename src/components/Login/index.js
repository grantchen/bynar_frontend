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
import { ArrowRight } from "@carbon/react/icons";
import { useNavigate } from "react-router-dom";
import SignHeader from "../SignHeader";
const Login = ({
  heading,
  loading,
  handleFormSubmit,
  setErrorNotification,
  setServerErrorNotification,
  serverErrorNotification,
  errorNotification,
  showCreateAccount,
  createAccountText,
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
    <div className="app-container">
      <SignHeader></SignHeader>
      <div className="signin-container">
        <div className="signin-grid bx--grid">
          <div className="box-container bx--row">
            <div className="sign-in-form-area bx--col-lg-12 bx--offset-lg-0">
              <div>
                <div className="bx--row">
                  <div className="bx--col">
                    <div className="signin-form">
                      <Form
                        onSubmit={handleFormSubmit}
                        className="ibm-row-form"
                      >
                        <div className="form-heading">
                          <div className="bx--row">
                            <div className="bx--col">
                              <Heading className="form-mainHeading">
                                {heading}
                              </Heading>
                            </div>
                          </div>
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
                        {/* {showCreateAccount && <p className="register-text-body-01">{createAccountText}<Link style={{ cursor: 'pointer' }} className="underlined-link" onClick={() => { navigate(`${navigationUrl}`) }}> {navigationUrlText}</Link></p>} */}
                        {typeof serverErrorNotification === "object" &&
                        Object.keys(serverErrorNotification).length !==
                        0 ? (
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
                          <></>
                        )}
                        <div className="bx--row">
                          <div className="bx--col">
                            {enableForgotPassword ? (
                              <FormLabel className="bx--label">
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
                              <FormLabel className="bx--label">
                                {labelText}{" "}
                              </FormLabel>
                            )}
                            <TextInput
                              id="email"
                              className="login-form-input"
                              hideLabel={true}
                              invalid={
                                typeof errorNotification === "object" &&
                                Object.keys(errorNotification).length !==
                                0
                              }
                              labelText=""
                              invalidText={
                                errorNotification &&
                                errorNotification.title
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
                                  Object.keys(errorNotification)
                                    .length !== 0
                                )
                                  setErrorNotification({});
                                setServerErrorNotification({});
                              }}
                            />
                          </div>
                        </div>
                        {showRememberId && (
                          <Checkbox
                            className="checkbox-item"
                            labelText={`Remember ID`}
                            id="checkbox-label-1"
                          />
                        )}
                        <div className="bx--row">
                          <div className="bx--col">
                            <div className="fields-container button-container">
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
                                  className="login-submit-button bx--btn bx--btn--primary"
                                >
                                  {buttonText}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bx--row">
                          <div className="bx--col">
                            <div className="field-container bottom-container">
                              {showCreateAccount && (
                                <div className="register-text body-01">
                                  <p>{createAccountText}</p>
                                  <div>
                                    <Link
                                      renderIcon={ArrowRight}
                                      className="login-create-account bx--btn bx--btn--tertiary"
                                      href={`${navigationUrl}`}
                                    >
                                      {" "}
                                      {navigationUrlText}
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bx--row">
                          <div className="bx--col">
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
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
