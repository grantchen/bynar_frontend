import React from "react";

import { Button, Heading } from "@carbon/react";

import "../Dashboard/Dashboard.scss";
import { NewsInfoCard } from "../Cards/NewsInfoCard/NewsInfoCard.js";
import { ViewUsageCard } from "../Cards/ViewUsageCard/ViewUsageCard";
import { SupportCard } from "../Cards/SupportCard/SupportCard";
import { useTranslation } from "react-i18next";
import { Add20 } from "@carbon/icons-react";

const DashboardContainer = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="bynar-heading">
        <Heading className="heading">{t("header")}</Heading>
        <Button renderIcon={Add20}>{t("create-resource-button")}</Button>
      </div>
      <div className="dashboard-container">
        <NewsInfoCard />
        <ViewUsageCard />
        <SupportCard />
      </div>
    </>
  );
};

export default DashboardContainer;
