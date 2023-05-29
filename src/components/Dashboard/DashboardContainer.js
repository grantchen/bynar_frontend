import React from "react";

import { Button, Heading } from "@carbon/react";

import "../Dashboard/Dashboard.scss";
import { NewsInfoCard } from "../Cards/NewsInfoCard/NewsInfoCard.js";
import { ViewUsageCard } from "../Cards/ViewUsageCard/ViewUsageCard";
import { SupportCard } from "../Cards/SupportCard/SupportCard";
import { useTranslation } from "react-i18next";
import { Add20 } from "@carbon/icons-react";
import { useMobile } from "../../sdk";
import { ExpressiveCard } from "@carbon/ibm-products";

const DashboardContainer = () => {
    const { t } = useTranslation();
    const isMobile = useMobile();

    return (
        <div className="dashboard-box">
            <div className="bynar-heading">
                <Heading className="heading">{t("header")}</Heading>
                <Button
                    renderIcon={Add20}
                    hasIconOnly={isMobile ? true : false}
                >
                    {t("create-resource-button")}
                </Button>
            </div>
            <div className="dashboard-container-box">
                <NewsInfoCard />
                <ViewUsageCard />
                <SupportCard style={{ marginRight: "0px" }} />
            </div>
        </div>
    );
};

export default DashboardContainer;
