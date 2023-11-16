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
                                            'Wir stellen unsere Unternehmensanwendung\n der nächsten Generation vor',
                                            2800,
                                            'Das weltweit erste\n tabellenbasierte ERP-System',
                                            2800,
                                            'Stärken Sie Ihre Daten mit integrierter\n KI für aussagekräftige Erkenntnisse',
                                            2800,
                                            'Machen Sie Ihr Unternehmen zukunftssicher mit\n unserer nahezu unbegrenzt skalierbaren Lösung',
                                            2800,
                                            'Verbessern Sie Ihren Betrieb durch unser\n anpassungsfähiges Pay-per-Use-Preismodell',
                                            2800,
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
                                            'Presentamos nuestra aplicación\n empresarial de próxima generación',
                                            2800,
                                            'El primer sistema ERP del mundo basado\n en hojas de cálculo',
                                            2800,
                                            'Empower your data with integrated\n AI for meaningful insights',
                                            2800,
                                            'Prepare su negocio para el futuro con nuestra\n  solución escalable prácticamente ilimitada',
                                            2800,
                                            'Mejore las operaciones a través de nuestro\n modelo de precios adaptable de pago por uso',
                                            2800,
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
                                            2800,
                                            'The world\'s first spreadsheet-based\n ERP system',
                                            2800,
                                            'Empower your data with integrated\n AI for meaningful insights',
                                            2800,
                                            'Future-proof your business with our\n virtually unlimited scalable solution',
                                            2800,
                                            'Enhance operations through our\n adaptable pay-per-use pricing model',
                                            2800,
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
                                            2800,
                                            'Le premier système ERP basé\n sur un tableur au monde',
                                            2800,
                                            'Renforcez vos données grâce à l\'IA intégrée\n pour obtenir des informations significatives',
                                            2800,
                                            'Préparez votre entreprise pour l’avenir grâce\n à notre solution évolutive pratiquement illimitée',
                                            2800,
                                            'Améliorez vos opérations grâce à notre\n modèle de tarification adaptable à l\'utilisation',
                                            2800,
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
                                            'Wir stellen unsere\n Unternehmensanwendung\n der nächsten Generation\n vor',
                                            2800,
                                            'Das weltweit\n erste tabellenbasierte\n ERP-System',
                                            2800,
                                            'Stärken Sie Ihre\n Daten mit integrierter\n KI für aussagekräftige\n Erkenntnisse',
                                            2800,
                                            'Machen Sie Ihr\n Unternehmen zukunftssicher\n mit unserer nahezu\n unbegrenzt skalierbaren\n Lösung',
                                            2800,
                                            'Verbessern Sie Ihren\n Betrieb durch\n unser anpassungsfähiges\n Pay-per-Use-Preismodell',
                                            2800,
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
                                            2800,
                                            'El primer sistema ERP\n del mundo basado\n en hojas de cálculo',
                                            2800,
                                            'Empower your data\n with integrated AI\n for meaningful insights',
                                            2800,
                                            'Prepare su negocio para el\n futuro con nuestra solución\n escalable prácticamente\n ilimitada',
                                            2800,
                                            'Mejore las operaciones\n a través de nuestro\n modelo de precios\n adaptable de pago\n por uso',
                                            2800,
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
                                            2800,
                                            'The world\'s first\n spreadsheet-based\n ERP system',
                                            2800,
                                            'Empower your data\n with integrated AI\n for meaningful insights',
                                            2800,
                                            'Future-proof your\n business with our\n virtually unlimited\n scalable solution',
                                            2800,
                                            'Enhance operations\n through our\n adaptable pay-per-use\n pricing model',
                                            2800,
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
                                            2800,
                                            'Le premier système\n ERP basé sur un tableur\n au monde',
                                            2800,
                                            'Renforcez vos\n données grâce\n à l\'IA intégrée\n pour obtenir des\n informations significatives',
                                            2800,
                                            'Préparez votre entreprise\n pour l’avenir grâce\n à notre solution évolutive\n pratiquement illimitée',
                                            2800,
                                            'Améliorez vos opérations\n grâce à notre modèle\n de tarification\n adaptable à\n l\'utilisation',
                                            2800,
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
                                                    style={{ width: '100%' }}
                                                    className="login-submit-button bx--btn bx--btn--primary"
                                                    onClick={() => {
                                                        navigate("/signin");
                                                    }}
                                                    disabled={true}
                                                >
                                                    {t("login-button")}
                                                </Button>
                                            </div>
                                            <div style={{ width: '20px' }} />
                                            <div style={{ flex: 1, marginTop: windowWidth < 672 ? '15px' : 0 }}>
                                                <Button
                                                    type="submit"
                                                    size={'md'}
                                                    style={{ width: '100%', marginLeft: 0 }}
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
