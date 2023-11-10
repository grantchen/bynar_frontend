import React, {useCallback, useEffect, useState} from "react";
import {Button, Column, Grid, Header, Link,} from "@carbon/react";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../components/media/background.svg';
import "./login.scss";
import { TypeAnimation } from 'react-type-animation';
import SignHeader from "../../components/SignHeader";
import SignFooter from "../../components/SignFooter";
import {useTranslation} from "react-i18next";

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

    // word wrap
    let wordAmount = 5
    if (windowWidth > 800 && windowWidth < 1059) {
        wordAmount = 3
    }
    if (windowWidth > 700 && windowWidth < 828) {
        wordAmount = 2
    }
    // To adapt to the resolution
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
    return (
        <div>
            <SignHeader></SignHeader>
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
                                <TypeAnimation
                                    sequence={ [
                                        t("animation-words"),
                                        1000,
                                        t("animation-words-test"),
                                        1000,
                                    ]}
                                    speed={80}
                                    deletionSpeed={80}
                                    style={{ fontSize: '40px', whiteSpace: 'pre-line', color: 'rgb(254, 118, 0)' }}
                                    repeat={Infinity}
                                />
                            </div>
                        </Column>
                    )}
                    {wordAmount === 3 && windowWidth > 768 && (
                        <Column sm={0} md={windowWidth >= 672 && windowWidth <= 768 ? 0 : 4} lg={10} className={"auth-login-column"} style={{
                            backgroundImage: `url(${ backgroundImage })`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                            <div className="header-caption">
                                <TypeAnimation
                                    sequence={ [
                                        t("animation-words-2"),
                                        1000,
                                        t("animation-words-test"),
                                        1000,
                                    ]}
                                    speed={80}
                                    deletionSpeed={80}
                                    style={{ fontSize: '40px', whiteSpace: 'pre-line', color: 'rgb(254, 118, 0)' }}
                                    repeat={Infinity}
                                />
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
                                <TypeAnimation
                                    sequence={ [
                                        t("animation-words-3"),
                                        1000,
                                        'Test to \n for testing',
                                        1000,
                                    ]}
                                    speed={80}
                                    deletionSpeed={80}
                                    style={{ fontSize: '40px', whiteSpace: 'pre-line', color: 'rgb(254, 118, 0)' }}
                                    repeat={Infinity}
                                />
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
