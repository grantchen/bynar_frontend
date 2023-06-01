import { SidePanel } from "@carbon/ibm-products";
import {
    ContainedList,
    Button,
    ContainedListItem,
    OverflowMenu,
    OverflowMenuItem,
    Grid,
    Column,
    SkeletonText,
    Popover,
    PopoverContent,
    IconButton,
} from "@carbon/react";
import { OverflowMenuVertical, TrashCan } from "@carbon/react/icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { Add20, CheckmarkFilled16 } from "@carbon/icons-react";
import {
    SkeletonPlaceholder,
    ToastNotification,
} from "carbon-components-react";
import "./UserCardManagementPanel.scss";
import { TextInputSkeleton } from "@carbon/react";

import {
    BaseURL,
    useAuth,
    useCardManagement,
    useUserManagement,
} from "../../sdk";
import { notificationTokens } from "@carbon/themes";
import { Delete16 } from "@carbon/icons-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
const UserCardManagementPanel = ({ open }) => {
    const {
        cardsData,
        notification,
        loading,
        getUserCardList,
        closeCardManagementPanel,
        makeDefaultMethod,
        handleVerifyCard,
        openUserCardDeleteModal,
        openCardAddModal,
    } = useCardManagement();

    const [openOptionIndex, setOpenOptionIndex] = useState(-1);
    const { t } = useTranslation();

    const handleDefaultCardOptionClick = useCallback(
        async (cardId) => {
            setOpenOptionIndex(-1);
            await makeDefaultMethod(cardId);
        },
        [makeDefaultMethod]
    );

    useEffect(() => {
        if (!open) {
            return;
        }
        (async () => {
            await getUserCardList();
        })();
    }, [open]);

    const wrapperRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpenOptionIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div>
                <SidePanel
                    preventCloseOnClickOutside
                    includeOverlay
                    className="test"
                    open={open}
                    onRequestClose={closeCardManagementPanel}
                    subtitle=""
                >
                    <div className="card-list">
                        {notification && (
                            <ToastNotification
                                className="error-notification-box"
                                iconDescription="Close Notification"
                                subtitle={notification?.message}
                                timeout={0}
                                title={""}
                                kind={notification.type}
                            />
                        )}
                        <ContainedList
                            label={t("payment-method")}
                            action={
                                <Button
                                    hasIconOnly
                                    iconDescription={t("add-new-card")}
                                    renderIcon={Add20}
                                    tooltipPosition="left"
                                    onClick={openCardAddModal}
                                    disabled={
                                        cardsData?.instruments?.length >= 10
                                            ? true
                                            : false
                                    }
                                />
                            }
                        >
                            {loading
                                ? Array(4)
                                      .fill({})
                                      .map((_, idx) => (
                                          <ContainedListItem key={idx}>
                                              <SkeletonText
                                                  heading={true}
                                                  className="skeleton-loading"
                                              />
                                          </ContainedListItem>
                                      ))
                                : cardsData?.instruments?.map(
                                      (listItem, index) => {
                                          const date = new Date();
                                          date.setFullYear(
                                              listItem.expiry_year
                                          );
                                          date.setMonth(listItem.expiry_month);
                                          return (
                                              <ContainedListItem
                                                  action={
                                                      <Popover
                                                          open={
                                                              openOptionIndex ===
                                                              index
                                                          }
                                                          align="bottom-right"
                                                          dropShadow
                                                          className="card-row-popover"
                                                      >
                                                          <IconButton
                                                              onClick={() =>
                                                                  setOpenOptionIndex(
                                                                      index
                                                                  )
                                                              }
                                                              kind="ghost"
                                                          >
                                                              <OverflowMenuVertical />
                                                          </IconButton>
                                                          {openOptionIndex ===
                                                              index && (
                                                              <PopoverContent
                                                                  className="card-popver-content"
                                                                  ref={
                                                                      wrapperRef
                                                                  }
                                                              >
                                                                  <OverflowMenuItem
                                                                      className="test"
                                                                      itemText={
                                                                          <div className="row-action-renderer">
                                                                              <CheckmarkFilled16 />{" "}
                                                                              {t(
                                                                                  "default-payment-method"
                                                                              )}
                                                                          </div>
                                                                      }
                                                                      onClick={() =>
                                                                          handleDefaultCardOptionClick(
                                                                              listItem?.id
                                                                          )
                                                                      }
                                                                      disabled={
                                                                          listItem?.id ===
                                                                          cardsData?.default
                                                                      }
                                                                  />
                                                                  <OverflowMenuItem
                                                                      itemText={
                                                                          <div className="row-action-renderer">
                                                                              <TrashCan />{" "}
                                                                              {t(
                                                                                  "remove-payment-method"
                                                                              )}
                                                                          </div>
                                                                      }
                                                                      isDelete
                                                                      hasDivider
                                                                      disabled={
                                                                          listItem?.id ===
                                                                          cardsData?.default
                                                                      }
                                                                      onClick={() => {
                                                                          openUserCardDeleteModal(
                                                                              {
                                                                                  cardIdToBeDeleted:
                                                                                      listItem?.id,
                                                                                  last4Digit:
                                                                                      listItem?.last4,
                                                                              }
                                                                          );
                                                                          setOpenOptionIndex(
                                                                              -1
                                                                          );
                                                                      }}
                                                                  ></OverflowMenuItem>
                                                              </PopoverContent>
                                                          )}
                                                      </Popover>
                                                  }
                                                  key={listItem.id}
                                              >
                                                  <div className="card-box">
                                                      <div className="card-logo">
                                                          <div className="card-logo-with-checkicon">
                                                              <p className="card-type">
                                                                  {
                                                                      listItem?.scheme
                                                                  }
                                                              </p>
                                                              {listItem?.id ===
                                                                  cardsData?.default && (
                                                                  <CheckmarkFilled16 />
                                                              )}
                                                          </div>
                                                      </div>
                                                      <p>
                                                          {"...."}
                                                          {listItem?.last4}
                                                      </p>
                                                      <p className="card-holder-name">
                                                          {cardsData?.name}
                                                      </p>
                                                      <p>
                                                          {format(
                                                              date,
                                                              "MM/yyyy"
                                                          )}
                                                      </p>
                                                  </div>
                                              </ContainedListItem>
                                          );
                                      }
                                  )}
                        </ContainedList>
                    </div>
                </SidePanel>
            </div>
        </>
    );
};
export default UserCardManagementPanel;
