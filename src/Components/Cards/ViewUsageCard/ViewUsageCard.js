import {
    Tile,
    Link,
  } from '@carbon/react';
  import { Warning } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import '../ViewUsageCard/ViewUsageCard.scss'
export const ViewUsageCard=()=>{
   
    const {t}=useTranslation();
    return(
        <div className='dashboard-tile'>
            <div className='bynar-tile-header' style={{ 'height': '1rem', 'width': '100%' }} >
              <h5 style={{ 'maxWidth': 'fit-content', 'float': 'left' }} ><strong>{t('usagecard_heading1')}</strong></h5>
              <Link style={{ 'float':'right' }} >{t('usagecard_heading2')}</Link>
            </div>
            <br/>
            <div className='bynar-tile-content-area' >
              <Warning size='100' style={{ 'margin': 'auto', 'color': 'cornflowerblue' }} />
              <p>{t('usagecard_heading3')}</p>
            </div>
          </div>
    )
}