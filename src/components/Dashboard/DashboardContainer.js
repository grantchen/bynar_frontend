import React from "react";

import { Button, Heading } from "@carbon/react";

import "../Dashboard/Dashboard.scss";
import { NewsInfoCard } from "../Cards/NewsInfoCard/NewsInfoCard.js";
import { ViewUsageCard } from "../Cards/ViewUsageCard/ViewUsageCard";
import { SupportCard } from "../Cards/SupportCard/SupportCard";
import { useTranslation } from "react-i18next";
import { Add } from "@carbon/react/icons";
import { useMobile } from "../../sdk";
import { SubscribeCloseTabMessage } from "../../sdk/tabMessage";

const DashboardContainer = () => {
    const { t } = useTranslation();
    const isMobile = useMobile()

    return (
        <div className="dashboard-box">
            <SubscribeCloseTabMessage></SubscribeCloseTabMessage>
            <div className="bynar-heading">
                <Heading className="heading">{t("header")}</Heading>
                <Button renderIcon={Add}
                    hasIconOnly={isMobile ? true : false}>{t("create-resource-button")}</Button>
            </div>
            <div className="dashboard-container-box">
                <NewsInfoCard />
                <ViewUsageCard />
                <SupportCard style={{ marginRight: "0px", }} />
            </div>
        </div >
    );
};

export default DashboardContainer;
