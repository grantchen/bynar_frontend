import { useEffect } from "react";

// close tab key
const closeTabKey = 'close-tab';

// send message
export const sendTabMessage = (key, message = {}, to = null) => {
  window.localStorage.setItem(key, JSON.stringify({
    from: window.name,
    to: to,
    message: message,
  }));
  window.localStorage.removeItem(key);
}

// send close tab message
export const sendCloseTabMessage = (to) => {
  sendTabMessage(closeTabKey, {}, to)
}

// parse message
export const parseTabMessage = (e, key, subscribe) => {
  if (e.key !== key) {
    return
  }

  if (!e.newValue) {
    return
  }

  const data = JSON.parse(e.newValue);
  subscribe(data, e)
}

// subscribe message
export const SubscribeTabMessage = ({subscribe}) => {
  useEffect(() => {
    setWindowName()
  }, []);

  useEffect(() => {
    console.log('[Storage Subscribe] subscribe tab message');
    window.addEventListener("storage", subscribe);

    return () => {
      console.log('[Storage Subscribe] unsubscribe tab message');
      window.addEventListener("storage", subscribe);
    }
  }, []);

  return (<></>)
}

// subscribe close tab message
export const SubscribeCloseTabMessage = () => {
  const subscribe = (e) => {
    parseTabMessage(e, closeTabKey, (data, e) => {
      // should close current tab
      if (data?.to === window.name) {
        // Scripts may close only the windows that were opened by them.
        console.log('try to close tab')
        window.close()
      }
    })
  }

  return SubscribeTabMessage({subscribe})
}

// set window name to current timestamp
const setWindowName = () => {
  if (!window.name) {
    window.name = String(+(new Date));
  }
}
