import {
    Header,
    HeaderName,
    Grid,
    Column,
    Button,
    Link,
} from "@carbon/react";
import { ArrowRight } from "@carbon/react/icons";

const Home = () => {
    return (
        <div>
            <Header>
                <HeaderName href="#" prefix="IBM" />
            </Header>

            <Grid>
                <Column sm={4} md={8} lg={6}>
                    <div style={{fontSize: 3.7 + "rem", marginTop: 7.4 +"rem"}}>Multiply the</div>
                    <div style={{fontSize: 3.7 + "rem"}}>power of AI</div>
                    <div style={{fontSize: 3.7 + "rem"}}>
                        with
                        <strong> watson</strong>
                        <strong style={{color: "blue"}}>x</strong>
                    </div>
                    <div style={{fontSize: 1.4 + "rem", marginTop: 18 + "rem"}}>IBM’s next-generation AI and data platform is now available for free trial</div>
                    <Button renderIcon={ArrowRight} style={{marginTop: 2 + "rem"}}>Contac us</Button>
                </Column>

                <Column sm={4} md={8} lg={8}>
                    <div style={{marginTop: 7.4 + "rem"}}>
                        <video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" controls style={{width: 100 + "%", height: 100 + "%"}} />
                    </div>
                </Column>

                <Column sm={4} md={8} lg={2}>
                    <div style={{fontSize: 3.7 + "rem", marginTop: 7.4 + "rem"}}>
                        <Link href="#" inline="true">
                            <p style={{color: "gray"}}>What’s new</p>
                            <p>The CEO’s Guide to Generative AI</p>
                            <div style={{marginTop: 1.6 + "rem"}}><ArrowRight size={25} /></div>
                        </Link>

                        <div style={{borderBottom: "1px solid lightgray", marginTop: 1.3 + "rem", marginBottom: 1.3 + "rem"}} />

                        <Link href="#" inline="true">
                            <p style={{color: "gray"}}>Free download</p>
                            <p>The data quality, AI performance report</p>
                            <div style={{marginTop: 1.6 + "rem"}}><ArrowRight size={25} /></div>
                        </Link>

                        <div style={{borderBottom: "1px solid lightgray", marginTop: 1.3 + "rem", marginBottom: 1.3 + "rem"}} />

                        <Link href="#" inline="true">
                            <p style={{color: "gray"}}>Free download</p>
                            <p>The data quality, AI performance report</p>
                            <div style={{marginTop: 1.6 + "rem"}}><ArrowRight size={25} /></div>
                        </Link>

                        <div style={{borderBottom: "1px solid lightgray", marginTop: 1.3 + "rem", marginBottom: 1.3 + "rem"}} />

                        <Link href="#" inline="true">
                            <p style={{color: "gray"}}>Free download</p>
                            <p>The data quality, AI performance report</p>
                            <div style={{marginTop: 1.6 + "rem"}}><ArrowRight size={25} /></div>
                        </Link>
                    </div>
                </Column>
            </Grid>
        </div>
    )
}
export default Home;
