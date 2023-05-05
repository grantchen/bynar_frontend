import React from "react";

import { Button, Heading } from "@carbon/react";

import "../Dashboard/Dashboard.scss";
import { NewsInfoCard } from "../Cards/NewsInfoCard/NewsInfoCard.js";
import { ViewUsageCard } from "../Cards/ViewUsageCard/ViewUsageCard";
import { SupportCard } from "../Cards/SupportCard/SupportCard";
import { useTranslation } from "react-i18next";

const DashboardContainer = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="bynar-heading">
        <Heading className="heading">{t("header")}</Heading>
        <Button>{t("create-resource-button")}</Button>
      </div>
      <div className="container">
        <NewsInfoCard />
        <ViewUsageCard />
        <SupportCard />
      </div>
    </>
  );
};

export default DashboardContainer;
