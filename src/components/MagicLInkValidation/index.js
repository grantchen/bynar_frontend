import "../../pages/signin/signin.scss";
import {
    Form,
    Heading,
    InlineLoading,
    ToastNotification,
    Link,
    Grid,
    Column,
} from "@carbon/react";
import {useNavigate} from "react-router-dom";
import SignHeader from "../SignHeader";

const MagicLinkValidation = ({
                                 heading,
                                 loading,
                                 loadingSuccess,
                                 handleFormSubmit,
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
                <SignHeader></SignHeader>
                <div className="signin-container">
                    <Grid fullWidth className={"signin-grid"}>
                        <Column sm={{span: 2, offset: 1}} lg={{span: 4, offset: 6}}
                                md={{span: 3, offset: 2}} className={"box-container"}>
                            <div className="sign-in-form-area">
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
                                                        {loading ? (
                                                            <div className="loader-signin">
                                                                <InlineLoading
                                                                    description={"Please wait..."}
                                                                    className="submit-button-loading"
                                                                />
                                                            </div>
                                                        ) : loadingSuccess ? (
                                                            <div className="loader-signin">
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
                        </Column>
                    </Grid>
                </div>
            </div>
        </>
    );
};
export default MagicLinkValidation;
