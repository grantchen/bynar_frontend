import {
  pkg,
} from "@carbon/ibm-products";
import React from "react";
import "./UserList.scss";
import { TreeGrid } from "../TreeGrid";

pkg.setAllComponents(true);
pkg.setAllFeatures(true);

export const UserList = ({ isOpen }) => {
  return (
    <>
      {
        isOpen && (
          <div className="user-list">
            <TreeGrid
              table={ "user_list" }
              config={ {
                Debug: '',
                Layout: { Url: "/users.xml" },
              } }
            ></TreeGrid>
          </div>
        )
      }
    </>
  );
};

