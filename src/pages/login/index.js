import React, {useCallback, useEffect, useState} from "react";
import {Button, Column, Grid, Header, Link,} from "@carbon/react";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../components/media/background.svg';
import "./login.scss";
import "../../pages/signin/signin.scss";
import { TypeAnimation } from 'react-type-animation';
import SignHeader from "../../components/SignHeader";

const Home = () => {
    const [showVideo, setShowVideo] = useState(false);
    const [videoBackgroundColor, setVideoBackgroundColor] = useState("white");
    const navigate = useNavigate();
    return (
        <div>
            <SignHeader></SignHeader>
            <div
                className={"auth-login-container"}
            >
                <Grid className={"auth-login-grid"}>
                    <Column sm={1} md={6} lg={10} className={"auth-login-column"} style={{
                        backgroundImage: `url(${ backgroundImage })`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                    }}>
                        <div className="header-caption">
                            <TypeAnimation
                                sequence={[
                                    // Same substring at the start will only be typed once, initially
                                    'Introducing the bynar erp system',
                                    1000,
                                    'Test to for testing',
                                    1000,
                                ]}
                                speed={50}
                                style={{ fontSize: '40px', color: 'rgb(254, 118, 0)' }}
                                repeat={Infinity}
                            />
                        </div>
                    </Column>

                    <Column sm={15} md={8} lg={6} className="auth-login-container">
                        <div className="auth-login-area">
                            <div className="bx--row">
                                <div className="bx--col auth-login-bx">
                                    <div className="fields-container button-container">
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <div style={{ flex: 1 }}>
                                                <Button
                                                    type="submit"
                                                    className="login-submit-button bx--btn bx--btn--primary"
                                                    onClick={() => {
                                                        navigate("/signin");
                                                    }}
                                                >
                                                    {"Login"}
                                                </Button>
                                            </div>
                                            <div style={{ width: '16px' }} />
                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                <Button
                                                    type="submit"
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
                        <footer className="footer">
                            <div className="footer-content">
                                <a href="#">Privacy Policy</a>
                                <div className="footer_link_divider">|</div>
                                <a href="#">Terms of Use</a>
                                <div className="footer_link_divider">|</div>
                                <a href="#">Cookie Preferences</a>
                            </div>
                            <div className="footer_copy_right">Bynar, Inc. or its affiliates. All rights reserved.</div>
                        </footer>
                    </Column>
                </Grid>
            </div>
        </div>
    )
}
export default Home;
