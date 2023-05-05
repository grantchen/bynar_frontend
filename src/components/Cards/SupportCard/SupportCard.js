import "../SupportCard/SupportCard.scss";
import { Link } from "@carbon/react";
import { Warning } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
export const SupportCard = () => {
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
          <strong>{t("supportcard_heading1")}</strong>
        </h5>
        <Link>{t("supportcard_heading2")}</Link>
      </div>
      <br />
      <Warning size="100" style={{ color: "cornflowerblue" }} />
      <div>
        <p>{t("supportcard_heading3")}</p>
      </div>
    </div>
  );
};
