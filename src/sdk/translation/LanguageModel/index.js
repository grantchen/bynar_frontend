import {
    Modal,
    Dropdown,
  } from '@carbon/react';
  import React, { useState} from 'react';
  import { useTranslation } from 'react-i18next';
export const LanguageModel=({ openLanguageModel, setLanguageModelOpen })=>{
    const [t, i18n] = useTranslation();
    let LanguageData = [
    "en",
    "de"
  ];
  const currentLang =localStorage.getItem("lang");
  const [selectedItem, setItem] = useState("en");
  const handleLanguageChange = () => {
      setItem(selectedItem);
      localStorage.setItem("lang",selectedItem);
      i18n.changeLanguage(selectedItem);
    
    setLanguageModelOpen(false);
  }

  const cancelTheme = () => {
    setLanguageModelOpen(false);
  }
  const setLanguage = (selectedItem) => {
    setItem(selectedItem);
  };

  return (
    <Modal
      primaryButtonText={t('submit')}
      secondaryButtonText={t('cancel')}
      open={openLanguageModel}
      onRequestClose={() => cancelTheme()}
      onRequestSubmit={() => handleLanguageChange()}
    >

      <div className="carbon-lang-dropdown">
        <Dropdown
          ariaLabel="lang dropdown"
          id="lang-dropdown"
          items={LanguageData}
          itemToString={(item) => t(item ?? item.value )}
          onChange={(event) => setLanguage(event.selectedItem)}
          selectedItem={selectedItem}
          label={t('select-language')}
          titleText={t('select-language')}
        />
      </div>
    </Modal>
  )
}