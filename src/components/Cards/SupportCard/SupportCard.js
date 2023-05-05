import "../SupportCard/SupportCard.scss";
import { Link } from "@carbon/react";
import { Warning } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
export const SupportCard = () => {
  const { t } = useTranslation();
  return (
    <div className="dashboard-tile">
      <div className="bynar-tile-header">
        <h5 style={{ maxWidth: "fit-content", float: "left" }}>
          <strong>{t("supportcard_heading1")}</strong>
        </h5>
        <Link style={{ float: "right" }}>{t("supportcard_heading2")}</Link>
      </div>
      <br />
      <div className="bynar-tile-content-area">
        <Warning
          size="100"
          style={{ margin: "auto", color: "cornflowerblue" }}
        />
        <p>{t("supportcard_heading3")}</p>
      </div>
    </div>
  );
};
