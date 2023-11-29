import { SidePanel } from "@carbon/ibm-products";
import {
    ContainedList,
    Button,
    ContainedListItem,
    OverflowMenu,
    OverflowMenuItem,
    SkeletonText,
    Popover,
    IconButton,
    Theme,
    InlineNotification
} from "@carbon/react";
import { useState, useRef, useEffect, useCallback, useContext } from "react";
import { Add, CheckmarkFilled, TrashCan } from "@carbon/react/icons";
import "./UserCardManagementPanel.scss";

import {
    TabContext,
    handleActiveTabCfg,
    useCardManagement,
    useThemePreference,
} from "../../sdk";
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

    const { activeTab } = useContext(TabContext)

    const handleClose = useCallback(() => {
        closeCardManagementPanel();
        handleActiveTabCfg(activeTab)
    }, [closeCardManagementPanel, activeTab])

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
                    className="test card-list"
                    open={open}
                    onRequestClose={handleClose}
                    title={t("payment-method")}
                    subtitle={t("user-payment-method-information")}
                    data-floating-menu-container
                >
                    <div className="card-list-2">
                        {notification && (
                            <InlineNotification
                                className="error-notification-box"
                                icondescription="Close Notification"
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
                                                    listItem?.id !==
                                                        cardsData?.default ? (<OverflowMenu className="card-row-popover" id={listItem.id} flipped={true} aria-label="overflow-menu" focusTrap={false}>
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
                                                        </OverflowMenu>) : (<Popover
                                                            open={false}
                                                            align="bottom-right"
                                                            dropShadow
                                                            isTabTip
                                                            className="default-card-row-popover"
                                                        >
                                                            <IconButton
                                                                label={''}
                                                                kind="ghost"
                                                                isSelected={false}
                                                            >
                                                                <CheckmarkFilled />
                                                            </IconButton>
                                                        </Popover>)
                                                }
                                                key={listItem.id}
                                            >
                                                <div className="card-box">
                                                    <span className="card-logo card-logo-with-checkicon">
                                                        <span className="card-type">
                                                            <img className="card-icon" src={`/images/card-${listItem?.scheme?.toLowerCase()}.svg`} />
                                                            <span className="schema">
                                                                {listItem?.scheme}
                                                            </span>
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
