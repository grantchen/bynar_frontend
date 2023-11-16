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
                                <p>
                                    <span className={"bynar-style"}>bynar</span>
                                    <span className={"erp-style"}>ERP</span>
                                </p>
                                {language === "de" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Wir stellen unsere\n Unternehmensanwendung der nächsten\n Generation vor',
                                            2000,
                                            'Das weltweit erste\n tabellenbasierte ERP-System',
                                            2000,
                                            'Stärken Sie Ihre Daten mit integrierter\n KI für aussagekräftige Erkenntnisse',
                                            2000,
                                            'Machen Sie Ihr Unternehmen\n zukunftssicher mit unserer nahezu\n unbegrenzt skalierbaren Lösung',
                                            2000,
                                            'Verbessern Sie Ihren Betrieb durch\n unser anpassungsfähiges\n Pay-per-Use-Preismodell',
                                            2000,
                                        ]}
                                        speed={75}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={true}
                                    />
                                )}
                                {language === "es" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Presentamos nuestra aplicación empresarial\n de próxima generación',
                                            2000,
                                            'El primer sistema ERP del mundo basado\n en hojas de cálculo',
                                            2000,
                                            'Empower your data with integrated\n AI for meaningful insights',
                                            2000,
                                            'Prepare su negocio para el futuro con\n nuestra solución escalable\n prácticamente ilimitada',
                                            2000,
                                            'Mejore las operaciones a través de nuestro\n modelo de precios adaptable de pago por uso',
                                            2000,
                                        ]}
                                        speed={75}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={true}
                                    />
                                )}
                                {language === "en" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Introducing our next-gen\n enterprise application',
                                            2000,
                                            'The world\'s first spreadsheet-based\n ERP system',
                                            2000,
                                            'Empower your data with integrated\n AI for meaningful insights',
                                            2000,
                                            'Future-proof your business with our\n virtually unlimited scalable solution',
                                            2000,
                                            'Enhance operations through our\n adaptable pay-per-use pricing model',
                                            2000,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={true}
                                    />
                                )}
                                {language === "fr" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Présentation de notre application\n d\'entreprise de nouvelle génération',
                                            2000,
                                            'Le premier système ERP basé\n sur un tableur au monde',
                                            2000,
                                            'Renforcez vos données grâce\n à l\'IA intégrée pour obtenir\n des informations significatives',
                                            2000,
                                            'Préparez votre entreprise pour\n l’avenir grâce à notre solution\n évolutive pratiquement illimitée',
                                            2000,
                                            'Améliorez vos opérations grâce\n à notre modèle de tarification\n adaptable à l\'utilisation',
                                            2000,
                                        ]}
                                        speed={75}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={true}
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
                                <p>
                                    <span className={"bynar-style"}>bynar</span>
                                    <span className={"erp-style"}>ERP</span>
                                </p>
                                {language === "de" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Wir stellen unsere\n Unternehmensanwendung der\n nächsten Generation vor',
                                            2000,
                                            'Das weltweit\n erste tabellenbasierte\n ERP-System',
                                            2000,
                                            'Stärken Sie Ihre\n Daten mit integrierter\n KI für aussagekräftige\n Erkenntnisse',
                                            2000,
                                            'Machen Sie Ihr\n Unternehmen zukunftssicher mit\n unserer nahezu unbegrenzt\n skalierbaren Lösung',
                                            2000,
                                            'Verbessern Sie Ihren\n Betrieb durch unser\n anpassungsfähiges Pay-per-Use-Preismodell',
                                            2000,
                                        ]}
                                        speed={75}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={true}
                                    />
                                )}
                                {language === "es" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Presentamos nuestra\n aplicación empresarial\n de próxima generación',
                                            2000,
                                            'El primer sistema ERP\n del mundo basado\n en hojas de cálculo',
                                            2000,
                                            'Empower your data\n with integrated AI\n for meaningful insights',
                                            2000,
                                            'Prepare su negocio para el\n futuro con nuestra solución\n escalable prácticamente\n ilimitada',
                                            2000,
                                            'Mejore las operaciones\n a través de nuestro\n modelo de precios adaptable\n de pago por uso',
                                            2000,
                                        ]}
                                        speed={75}
                                        deletionSpeed={80}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={true}
                                    />
                                )}
                                {language === "en" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Introducing our\n next-gen enterprise\n application',
                                            2000,
                                            'The world\'s first\n spreadsheet-based\n ERP system',
                                            2000,
                                            'Empower your data\n with integrated AI\n for meaningful insights',
                                            2000,
                                            'Future-proof your business\n with our virtually\n unlimited scalable solution',
                                            2000,
                                            'Enhance operations\n through our adaptable\n pay-per-use pricing model',
                                            2000,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={true}
                                    />
                                )}
                                {language === "fr" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Présentation de notre\n application d\'entreprise de\n nouvelle génération',
                                            2000,
                                            'Le premier système\n ERP basé sur un tableur\n au monde',
                                            2000,
                                            'Renforcez vos\n données grâce\n à l\'IA intégrée\n pour obtenir des\n informations significatives',
                                            2000,
                                            'Préparez votre\n entreprise pour\n l’avenir grâce à\n notre solution\n évolutive pratiquement\n illimitée',
                                            2000,
                                            'Améliorez vos\n opérations grâce\n à notre modèle\n de tarification\n adaptable à\n l\'utilisation',
                                            2000,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={true}
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
                                        <h1 className="form-mainHeading">{t("get-started")}</h1>
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
