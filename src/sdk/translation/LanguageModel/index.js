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
  const [t, i18n] = useTranslation();
  const languageData = [
    {
      text: 'English',
      value: 'en',
    },
    {
      text: 'German',
      value: 'de',
    },
    {
      text: 'French',
      value: 'fr',
    }
  ];

  const [selectedItem, setItem] = useState({text: 'English', value: 'en'});
  const [serverErrorNotification, setServerErrorNotification] = useState({});
  const [serverNotification, setServerNotification] = useState(false);

  useEffect(() => {
    const userLanguage = languageData.filter((data)=> data.value === user?.languagePreference)
    setItem(userLanguage[0])
  }, [user?.languagePreference])

  const handleLanguageChange = async () => {
    setItem(selectedItem);
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
      primaryButtonText={('submit')}
      secondaryButtonText={('cancel')}
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
          label={'select-language'}
          titleText={'select-language'}
        />
      </div>
    </Modal>
  )
}