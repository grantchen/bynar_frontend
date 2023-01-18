import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import DashboardContent from '../../content/Dashboard/DashboardContent';


const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
const DELETE_ALL_NOTIFICATION = 'DELETE_ALL_NOTIFICATION';

const OPEN_TAB = 'OPEN_TAB';
const CLOSE_TAB = 'CLOSE_TAB';
const SET_SELECTED_TAB = 'SET_SELECTED_TAB';

const APPLY_DARK_THEME = 'APPLY_DARK_THEME';
const APPLY_lIGHT_THEME = 'APPLY_lIGHT_THEME';

export function openNewTab(id, title, component) {
  return {
    type: OPEN_TAB,
    id, 
    title,
    component,
  }
}

export function closeTab(index) {
  return {
    type: CLOSE_TAB,
    index,
  }
}

export function setSelectedTab(value) {
  return {
    type: SET_SELECTED_TAB,
    value,
  }
}

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
  tabs: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      component: <DashboardContent />,
    },
  ],
  selectedTab: 0,
};

function appState(state=defaultState, action) {
  switch (action.type) {
    case OPEN_TAB:
      return {
        ...state,
        tabs: [
          ...state.tabs,
          {
            id: action.id,
            title: action.title,
            component: action.component,
          },
        ]
      };
    case CLOSE_TAB:
      const tabs = state.tabs.filter((notif, key) => key !== action.index);
      return {
        ...state,
        tabs: [
          ...tabs
        ]
      };
    case SET_SELECTED_TAB:
      return {
        ...state,
        selectedTab: action.value,
      };
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
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

export default appStateStore;
