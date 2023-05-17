import React from "react";

import { Button, Heading } from "@carbon/react";

import "../Dashboard/Dashboard.scss";
import { NewsInfoCard } from "../Cards/NewsInfoCard/NewsInfoCard.js";
import { ViewUsageCard } from "../Cards/ViewUsageCard/ViewUsageCard";
import { SupportCard } from "../Cards/SupportCard/SupportCard";
import { useTranslation } from "react-i18next";
import { Add20 } from "@carbon/icons-react";
import { useSearchParams } from "react-router-dom";

const DashboardContainer = () => {
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams()
  return (
    <>
      <div className="bynar-heading">
        <Heading className="heading">{t("header")}</Heading>
        <Button renderIcon={Add20} onClick={() => setSearchParams({openAddUserPanel: true})}>{t("create-resource-button")}</Button>
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
