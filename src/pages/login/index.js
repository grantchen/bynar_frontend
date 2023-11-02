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
    const [activeStep, setActiveStep] = useState(4);
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        // 添加窗口大小改变事件监听器
        window.addEventListener('resize', handleResize);

        // 在组件卸载时移除事件监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // 空数组表示仅在组件挂载和卸载时执行

    // 根据窗口宽度决定 md 属性的值
    let mdValue1 = 4;
    let mdValue2 = 4;
    let step = 5
    if (windowWidth > 672 && windowWidth < 768) {
        mdValue1 = 3;
        mdValue2 = 5;
    }
    if (windowWidth > 800 && windowWidth < 1059) {
        step = 3
    }
    if (windowWidth > 700 && windowWidth < 828) {
        step = 2
    }
    if (windowWidth < 700 ) {
        step = 1
    }
    return (
        <div>
            <SignHeader></SignHeader>
            <div
                className={"auth-login-container"}
            >
                <Grid className={"auth-login-grid"}>
                    {step ===5 && (
                        <Column sm={0} md={mdValue1} lg={10} className={"auth-login-column"} style={{
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
                    {step ===3 && (
                        <Column sm={0} md={mdValue1} lg={10} className={"auth-login-column"} style={{
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

                    {step ===2 && (
                        <Column sm={0} md={mdValue1} lg={10} className={"auth-login-column"} style={{
                            backgroundImage: `url(${ backgroundImage })`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                            <div className="header-caption">
                                <TypeAnimation
                                    sequence={ [
                                        'Introducing \n the bynar erp \n system',
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

                    {step ===1 && (
                        <Column sm={0} md={mdValue1} lg={10} className={"auth-login-column"} style={{
                            backgroundImage: `url(${ backgroundImage })`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                            backgroundRepeat: 'no-repeat',
                        }}>
                            <div className="header-caption">
                                <TypeAnimation
                                    sequence={ [
                                        'Introducing \n the \n bynar erp \n system',
                                        1000,
                                        'Test \n to \n for \n testing',
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

                    <Column sm={4} md={mdValue2} lg={6} className="auth-login-container">
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
                                            <div style={{ flex: 1 }}>
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
