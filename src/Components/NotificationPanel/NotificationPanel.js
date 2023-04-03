import { NotificationsPanel } from '@carbon/ibm-products';
import React, { useState } from 'react';
import { Button } from 'carbon-components-react'; 
export const NotificationPanel=({open,setOpen,setNotificationsData, notificationsData})=>{
    return(
        <div>
        <NotificationsPanel
          open={open}
          onClickOutside={() => setOpen(false)}
          data={notificationsData}
          onDoNotDisturbChange={(event) =>
            console.log('Toggled do not disturb', event)
          }
          onViewAllClick={() => console.log('Clicked view all button')}
          onSettingsClick={() => console.log('Clicked settings gear button')}
          onDismissAllNotifications={() => setNotificationsData([])}
          onDismissSingleNotification={({ id }) => {
            let tempData = [...notificationsData];
            tempData = tempData.filter((item) => item.id !== id);
            setNotificationsData(tempData);
          }}
        />
      </div>
    )
}