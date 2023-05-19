import {
    Search,
    ComposedModal,
    StructuredListWrapper,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListInput,
    ModalHeader,
    ModalBody,
    ToastNotification,
    Loading,
} from "carbon-components-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckmarkFilled } from "@carbon/react/icons";
import { useTranslation } from "react-i18next";
import "./LanguageChangeModal.scss";
import { useAuth } from "../../AuthContext";

const prefix = "bx";
export function LanguageChangeModal({
    isLanguageChangeModalOpen,
    openLanguageChangeModal,
}) {
    const { user, updateUserLanguagePreference } = useAuth();
    const { t } = useTranslation();

    const [searchText, setSearchText] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState(
        () => user?.languagePreference ?? "en"
    );
    const [loading, setLoading] = useState(false);
    const [toastNotification, setToastNotification] = useState(null);

    useEffect(() => {
        if (!user) {
            return;
        }
        setSelectedLanguage(user?.languagePreference);
    }, [user?.languagePreference, isLanguageChangeModalOpen]);

    const handleSubmit = useCallback(
        async (languageCode) => {
            try {
                setSelectedLanguage(languageCode);
                setLoading(true);
                await updateUserLanguagePreference({
                    languagePreference: languageCode,
                });
                openLanguageChangeModal(false);
            } catch (e) {
                setToastNotification({ message: e.message, type: "error" });
            } finally {
                setLoading(false);
            }
        },
        [selectedLanguage, updateUserLanguagePreference]
    );

    const handleClose = useCallback(() => {
        openLanguageChangeModal(false);
        setToastNotification(null);
        setLoading(false);
    }, []);

    const languageOptions = useMemo(() => {
        if (searchText === "") {
            return getAvailableLanguageAndRegions(t);
        }
        const searchTerm = searchText.toLowerCase();
        return getAvailableLanguageAndRegions(t).filter(
            (item) =>
                item.language.toLowerCase().includes(searchTerm) ||
                item.country.toLowerCase().includes(searchTerm) ||
                item.language.toLowerCase().includes(searchTerm)
        );
    }, [t, user?.languagePreference, searchText]);

    return (
        <ComposedModal
            open={isLanguageChangeModalOpen}
            size="md"
            onClose={handleClose}
        >
            <ModalHeader title={t("languages")} />
            <ModalBody className="language-modal-body">
                {loading && <Loading />}
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
                <Search
                    persistent
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <p className="list-description">
                    {languageOptions.length ? t('location-language-available') : t('location-language-unavailable')}
                </p>
                {/* <Test/> */}
                <StructuredListWrapper
                    selection
                    onChange={(e) => handleSubmit(e.target.id)}
                    value={user?.languagePreference}
                    name="selected-language"
                >
                    <StructuredListBody name="selected-language">
                        {languageOptions.map((option) => (
                            <StructuredListRow
                                label
                                key={option.languageCode}
                                id={option.languageCode}
                            >
                                <StructuredListCell>
                                    {option.country}
                                </StructuredListCell>
                                <StructuredListCell>
                                    {option.language}
                                </StructuredListCell>
                                <StructuredListInput
                                    id={option.languageCode}
                                    title={option.languageCode}
                                    name="selected-language"
                                    checked={
                                        option.languageCode === selectedLanguage
                                    }
                                />
                                <StructuredListCell>
                                    <CheckmarkFilled
                                        className={`${prefix}--structured-list-svg`}
                                        aria-label="select an option"
                                    >
                                        <title>select an option</title>
                                    </CheckmarkFilled>
                                </StructuredListCell>
                            </StructuredListRow>
                        ))}
                    </StructuredListBody>
                </StructuredListWrapper>
            </ModalBody>
        </ComposedModal>
    );
}

function getAvailableLanguageAndRegions(t) {
    return [
        {
            language: t("english"),
            country: "United States",
            languageCode: "en",
        },
        {
            language: t("german"),
            country: "Germany",
            languageCode: "de",
        },
        {
            language: t("french"),
            country: "France",
            languageCode: "fr",
        },
        {
            language: t("spanish"),
            country: "Spain",
            languageCode: "es",
        },
    ];
}
