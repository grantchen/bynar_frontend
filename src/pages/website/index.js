import React, { useEffect, useState} from "react";
import {Button, Column, Grid, Tooltip} from "@carbon/react";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../components/media/background.svg';
import "./website.scss";
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
    const [showText, setShowText] = useState(false);
    const label = 'Occasionally, services are updated in a specified time window to ensure no down time for customers.';
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        const timeout = setTimeout(() => {
            setShowText(true);
        }, 600); // Adjust the delay time according to your preference
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
                                <p className="bynar-style">{t("introducing-bynar")}</p>
                                {showText && language === "de" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Die Unternehmensanwendung der nächsten\n Generation',
                                            2800,
                                            'Das weltweit erste tabellenbasierte ERP-System',
                                            2800,
                                            'Stärken Sie Ihren Betrieb mit integrierter\n KI für aussagekräftige Erkenntnisse',
                                            2800,
                                            'Machen Sie Ihr Unternehmen zukunftssicher mit\n unserer nahezu unbegrenzt skalierbaren\n Anwendungslösung',
                                            2800,
                                            'Steigern Sie die Effizienz und senken Sie\n die Kosten mit unserem skalierbaren\n Pay-per-Use-Preismodell',
                                            2800,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={false}
                                    />
                                )}
                                {showText && language === "es" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'La aplicación empresarial de próxima generación',
                                            2800,
                                            'El primer sistema ERP del mundo basado\n en hojas de cálculo',
                                            2800,
                                            'Potencie sus operaciones con IA integrada\n para obtener información valiosa',
                                            2800,
                                            'Prepare su negocio para el futuro con nuestra\n solución de aplicaciones escalable\n prácticamente ilimitada',
                                            2800,
                                            'Aumente la eficiencia y reduzca los costos con\n nuestro modelo de precios escalable de pago\n por uso',
                                            2800,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={false}
                                    />
                                )}
                                {showText && language === "en" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'The next-generation enterprise application',
                                            2800,
                                            'World\'s first spreadsheet-based ERP system',
                                            2800,
                                            'Empower your operations with\n integrated AI for meaningful insights',
                                            2800,
                                            'Future-proof your business with our\n virtually limitless scalable application solution',
                                            2800,
                                            'Boost efficiency and reduce costs with\n our scalable pay-per-use pricing model',
                                            2800,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={false}
                                    />
                                )}
                                {showText && language === "fr" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'L\'application d\'entreprise de nouvelle génération',
                                            2800,
                                            'Le premier système ERP basé sur une feuille\n de calcul au monde',
                                            2800,
                                            'Renforcez vos opérations grâce à l\'IA intégrée\n pour obtenir des informations significatives',
                                            2800,
                                            'Préparez votre entreprise pour l’avenir grâce\n à notre solution d’applications évolutive\n pratiquement illimitée',
                                            2800,
                                            'Améliorez l\'efficacité et réduisez les coûts grâce\n à notre modèle de tarification évolutif\n à l\'utilisation',
                                            2800,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={false}
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
                                    <p className="bynar-style">{t("introducing-bynar")}</p>
                                </p>
                                {showText && language === "de" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'Die\n Unternehmensanwendung\n der nächsten Generation',
                                            2800,
                                            'Das weltweit erste\n tabellenbasierte\n ERP-System',
                                            2800,
                                            'Stärken Sie Ihren\n Betrieb mit integrierter\n KI für aussagekräftige\n Erkenntnisse',
                                            2800,
                                            'Machen Sie Ihr\n Unternehmen\n zukunftssicher mit\n unserer nahezu\n unbegrenzt skalierbaren\n Anwendungslösung',
                                            2800,
                                            'Steigern Sie die\n Effizienz und senken\n Sie die Kosten mit\n unserem skalierbaren\n Pay-per-Use-Preismodell',
                                            2800,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={false}
                                    />
                                )}
                                {showText && language === "es" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'La aplicación\n empresarial de\n próxima generación',
                                            2800,
                                            'El primer sistema ERP\n del mundo basado en\n hojas de cálculo',
                                            2800,
                                            'Potencie sus\n operaciones con IA\n integrada para obtener\n información valiosa',
                                            2800,
                                            'Prepare su negocio\n para el futuro con\n nuestra solución de\n aplicaciones escalable\n prácticamente ilimitada',
                                            2800,
                                            'Aumente la eficiencia\n y reduzca los costos\n con nuestro modelo de\n precios escalable\n de pago por uso',
                                            2800,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={false}
                                    />
                                )}
                                {showText && language === "en" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'The next-generation\n enterprise application',
                                            2800,
                                            'World\'s first\n spreadsheet-based\n ERP system',
                                            2800,
                                            'Empower your operations\n with integrated AI for\n meaningful insights',
                                            2800,
                                            'Future-proof your\n business with our\n virtually limitless scalable\n application solution',
                                            2800,
                                            'Boost efficiency\n and reduce costs\n with our scalable\n pay-per-use pricing model',
                                            2800,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={false}
                                    />
                                )}
                                {showText && language === "fr" && (
                                    <TypeAnimation
                                        sequence={ [
                                            'L\'application\n d\'entreprise de\n nouvelle génération',
                                            2800,
                                            'Le premier système ERP\n basé sur une feuille de\n calcul au monde',
                                            2800,
                                            'Renforcez vos\n opérations grâce\n à l\'IA intégrée pour\n obtenir des\n informations significatives',
                                            2800,
                                            'Préparez votre\n entreprise pour\n l’avenir grâce à notre\n solution d’applications\n évolutive pratiquement\n illimitée',
                                            2800,
                                            'Améliorez l\'efficacité\n et réduisez les coûts\n grâce à notre modèle\n de tarification évolutif\n à l\'utilisation',
                                            2800,
                                        ]}
                                        speed={75}
                                        deletionSpeed={99}
                                        className={"animation-type"}
                                        repeat={Infinity}
                                        omitDeletionAnimation={false}
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
                                                <Tooltip label="Coming soon" align="bottom-left">
                                                    <Button
                                                        type="submit"
                                                        size={'md'}
                                                        style={{ width: '100%' }}
                                                        className="login-submit-button bx--btn bx--btn--primary"
                                                        title="Coming soon"
                                                    >
                                                        {t("login-button")}
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                            <div style={{ width: '20px' }} />
                                            <div style={{ flex: 1, marginTop: windowWidth < 672 ? '15px' : 0 }}>
                                                <Tooltip label="Coming soon" align="bottom-left">
                                                    <Button
                                                        type="submit"
                                                        size={'md'}
                                                        style={{ width: '100%', marginLeft: 0 }}
                                                        className="login-submit-button bx--btn bx--btn--primary "
                                                    >
                                                        {t("sign-up-button")}
                                                    </Button>
                                                </Tooltip>
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
