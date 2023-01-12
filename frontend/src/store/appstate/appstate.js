import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
const DELETE_ALL_NOTIFICATION = 'DELETE_ALL_NOTIFICATION';

export function createNotification(title, subtitle, kind) {
  if (!title) title = "<Title>";
  if (!subtitle) subtitle = "<Subtitle>";
  if (!kind) kind = "info";
  return {
    type: CREATE_NOTIFICATION,
    title,
    subtitle,
    kind,
  }
}

export function deleteNotification(index) {
  return {
    type: DELETE_NOTIFICATION,
    index,
  }
}

export function deleteAllNotifications() {
  return {
    type: DELETE_ALL_NOTIFICATION,
  }
}

const defaultState = {
  notifications:[],
};

function appState(state=defaultState, action) {
  switch (action.type) {
    case CREATE_NOTIFICATION:
      return {
        notifications: [
          ...state.notifications,
          {
            title: action.title,
            subtitle: action.subtitle,
            kind: action.kind,
          },
        ]
      };
    case DELETE_NOTIFICATION:
      console.log(action.index);
      const notifications = state.notifications.filter((notif, key) => key !== action.index);
      console.log(notifications);
      return {
        notifications
      };
    case DELETE_ALL_NOTIFICATION:
      state.notifications = [];
      return {...state};
    default:
      return state;
  }
}

const appStateReducers = combineReducers({
  appState
});

const appStateStore = configureStore({
  reducer: appStateReducers,
});

export default appStateStore;
