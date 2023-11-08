import React, {useCallback, useEffect, useState} from "react";
import {Button, Column, Grid, Header, Link,} from "@carbon/react";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../components/media/background.svg';
import "./login.scss";
import { TypeAnimation } from 'react-type-animation';
import SignHeader from "../../components/SignHeader";
import SignFooter from "../../components/SignFooter";

const Home = () => {
    const [showVideo, setShowVideo] = useState(false);
    const [videoBackgroundColor, setVideoBackgroundColor] = useState("white");
    const navigate = useNavigate();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    let wordAmount = 5

    if (windowWidth > 800 && windowWidth < 1059) {
        wordAmount = 3
    }
    if (windowWidth > 700 && windowWidth < 828) {
        wordAmount = 2
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
                                        'Introducing the bynar erp system',
                                        1000,
                                        'Test to for testing',
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
                                        'Introducing the bynar \n erp system',
                                        1000,
                                        'Test to for testing',
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
                                        'Introducing \n the bynar \n erp system',
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
                                        <h2 style={{ fontWeight: 'bold' }}>Get started</h2>
                                        <div className="fields-container">
                                            <div style={{ flex:1 }}>
                                                <Button
                                                    type="submit"
                                                    size={'md'}
                                                    className="login-submit-button bx--btn bx--btn--primary"
                                                    onClick={() => {
                                                        navigate("/signin");
                                                    }}
                                                >
                                                    {"Login"}
                                                </Button>
                                            </div>
                                            <div style={{ width: '20px' }} />
                                            <div style={{ flex: 1, marginTop: windowWidth < 672 ? '15px' : 0 }}>
                                                <Button
                                                    type="submit"
                                                    size={'md'}
                                                    className="login-submit-button bx--btn bx--btn--primary"
                                                    disabled={true}
                                                >
                                                    {"Signup"}
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
