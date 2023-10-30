import { SidePanel } from "@carbon/ibm-products";
import {
    ContainedList,
    Button,
    ContainedListItem,
    OverflowMenu,
    OverflowMenuItem,
    SkeletonText,
    Popover,
    PopoverContent,
    IconButton,
    Theme,
    SkeletonPlaceholder,
    InlineNotification,
    ToastNotification,
    Checkbox
} from "@carbon/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Add, CheckmarkFilled, TrashCan, OverflowMenuVertical } from "@carbon/react/icons";
import "./UserCardManagementPanel.scss";

import {
    BaseURL,
    useAuth,
    useCardManagement,
    useUserManagement,
    useThemePreference,
} from "../../sdk";
import { notificationTokens } from "@carbon/themes";
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
        setNotification
    } = useCardManagement();

    const [openOptionIndex, setOpenOptionIndex] = useState(-1);
    const { t } = useTranslation();
    const { themePreference } = useThemePreference();
    const [disable, setDisable] = useState(false)
    const [updateHappened, setUpdateHappened] = useState(true)

    const handleDefaultCardOptionClick = useCallback(
        async (cardId) => {
            setDisable(true)
            setOpenOptionIndex(-1);
            await makeDefaultMethod(cardId);
            setDisable(false)
        },
        [makeDefaultMethod, setDisable]
    );

    useEffect(() => {
        if (!open) {
            setUpdateHappened(true)
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
        <Theme theme={themePreference === "white" ? "g10" : "g90"}>
            <div>
                <SidePanel
                    preventCloseOnClickOutside
                    includeOverlay
                    className="test"
                    open={open}
                    onRequestClose={closeCardManagementPanel}
                    title={t("payment-method")}
                    subtitle={t("user-payment-method-information")}
                >
                    <div className="card-list">
                        {notification && (
                            <InlineNotification
                                className="error-notification-box"
                                iconDescription="Close Notification"
                                subtitle={notification?.message}
                                timeout={0}
                                title={""}
                                kind={notification.type}
                                onCloseButtonClick={() => {
                                    setNotification(null);
                                }}
                            />
                        )}
                        <ContainedList
                            label={t("payment-method")}
                            action={
                                <Button
                                    hasIconOnly
                                    iconDescription={t("add-new-card")}
                                    renderIcon={Add}
                                    tooltipPosition="left"
                                    onClick={openCardAddModal}
                                    disabled={
                                        (loading || cardsData?.instruments?.length >= 10)
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
                                                        isTabTip
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
                                                                                <CheckmarkFilled size={16} />
                                                                                <div>&nbsp;&nbsp;
                                                                                    {t(
                                                                                        "default-payment-method"
                                                                                    )}</div>
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
                                                                                <TrashCan />
                                                                                <div>&nbsp;&nbsp;
                                                                                    {t(
                                                                                        "remove-payment-method"
                                                                                    )}</div>
                                                                            </div>
                                                                        }
                                                                        isDelete={listItem?.id !==
                                                                            cardsData?.default}
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
                                                    <span className="card-logo card-logo-with-checkicon">
                                                        <span className="card-type">
                                                            {
                                                                listItem?.scheme
                                                            }
                                                        </span>
                                                    </span>
                                                    <span>
                                                        {"...."}
                                                        {listItem?.last4}
                                                    </span>
                                                    <span className="card-holder-name">
                                                        {cardsData?.name}
                                                    </span>
                                                    <span>
                                                        {format(
                                                            date,
                                                            "MM/yyyy"
                                                        )}
                                                    </span>
                                                    <span className="card-checkbox">
                                                        {(listItem?.id === cardsData?.default) ? (
                                                            <CheckmarkFilled size={14} />
                                                        ) : <CheckmarkFilled size={14} style={{ visibility: "hidden" }} />}
                                                    </span>
                                                </div>
                                            </ContainedListItem>);
                                    }
                                )}
                        </ContainedList>
                    </div>
                </SidePanel>
            </div>
        </Theme>
    );
};
export default UserCardManagementPanel;
