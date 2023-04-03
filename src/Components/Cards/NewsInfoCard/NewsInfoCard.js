import '../NewsInfoCard/NewsInfoCard.scss'
import {useTranslation} from "react-i18next";
export const NewsInfoCard =()=>{
    const {t} = useTranslation();
    return(
        <div className="newsinfocard">
         <div className="newsinfocard_heading">
            <p>{t('newsinfocard_heading1')}</p>
            <p>{t('newsinfocard_heading2')}</p>
         </div>
         <div className="newsinfocard_headingone">
         <p>{t('newsinfocard_heading3')}</p>
         </div>
        </div>
    )
}