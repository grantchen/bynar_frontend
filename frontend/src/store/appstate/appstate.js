import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
const DELETE_ALL_NOTIFICATION = 'DELETE_ALL_NOTIFICATION';

const APPLY_DARK_THEME = 'APPLY_DARK_THEME';
const APPLY_lIGHT_THEME = 'APPLY_lIGHT_THEME';

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

export function applyDarkTheme(index) {
  return {
    type: APPLY_DARK_THEME,
  }
}

export function applyLightTheme() {
  return {
    type: APPLY_lIGHT_THEME,
  }
}

const defaultState = {
  theme: 'dark',
  notifications:[],
};

function appState(state=defaultState, action) {
  switch (action.type) {
    case CREATE_NOTIFICATION:
      return {
        ...state,
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
      const notifications = state.notifications.filter((notif, key) => key !== action.index);
      return {
        notifications
      };
    case DELETE_ALL_NOTIFICATION:
      state.notifications = [];
      return {...state};
    case APPLY_DARK_THEME:

      return {
        ...state,
        theme: 'dark',
      };
    case APPLY_lIGHT_THEME:

      return {
        ...state,
        theme: 'light',
      };
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
