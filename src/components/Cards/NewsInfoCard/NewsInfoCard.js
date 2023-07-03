import "../NewsInfoCard/NewsInfoCard.scss";
import { useTranslation } from "react-i18next";
// import { Warning } from "@carbon/react/icons";

export const NewsInfoCard = () => {
  const { t } = useTranslation();
  return (
    <div className="newsinfocard">
      <div className="newsinfocard_heading">
        <p>
          <strong>{t("newsinfocard_heading1")}</strong>
        </p>

        {/* <Warning size="100" style={{ color: "cornflowerblue" }} /> */}

        <p style={{ cursor: "pointer" }}>{t("newsinfocard_heading2")}</p>
      </div>
      <div className="newsinfocard_headingone">
        <p>{t("newsinfocard_heading3")}</p>
      </div>
    </div>
  );
};
