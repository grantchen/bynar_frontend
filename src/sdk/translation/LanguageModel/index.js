import {
  Modal,
  Dropdown,
} from '@carbon/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../AuthContext';
import { ToastNotification } from 'carbon-components-react';
export const LanguageModel = ({ openLanguageModel, setLanguageModelOpen }) => {

  const { updateUserLanguagePreference, user } = useAuth();
  const [t, i18n, ready] = useTranslation();

  console.log(ready, i18n)
  const languageData = [
    {
      text: t('english'),
      value: 'en',
    },
    {
      text: t('german'),
      value: 'de',
    },
    {
      text: t('french'),
      value: 'fr',
    },
    {
      text: t('spanish'),
      value: 'es',
    }
  ];

  

  const [selectedItem, setItem] = useState(languageData[0]);
  const [serverErrorNotification, setServerErrorNotification] = useState({});
  const [serverNotification, setServerNotification] = useState(false);

  useEffect(() => {
    const userLanguage = languageData.filter((data)=> data.value === user?.languagePreference)
    console.log(userLanguage,"api",userLanguage[0])
    setItem(userLanguage[0])
  }, [user?.languagePreference])


  const handleLanguageChange = async () => {
    try {
      await updateUserLanguagePreference({ languagePreference: selectedItem?.value });
      setLanguageModelOpen(false);
    } catch (e) {
      setServerErrorNotification({ message: e.message, status: "error" });
      setServerNotification(true);
    }  
  }


  const closeLanguageModal = () => {
    setLanguageModelOpen(false);
    setServerErrorNotification({ });
    setServerNotification(false);
  }

  const setLanguage = (selectedItem) => {
    setItem(selectedItem);
  };

  return (
    <Modal
      primaryButtonText={t('submit')}
      secondaryButtonText={t('cancel')}
      open={openLanguageModel}
      onRequestClose={() => closeLanguageModal()}
      onRequestSubmit={() => handleLanguageChange()}
    >
      {serverNotification && (
        <ToastNotification
          className="error-notification-box"
          iconDescription="describes the close button"
          subtitle={serverErrorNotification?.message}
          onCloseButtonClick={() => {
            setServerErrorNotification({
            });
            setServerNotification(false);
          }}
          timeout={0}
          title={""}
          kind={serverErrorNotification?.status}
        />
      )}

      <div className="carbon-lang-dropdown">
        <Dropdown
          ariaLabel="lang dropdown"
          id="lang-dropdown"
          items={languageData}
          itemToString={(item) => ( item.text)}
          onChange={(event) => setLanguage(event.selectedItem)}
          selectedItem={selectedItem}
          label={t('select-language')}
          titleText={t('select-language')}
        />
      </div>
    </Modal>
  )
}