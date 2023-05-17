import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    TileGroup,
    RadioTile,
    ModalFooter,
    Button,
    ToastNotification,
    InlineLoading
} from "@carbon/react";
import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageModal.scss";
import { useAuth } from "../../AuthContext";

export function LanguageModal({ openLanguageModal, setLanguageModalOpen }){
    const { t } = useTranslation();
    const { updateUserLanguagePreference, user } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState("en");
    const [toastNotification, setToastNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }
        setSelectedLanguage(user?.languagePreference);
    }, [user?.languagePreference]);

    const handleSubmit = useCallback(async () => {
        try {
            setLoading(true);
            await updateUserLanguagePreference({
                languagePreference: selectedLanguage,
            });
            setLanguageModalOpen(false);
        } catch (e) {
            setToastNotification({ message: e.message, type: "error" });
        } finally {
            setLoading(false);
        }
    }, [selectedLanguage, updateUserLanguagePreference]);

    const handleClose = useCallback(() => {
        setLanguageModalOpen(false);
        setToastNotification(null);
        setLoading(false);
    }, []);

    return (
        <ComposedModal
            open={openLanguageModal}
            size="xs"
            onClose={handleClose}
        >
            <ModalHeader title={t("change-language")} />
            <ModalBody className="theme-modal-body">
                {toastNotification && (
                    <ToastNotification
                        className="error-notification-box"
                        iconDescription="Clear Notification"
                        subtitle={toastNotification?.message}
                        onCloseButtonClick={() => {
                            setToastNotification(null);
                        }}
                        timeout={0}
                        title=""
                        kind={toastNotification?.type}
                    />
                )}
                <TileGroup
                    legend={t("languages")}
                    name="language"
                    onChange={(val) => setSelectedLanguage(val)}
                    valueSelected={selectedLanguage}
                >
                    <RadioTile light value="en">
                        {t("english")}
                    </RadioTile>
                    <RadioTile light value="de">
                        {t("german")}
                    </RadioTile>
                    <RadioTile light value="fr">
                        {t("french")}
                    </RadioTile>
                    <RadioTile light value="es">
                        {t("spanish")}
                    </RadioTile>
                </TileGroup>
            </ModalBody>
            <ModalFooter>
                <Button kind="secondary" onClick={handleClose}>
                    {t("cancel")}
                </Button>
                <Button
                    kind="primary"
                    onClick={handleSubmit}
                    className="button-with-loading"
                    disabled={loading}
                >
                    {t("submit")}
                    {loading && (
                        <InlineLoading className="inline-loading-within-btn" />
                    )}
                </Button>
            </ModalFooter>
        </ComposedModal>
    );
};
