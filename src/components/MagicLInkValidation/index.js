import "../../pages/signin/signin.scss";
import {
  Form,
  Button,
  Heading,
  InlineLoading,
  ToastNotification,
  Link,
} from "@carbon/react";
import {ArrowRight} from "@carbon/react/icons";
import {useNavigate} from "react-router-dom";

const MagicLinkValidation = ({
  heading,
  loading,
  loadingSuccess,
  handleFormSubmit,
  buttonText,
  text,
  subtitle,
  setSignInPhaseOne,
  showCreateAccount,
  createAccountText,
  navigationUrl,
  navigationUrlText,
  setErrorNotification,
  setServerErrorNotification,
  serverErrorNotification,
  handleEmailFormSubmit,
}) => {
  useNavigate();
  return (
    <>
      <div className="app-container">
        <div className="outer">
          <div className="middle">
            <div className="inner">
              <div className="bx--masthead main-header-bottom">
                <div className="bx--masthead__l0 bx--grid">
                  <header
                    aria-label="Bynar"
                    data-autoid="dds--masthead"
                    className="bx--header login-main-header"
                  >
                    <div className="bx--header__logo">
                      <a
                        aria-label="Bynar"
                        data-autoid="dds--masthead-alt__l0-logo"
                        href="http://www.ibm.com"
                      >
                        <svg
                          width="58"
                          height="23"
                          viewBox="0 0 58 23"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M58 21.467V23h-7.632v-1.533H58zm-18.316 0V23h-7.631v-1.533h7.631zm5.955 0L45.025 23l-.606-1.533h1.22zm-17.097 0A6.285 6.285 0 0 1 24.391 23H12.21v-1.533zm-17.858 0V23H0v-1.533h10.684zm29-3.067v1.533h-7.631V18.4h7.631zm7.148 0l-.594 1.533H43.82l-.598-1.533h3.609zm-16.764 0a5.719 5.719 0 0 1-.64 1.533H12.21V18.4zm-19.384 0v1.533H0V18.4h10.684zM58 18.4v1.533h-7.632V18.4H58zm-3.053-3.067v1.534h-4.579v-1.534h4.58zm-15.263 0v1.534h-4.579v-1.534h4.58zm8.345 0l-.6 1.534h-4.806l-.604-1.534h6.01zm-18.174 0c.137.49.213 1.003.213 1.534h-5.647v-1.534zm-10.013 0v1.534h-4.579v-1.534h4.58zm-12.21 0v1.534h-4.58v-1.534h4.58zm47.315-3.066V13.8h-4.579v-1.533h4.58zm-15.263 0V13.8h-4.579v-1.533h4.58zm9.541 0l-.597 1.533h-7.22l-.591-1.533h8.408zm-21.248 0c.527.432.98.951 1.328 1.533H15.263v-1.533zm-20.345 0V13.8h-4.58v-1.533h4.58zM44.599 9.2l.427 1.24.428-1.24h9.493v1.533h-4.579V9.324l-.519 1.41h-9.661l-.504-1.41v1.41h-4.579V9.2H44.6zm-36.967 0v1.533h-4.58V9.2h4.58zm21.673 0a5.95 5.95 0 0 1-1.328 1.533H15.263V9.2zm25.642-3.067v1.534h-8.964l.54-1.534h8.424zm-11.413 0l.54 1.534h-8.969V6.133h8.43zm-13.466 0c0 .531-.076 1.045-.213 1.534H24.42V6.133zm-10.226 0v1.534h-4.579V6.133h4.58zm-12.21 0v1.534h-4.58V6.133h4.58zm34.845-3.066l.53 1.533H32.054V3.067h10.424zm15.523 0V4.6H47.04l.55-1.533H58zm-28.573 0c.284.473.504.988.641 1.533H12.211V3.067zm-18.743 0V4.6H0V3.067h10.684zM41.406 0l.54 1.533h-9.893V0h9.353zM58 0v1.533h-9.881L48.647 0H58zM24.39 0c1.601 0 3.057.581 4.152 1.533H12.211V0zM10.685 0v1.533H0V0h10.684z"
                            fill="#161616"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </header>
                </div>
              </div>
              <div className="signin-container">
                <div className="signin-grid bx--grid">
                  <div className="box-container bx--row">
                    <div className="sign-in-form-area bx--col-lg-12 bx--offset-lg-0">
                      <div>
                        <div className="bx--row">
                          <div className="bx--col">
                            <div className="signin-form">
                              <Form onSubmit={handleFormSubmit}>
                                <div className="form-heading">
                                  <div className="bx--row">
                                    <div className="bx--col">
                                      <Heading className="form-mainHeading">
                                        {heading}
                                      </Heading>
                                    </div>
                                  </div>
                                </div>
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
                                  <></>
                                )}
                                <div className="login-input-wrapper">
                                  <div className="resend-code">
                                    {loadingSuccess ? (
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
                                <div className="bx--row">
                                  <div className="bx--col">
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
                                  </div>
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
                                      className="login-submit-button bx--btn bx--btn--primary"
                                    >
                                      {buttonText}
                                    </Button>
                                  )}
                                </div>
                                <div className="footer-container">
                                  {showCreateAccount && (
                                    <p className="register-text-body-01">
                                      {createAccountText}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="footer-text">
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
        </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MagicLinkValidation;
