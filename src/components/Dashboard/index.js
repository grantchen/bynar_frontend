import React from "react";
import { Button, Heading,IconButton } from "@carbon/react";
import "../Dashboard/Dashboard.scss";
import { NewsInfoCard } from "../Cards";
import { ViewUsageCard } from "../Cards";
import { SupportCard } from "../Cards";
import { useTranslation } from "react-i18next";
import { Add } from "@carbon/react/icons";
import { useMobile } from "../../sdk";
import { SubscribeCloseTabMessage } from "../../sdk/tabMessage";

// Dashboard is the home content of the application.
const Dashboard = () => {
    const { t } = useTranslation();
    const isMobile = useMobile()

    return (
        <div className="dashboard-box">
            <SubscribeCloseTabMessage></SubscribeCloseTabMessage>
            <div className="bynar-heading">
                <Heading className="heading">{t("header")}</Heading>
                    {isMobile ? (
                        <IconButton label="">
                            <Add />
                        </IconButton>
                    ) : (
                    <Button renderIcon={Add}>{t("create-resource-button")}</Button>
                )}
            </div>
            <div className="dashboard-container-box">
                <NewsInfoCard />
                <ViewUsageCard />
                <SupportCard style={{ marginRight: "0px", }} />
            </div>
        </div >
    );
};

export default Dashboard;
