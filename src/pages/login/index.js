import React, { useEffect, useState} from "react";
import {Button, Column, Grid,} from "@carbon/react";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../components/media/background.svg';
import "./login.scss";
import { TypeAnimation } from 'react-type-animation';
import SignFooter from "../../components/SignFooter";
import {useTranslation} from "react-i18next";
import SignHeaderSelect from "../../components/SignHeaderSelect";

const Home = () => {
    const [showVideo, setShowVideo] = useState(false);
    const [videoBackgroundColor, setVideoBackgroundColor] = useState("white");
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [language, setLanguage] = useState(localStorage.getItem('lang') ?? 'en');
    const { t } = useTranslation();
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // word wrap newline
    let wordAmount = 5
    if (windowWidth > 700 && windowWidth < 1176) {
        wordAmount = 2
    }
    // To adapt to the Language length by country
    let loginWight = '100%'
    let signupWight = '100%'
    let signupLeft = 0
    if (language === 'de') {
        signupWight = '75%'
    }
    if (language === 'es') {
        signupWight = '95%'
    }
    if (language === 'fr') {
        loginWight = '88%'
    }
    if (language === 'de' || language === 'es') {
        loginWight = '93%'
        signupLeft = '10px'
    }
    if (windowWidth < 672) {
        signupWight = '100%'
        loginWight = '100%'
        signupLeft = 0
    }

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
    };

    return (
        <div>
            <SignHeaderSelect onLanguageChange={handleLanguageChange}></SignHeaderSelect>
            <div
                className={"auth-login-container"}
            >
                <Grid className={"auth-login-grid"}>
                    {wordAmount === 5 && windowWidth > 768 && (
                        <Column sm={0} md={windowWidth >= 672 && windowWidth <= 768 ? 0 : 4} lg={10} className={"auth-login-column"} style={{
                            backgroundImage: `url(${ backgroundImage })`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                            marginRight: '50px',
                        }}>
                            <div className="header-caption">
                                {language === "de" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Einführung des bynar ERP-Systems',
                                            1000,
                                            'Testen Sie zum Testen',
                                            1000,
                                        ]}
                                        speed={80}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                    />
                                )}
                                {language === "es" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Presentamos el sistema bynar erp',
                                            1000,
                                            'Prueba para probar',
                                            1000,
                                        ]}
                                        speed={80}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                    />
                                )}
                                {language === "en" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Introducing the bynar erp system',
                                            1000,
                                            'Test to for testing',
                                            1000,
                                        ]}
                                        speed={80}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                    />
                                )}
                                {language === "fr" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Présentation du système ERP Bynar',
                                            1000,
                                            'Tester pour tester',
                                            1000,
                                        ]}
                                        speed={80}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                    />
                                )}
                            </div>
                        </Column>
                    )}
                    {wordAmount === 2 && windowWidth > 768 && (
                        <Column sm={0} md={windowWidth >= 672 && windowWidth <= 768 ? 0 : 4} lg={10} className={"auth-login-column"} style={{
                            backgroundImage: `url(${ backgroundImage })`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                            <div className="header-caption">
                                {language === "de" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Einführung des\n bynar\n ERP-Systems',
                                            1000,
                                            'Testen Sie\n zum Testen',
                                            1000,
                                        ]}
                                        speed={80}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                    />
                                )}
                                {language === "es" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Presentamos el\n sistema bynar\n erp',
                                            1000,
                                            'Prueba para probar',
                                            1000,
                                        ]}
                                        speed={80}
                                        deletionSpeed={80}
                                        style={{ fontSize: '40px', whiteSpace: 'pre-line', color: 'rgb(254, 118, 0)' }}
                                        repeat={Infinity}
                                    />
                                )}
                                {language === "en" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Introducing the\n bynar erp\n system',
                                            1000,
                                            'Test to\n for testing',
                                            1000,
                                        ]}
                                        speed={80}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                    />
                                )}
                                {language === "fr" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Présentation du\n système ERP\n Bynar',
                                            1000,
                                            'Tester pour\n tester',
                                            1000,
                                        ]}
                                        speed={80}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                    />
                                )}
                            </div>
                        </Column>
                    )}

                    <Column sm={4} md={windowWidth >= 672 && windowWidth <= 768 ? 8 : 4} lg={6} className="auth-login-container">
                        <div className="auth-login-area">
                            <div className="bx--row">
                                <div className="bx--col auth-login-bx">
                                    <div className="button-container">
                                        <h2 style={{ fontWeight: 'bold' }}>{t("get-started")}</h2>
                                        <div className="fields-container">
                                            <div style={{ flex:1 }}>
                                                <Button
                                                    type="submit"
                                                    size={'md'}
                                                    style={{ width: loginWight }}
                                                    className="login-submit-button bx--btn bx--btn--primary"
                                                    onClick={() => {
                                                        navigate("/signin");
                                                    }}
                                                >
                                                    {t("login-button")}
                                                </Button>
                                            </div>
                                            <div style={{ width: '20px' }} />
                                            <div style={{ flex: 1, marginTop: windowWidth < 672 ? '15px' : 0 }}>
                                                <Button
                                                    type="submit"
                                                    size={'md'}
                                                    style={{ width: signupWight, marginLeft: signupLeft }}
                                                    className="login-submit-button bx--btn bx--btn--primary"
                                                    disabled={true}
                                                >
                                                    {t("sign-up-button")}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SignFooter></SignFooter>
                    </Column>
                </Grid>
            </div>
        </div>
    )
}
export default Home;
