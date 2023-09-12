import "../../pages/signin/signin.scss";
import {
  Form,
  Heading,
  InlineLoading,
  ToastNotification,
  Link,
} from "@carbon/react";
import { useNavigate } from "react-router-dom";
const MagicLinkValidation = ({
  heading,
  loading,
  loadingSucess,
  handleFormSubmit,
  errorNotification,
  buttonText,
  text,
  subtitle,
  setSignInPhaseOne,
  showCreateAccount,
  createAccoutText,
  navigationUrl,
  navigationUrlText,
  placeholderText,
  setErrorNotification,
  setServerErrorNotification,
  serverErrorNotification,
  handleEmailFormSubmit,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="signin-container">
        <div className="box-container">
          <Form onSubmit={handleFormSubmit}>
            <div style={{ paddingRight: "20px" }}>
              <Heading style={{ fontSize: "28px", fontWeight: "400" }}>
                {heading}
              </Heading>
              <p className="register-text body-01">
                {text}
                <Link
                  className="underlined-link"
                  style={{
                    cursor: "pointer",
                    paddingLeft: "4px",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    setSignInPhaseOne(true);
                    setServerErrorNotification({});
                  }}
                >
                  {" "}
                  {subtitle}
                </Link>
              </p>
              {typeof serverErrorNotification === "object" &&
              Object.keys(serverErrorNotification).length !== 0 ? (
                <div className="notification-container">
                  <ToastNotification
                    className="error-notification-box"
                    timeout={0}
                    title={serverErrorNotification?.title}
                    kind={serverErrorNotification?.status}
                    onCloseButtonClick={() => {
                      setErrorNotification({});
                      setServerErrorNotification({});
                    }}
                  />
                </div>
              ) : (
                <div></div>
              )}
              <div className="login-input-wrapper">
                <div className="resend-code">
                  {loadingSucess ? (
                    <div>
                      <InlineLoading
                        description={"resending login link..."}
                        className="submit-button-loading"
                      />
                    </div>
                  ) : (
                    <p
                      className="resend-code-text"
                      onClick={handleEmailFormSubmit}
                    >
                      Resend login email
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              {loading && (
                <div className="loader-signin">
                  <InlineLoading
                    description={"Please wait..."}
                    className="submit-button-loading"
                  />
                </div>
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
          <p className="register-text-body-01">
            {"Need help?"}
            <Link
              style={{
                cursor: "pointer",
                textDecoration: "underline",
                paddingLeft: "4px",
                outline: "none",
              }}
              className="underlined-link"
              href={`signin`}
            >
              {" "}
              {"Contact the Bynar help desk"}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
export default MagicLinkValidation;
