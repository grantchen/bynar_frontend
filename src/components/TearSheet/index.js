import React from "react";
import { Tearsheet } from "@carbon/ibm-products";
import { UserList } from "./../UserList";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export const TearSheets = ({ setIsOpen, isOpen }) => {
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setIsOpen(false);
    navigate('/home/dashboard');
  };

  const {t} = useTranslation()
    return (
    <>
      <Tearsheet
        hasCloseIcon
        closeIconDescription={t('close-tearsheet-text')}
        label=""
        onClose={handleCloseModal}
        open={isOpen}
        preventCloseOnClickOutside
        title={t("user-list")}
      >
        <UserList isOpen={isOpen} />
      </Tearsheet>
    </>
  );
};

