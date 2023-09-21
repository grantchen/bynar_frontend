import {useCallback, useState} from "react";
import {
    Header,
    HeaderName,
    Grid,
    Column,
    Button,
    Link,
} from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";
import ibmLogo from "../../components/media/IBM_logo_black.svg";
import ibmHomepageVideo from "../../components/media/IBM_homepage_video.mp4";

const Home = () => {
    const [showVideo, setShowVideo] = useState(false);
    const [videoBackgroundColor, setVideoBackgroundColor] = useState("white");

    const handleShowVideo = useCallback(() => {
        setShowVideo(true);
        setVideoBackgroundColor("black");
    }, []);

    return (
        <div>
            <Header>
                <HeaderName href="http://bynar.tajansoft.com" prefix="">
                    <img src={ibmLogo} style={{marginLeft: 1 + "rem"}} />
                </HeaderName>
            </Header>

            <Grid>
                <Column sm={4} md={8} lg={6}>
                    <div style={{fontSize: 3.7 + "rem", lineHeight: 1.15, marginTop: 7 +"rem"}}>Multiply the</div>
                    <div style={{fontSize: 3.7 + "rem", lineHeight: 1.15}}>power of AI</div>
                    <div style={{fontSize: 3.7 + "rem", lineHeight: 1.15}}>
                        with
                        <strong> watson</strong>
                        <strong style={{color: "blue"}}>x</strong>
                    </div>
                    <div style={{fontSize: 1.45 + "rem", lineHeight: 1.4, marginTop: 23.3 + "rem"}}>IBM’s next-generation AI and data platform is now available for free trial</div>
                    <Button renderIcon={ArrowRight} style={{fontSize: 1 + "rem", marginTop: 2 + "rem"}}>Contac us</Button>
                </Column>

                <Column sm={4} md={8} lg={8}>
                    <div onClick={handleShowVideo} style={{marginTop: 7 + "rem", backgroundColor: videoBackgroundColor}}>
                        {showVideo ? (
                            <video src={ibmHomepageVideo} width="100%" height="722" controls autoPlay />
                        ) : (
                            <img src="https://1.dam.s81c.com/p/0c9c5faa18c5c7cf/watsonx-overview-leadspace-super-hybrid-ui-homepage.png.global.xl_1x1.jpg" style={{width: 100 + "%"}} />
                        )}
                    </div>
                </Column>

                <Column sm={4} md={8} lg={2}>
                    <div style={{marginTop: 7 + "rem"}}>
                        <Link href="#" inline="true">
                            <p style={{fontSize: 0.9 + "rem", color: "gray"}}>What’s new</p>
                            <p style={{fontSize: 1 + "rem"}}>The CEO’s Guide to Generative AI</p>
                            <div style={{marginTop: 1.6 + "rem"}}><ArrowRight size={25} /></div>
                        </Link>

                        <div style={{borderBottom: "1px solid lightgray", marginTop: 1 + "rem", marginBottom: 1.3 + "rem"}} />

                        <Link href="#" inline="true">
                            <p style={{fontSize: 0.9 + "rem", color: "gray"}}>Free download</p>
                            <p style={{fontSize: 1 + "rem"}}>The data quality, AI performance report</p>
                            <div style={{marginTop: 1.6 + "rem"}}><ArrowRight size={25} /></div>
                        </Link>

                        <div style={{borderBottom: "1px solid lightgray", marginTop: 1 + "rem", marginBottom: 1.3 + "rem"}} />

                        <Link href="#" inline="true">
                            <p style={{fontSize: 0.9 + "rem", color: "gray"}}>Free download</p>
                            <p style={{fontSize: 1 + "rem"}}>The data quality, AI performance report</p>
                            <div style={{marginTop: 1.6 + "rem"}}><ArrowRight size={25} /></div>
                        </Link>

                        <div style={{borderBottom: "1px solid lightgray", marginTop: 1 + "rem", marginBottom: 1.3 + "rem"}} />

                        <Link href="#" inline="true">
                            <p style={{fontSize: 0.9 + "rem", color: "gray"}}>Free download</p>
                            <p style={{fontSize: 1 + "rem"}}>The data quality, AI performance report</p>
                            <div style={{marginTop: 1.6 + "rem"}}><ArrowRight size={25} /></div>
                        </Link>
                    </div>
                </Column>
            </Grid>
        </div>
    )
}
export default Home;
