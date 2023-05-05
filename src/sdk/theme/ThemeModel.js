import {
  Modal,
  Dropdown,
} from '@carbon/react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';


export const ThemeModel = React.memo(({ openModel, setModelOpen }) => {
  const {t,i18n}=useTranslation();
  const themeData = [
    {
      text: t('white'),
      value: 'carbon-theme--white',
    },
    {
      text: t('gray'),
      value: 'carbon-theme--g90',
    }
  ];
 
  


  const [selectedTheme, setItem] = useState(themeData[localStorage.getItem("theme") ==="carbon-theme--white"?0:1]);

  const handleTheme = () => {
    const bodyElement = document.body;
    bodyElement.className = selectedTheme.value;
    if (selectedTheme.value === "carbon-theme--g90") {
      setItem(themeData[1]);
      localStorage.setItem("theme", themeData[1].value)
    }
    else if (selectedTheme.value === "carbon-theme--white") {
      setItem(themeData[0]);
      localStorage.setItem("theme", themeData[0].value)
    }
    setModelOpen(false);
  }

  const cancelTheme = () => {
    const bodyElement = document.body;
    const currentTheme = localStorage.getItem("theme");
    if (selectedTheme.value !== currentTheme) {
      if (currentTheme === "carbon-theme--g90") {
        setItem(themeData[1]);
        localStorage.setItem("theme", themeData[1].value)
        bodyElement.className = themeData[1].value;
      }
      else {
        setItem(themeData[0]);
        localStorage.setItem("theme", themeData[0].value)
        bodyElement.className = themeData[0].value;
      }
    }
    setModelOpen(false);
  }
  const setTheme = (selectedTheme) => {
    const bodyElement = document.body;
    bodyElement.className = selectedTheme.selectedItem.value;
    setItem(selectedTheme.selectedItem);
  };

  useEffect(()=>{   
   const index = localStorage.getItem("theme") ==="carbon-theme--white"?0:1;
   if(themeData[index].text !==selectedTheme.text  && !openModel)
   {
    setItem(themeData[index]);
   }
  },[themeData])

  
  return (
    <Modal
      primaryButtonText={t('submit')}
      secondaryButtonText={t('cancel')}
      open={openModel}
      onRequestClose={() => cancelTheme()}
      onRequestSubmit={() => handleTheme()}
    >

      <div className="carbon-theme-dropdown">
        <Dropdown
          ariaLabel="Theme dropdown"
          id="theme-dropdown"
          items={themeData}
          selectedItem={selectedTheme}
          itemToString={(item) => (item ? item.text : "")}
          onChange={(event) => setTheme(event)}
          label={t('select-theme')}
          titleText={t('select-theme')}
        />
      </div>
    </Modal>
  )
})