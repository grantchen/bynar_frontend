import {
  Dropdown,
  InlineLoading,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@carbon/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../AuthContext";
import { ToastNotification } from "carbon-components-react";
import './LanguageModal.scss'
export const LanguageModel = ({ openLanguageModel, setLanguageModelOpen }) => {
  const { updateUserLanguagePreference, user } = useAuth();
  const [t, i18n, ready] = useTranslation();

  console.log(ready, i18n);
  const languageData = [
      {
          text: t("english"),
          value: "en",
      },
      {
          text: t("german"),
          value: "de",
      },
      {
          text: t("french"),
          value: "fr",
      },
      {
          text: t("spanish"),
          value: "es",
      },
  ];

  const [selectedItem, setItem] = useState(languageData[0]);
  const [serverErrorNotification, setServerErrorNotification] = useState({});
  const [serverNotification, setServerNotification] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const userLanguage = languageData.filter(
          (data) => data.value === user?.languagePreference
      );
      setItem(userLanguage[0]);
  }, [user?.languagePreference]);

  const handleLanguageChange = async () => {
      try {
          setLoading(true);
          await updateUserLanguagePreference({
              languagePreference: selectedItem?.value,
          });
          setLanguageModelOpen(false);
          setLoading(false);
      } catch (e) {
          setServerErrorNotification({ message: e.message, status: "error" });
          setServerNotification(true);
          setLoading(false);
      }
  };

  const closeLanguageModal = () => {
      setLanguageModelOpen(false);
      setServerErrorNotification({});
      setServerNotification(false);
  };

  const setLanguage = (selectedItem) => {
      setItem(selectedItem);
  };

  return (
      <ComposedModal size="sm" open={openLanguageModel}>
          <ModalHeader>{t("change-language")}</ModalHeader>
          <ModalBody>
              <>
                  {serverNotification && (
                      <ToastNotification
                          className="error-notification-box"
                          iconDescription="describes the close button"
                          subtitle={serverErrorNotification?.message}
                          onCloseButtonClick={() => {
                              setServerErrorNotification({});
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
                          itemToString={(item) => item.text}
                          onChange={(event) =>
                              setLanguage(event.selectedItem)
                          }
                          selectedItem={selectedItem}
                          label={t("select-language")}
                          titleText={t("select-language")}
                      />
                  </div>
              </>
          </ModalBody>
          <ModalFooter>
              <Button kind="secondary" onClick={closeLanguageModal}>
              {t("cancel")}
              </Button>
              <Button kind="primary" onClick={handleLanguageChange} className="button-with-loading" disabled={loading}>
                {t("submit")}
                {loading &&<InlineLoading className="inline-loading-within-btn"/>}
              </Button>
          </ModalFooter>
      </ComposedModal>
  );
};
