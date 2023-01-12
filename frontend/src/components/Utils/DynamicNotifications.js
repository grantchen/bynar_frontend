import React, { useState } from 'react';

import {
  ToastNotification,
} from '@carbon/react';
import { Warning, InformationDisabled } from '@carbon/react/icons';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNotification } from '../../store/appstate/appstate';

const DynamicNotifications = () => {
  const notifications = useSelector(state => state.appState.notifications);

  return (<div className="dynamic-notification-wrapper" >
    {
      notifications.map((notification, index) => (
        <ToastNotification
          className="dynamic-notification-element"
          onClose={function noRefCheck(){}}
          onCloseButtonClick={function noRefCheck(){}}
          statusIconDescription="notification"
          subtitle={notification.subtitle}
          title={notification.title}
          kind={notification.kind}
          key={index}
        />
      ))
    }
  </div>);
};

export default DynamicNotifications;