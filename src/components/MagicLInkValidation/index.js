import "../../pages/signin/signin.scss";
import {
    Form,
    Heading,
    InlineLoading,
    InlineNotification,
    Link,
    Grid,
    Column,
} from "@carbon/react";
import { useNavigate } from "react-router-dom";
import SignHeader from "../SignHeader";
import { Footer } from "@carbon/ibmdotcom-react";
import React, { useEffect, useState } from "react";
import SignFooter from "../../components/SignFooter";
import {useTranslation} from "react-i18next";
import SignHeaderSelect from "../SignHeaderSelect";

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
    const { t } = useTranslation();
    const handleLanguageChange = (newLanguage) => {
        console.log(newLanguage)
    };
    return (
        <>
            <div>
                <SignHeaderSelect onLanguageChange={handleLanguageChange}></SignHeaderSelect>
                <div className="signin-container">
                    <Grid className="signin-grid">
                        <Column sm={{ span: 4 }} md={{ span: 8 }} lg={{ span: 16 }} xlg={{ span: 16 }} className={"box-container"}>
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
                                                        <InlineNotification
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
                                                                    description={`${t("please-wait")}...`}
                                                                    className="submit-button-loading"
                                                                />
                                                            </div>
                                                        ) : loadingSuccess ? (
                                                            <div className="loader-signin">
                                                                <InlineLoading
                                                                    description={`${t("resending-login-link")}...`}
                                                                    className="submit-button-loading"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <p
                                                                className="resend-code-text"
                                                                onClick={handleEmailFormSubmit}
                                                            >
                                                                {t("resend-login-email")}
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
                    <SignFooter></SignFooter>
                </div>
            </div>
        </>
    );
};
export default MagicLinkValidation;
