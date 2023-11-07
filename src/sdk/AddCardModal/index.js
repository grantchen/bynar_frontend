import {
    InlineLoading,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    InlineNotification,
    ToastNotification,
    TextInputSkeleton,
    Theme
} from "@carbon/react";
import { useTranslation } from "react-i18next";
import { useCardManagement } from "../context";
import { CardFrame, Frames } from "frames-react";
import { useCallback, useState, useRef, useEffect } from "react";
import { useAuth } from "../AuthContext";
import './AddCardModal.scss'
import { useThemePreference } from "../new-theme";
import { useNavigate } from "react-router-dom";
import {
    CheckoutPublicKey,
} from "./../../sdk";
const AddCardModal = ({ open }) => {
    const [loading, setLoading] = useState(false);
    const modalBodyRef = useRef(null)
    const { authFetch } = useAuth();
    const navigate = useNavigate()
    const { handleVerifyCard, notification, setNotification } = useCardManagement();
    const { theme, themePreference } = useThemePreference()

    const { t } = useTranslation();
    const handleClose = useCallback(() => {
        navigate(-1)
    }, []);

    const verifyUserCardDetails = useCallback(
        async () => {
            try {
                const res = await Frames.submitCard();
                await handleVerifyCard(res?.token);
            } catch (e) {
                console.log(e)
                throw {
                    message: e === "Card form invalid"
                        ? t("invalid-card-details")
                        : t("error-adding-user-card"), type: "error"
                };
            }
        },
        [authFetch]
    );

    const handleSubmit = useCallback(async () => {
        try {
            setLoading(true);
            await verifyUserCardDetails();
        } catch (e) {
            setNotification({ message: e.message, type: "error" });
            console.log("adding card", e)
        } finally {
            document.querySelectorAll(".frame-heading").forEach(a => a.style.display = "none");
            document.querySelectorAll(".card-number").forEach(a => a.style.display = "none");
            document.querySelectorAll(".frame-skeleton-loading").forEach(a => a.style.display = "");
            setLoading(false);
            Frames.init({
                publicKey: CheckoutPublicKey,
                style: themePreference === "white" ? g10style : g90style,
                "ready": handleReady,
            });
        }
    }, []);


    const handleReady = useCallback(async () => {
        document.querySelectorAll(".frame-heading").forEach(a => a.style.display = "");
        document.querySelectorAll(".card-number").forEach(a => a.style.display = "");
        document.querySelectorAll(".frame-skeleton-loading").forEach(a => a.style.display = "none");
    })

    useEffect(() => {
        if (open) {
            document.querySelectorAll(".frame-heading").forEach(a => a.style.display = "none");
            document.querySelectorAll(".card-number").forEach(a => a.style.display = "none");
            document.querySelectorAll(".frame-skeleton-loading").forEach(a => a.style.display = "");
            Frames.init({
                publicKey: CheckoutPublicKey,
                style: themePreference == "white" ? g10style : g90style,
                "ready": handleReady,
            });
        }
    }, [open])

    // useEffect(() => {
    //     if(!modalBodyRef){
    //         return
    //     }
    //     const iFrame = modalBodyRef.current.querySelector('iframe')
    //     iFrame.addEventListener( "load", function(e) {

    //         // this.style.backgroundColor = "red";
    //         this.classList.add('my-test-frame')

    //     } )
    // }, [])

    const g10style = {
        base: {
            color: '#161616',
        },
        // autofill: {
        //     backgroundColor: 'yellow',
        // },
        hover: {
            color: '#161616',
        },
        focus: {
            color: '#161616',
        },
        // valid: {
        //     color: 'green',
        // },
        // invalid: {
        //     color: 'red',
        // },
        placeholder: {
            base: {
                color: 'gray',
            },
            // focus: {
            //     border: 'solid 1px #161616',
            // },
        },
    };

    const g90style = {
        base: {
            color: '#f4f4f4',
        },
        // autofill: {
        //     backgroundColor: '#525252',
        // },
        hover: {
            color: '#f4f4f4',
        },
        focus: {
            color: '#f4f4f4',
        },
        // valid: {
        //     color: 'green',
        // },
        // invalid: {
        //     color: 'red',
        // },
        placeholder: {
            base: {
                color: 'gray',
            },
            // focus: {
            //     border: 'solid 1px #525252',
            // },
        },
    };

    return (
        <Theme theme={themePreference === "white" ? "g10" : "g90"}>
            <ComposedModal
                open={open}
                size="md"
                onClose={handleClose}
                className="add-card-modal"
                preventCloseOnClickOutside
            >
                <ModalHeader title={t("add-new-card")} />
                <ModalBody ref={modalBodyRef}>
                    {notification && (
                        <InlineNotification
                            className="error-notification-box"
                            iconDescription="Clear Notification"
                            title={notification?.message}
                            onCloseButtonClick={() => {
                                setNotification(null);
                            }}
                            timeout={0}
                            // title=""
                            kind={notification?.type}
                        />
                    )}
                    <Frames
                        config={{
                            publicKey: CheckoutPublicKey,
                            style: themePreference == "white" ? g10style : g90style,
                            "ready": handleReady,
                        }}
                    >
                        <div className="card-input-container">
                            <div>
                                <p className="input-heading frame-heading" style={{ display: "none" }}>{t("card-details")}</p>
                            </div>
                            <div>
                                <TextInputSkeleton className="frame-skeleton-loading" />
                                <CardFrame className="card-number" style={{ display: "none" }} />
                            </div>
                        </div>
                    </Frames>
                </ModalBody>
                <ModalFooter>
                    <Button kind="secondary" onClick={handleClose}>
                        {t("cancel")}
                    </Button>
                    <Button kind="primary" onClick={handleSubmit} className="button-with-loading">
                        {t("confirm")}
                        {loading && (
                            <InlineLoading className="inline-loading-within-btn" />
                        )}
                    </Button>
                </ModalFooter>
            </ComposedModal>
        </Theme>)
}
export default AddCardModal;
