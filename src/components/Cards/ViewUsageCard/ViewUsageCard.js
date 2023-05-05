import { Link } from "@carbon/react";
import { Warning } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import "../ViewUsageCard/ViewUsageCard.scss";
export const ViewUsageCard = () => {
  const { t } = useTranslation();
  return (
    <div className="dashboard-tile">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h5 style={{ maxWidth: "fit-content" }}>
          <strong>{t("usagecard_heading1")}</strong>
        </h5>
        <Link>{t("usagecard_heading2")}</Link>
      </div>
      <br />
      <Warning size="100" style={{ color: "cornflowerblue" }} />
      <div>
        <p>{t("usagecard_heading3")}</p>
      </div>
    </div>
  );
};
