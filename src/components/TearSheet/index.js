import React from "react";
import { Tearsheet } from "@carbon/ibm-products";
import { UserList } from "./../UserList";
import { useNavigate } from "react-router-dom";
export const TearSheets = ({ setIsOpen, isOpen }) => {
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setIsOpen(false);
    navigate('/home/dashboard');
  };

  return (
    <>
      <Tearsheet
        actions={[
          { kind: "secondary", label: "Close", onClick: handleCloseModal },
        ]}
        closeIconDescription="Close the tearsheet"
        label=""
        onClose={handleCloseModal}
        open={isOpen}
        preventCloseOnClickOutside
        title="User list"
      >
        <UserList isOpen={isOpen} />
      </Tearsheet>
    </>
  );
};

