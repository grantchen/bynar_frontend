import React, {
    useEffect,
    useState,
} from "react";
import { useAuth } from "../AuthContext";
import { BaseURL } from "../constant";
import { ImportModal } from "@carbon/ibm-products";
import "./UploadProfileImage.scss"
import { useTranslation } from "react-i18next";

const UploadProfileImageModal = ({
    isUploadProfileImageModalOpen,
    openUploadProfileImageModal,
}) => {
    const { authFetch } = useAuth();
    const [loading, setLoading] = useState(false);
    const {t} = useTranslation()
    /**
     * the modal does not reset it's state after submit
     * verified from source code - https://github.com/carbon-design-system/ibm-products/blob/main/packages/ibm-products/src/components/ImportModal/ImportModal.js
     *
     * on modal close, toggle a internal state variable to destroy and re-attach modal to dom in order to both
     * - reset state
     * - preserve animation on open/close
     */
    const [hackResetState, setHackResetState] = useState(false);
    useEffect(() => {
        if (!isUploadProfileImageModalOpen) {
            const timeoutId = setTimeout(() => setHackResetState(true), 500);
            return () => clearTimeout(timeoutId);
        }
    }, [isUploadProfileImageModalOpen]);

    useEffect(() => {
        if (hackResetState) {
            setHackResetState(false);
        }
    }, [hackResetState]);

    if (hackResetState) {
        return null;
    }

    const props = {
        title: t("import"),
        accept: ["image/jpeg", "image/png"],
        defaultErrorBody: t("select-new-file-try-again"),
        defaultErrorHeader: t("import-failed"),
        description:
            t("import-description"),
        fetchErrorBody: t("unable-fetch-url"),
        fetchErrorHeader: t("import-failed"),
        fileDropHeader: t("file-drop-header"),
        fileDropLabel: t("file-drop-label"),
        fileUploadLabel: t("file-upload-label"),
        inputButtonText: t("add-file"),
        inputLabel: t("add-file-specify-url"),
        inputPlaceholder: t("URL"),
        invalidFileTypeErrorBody: t("invalid-file-type"),
        invalidFileTypeErrorHeader: t("import-failed"),
        invalidIconDescription: t("delete"),
        maxFileSize: 500 * 1024,
        maxFileSizeErrorBody:
            t("max-file-size-error-500"),
        maxFileSizeErrorHeader: t("import-failed"),
        open: isUploadProfileImageModalOpen,
        primaryButtonText: t("import"),
        secondaryButtonText: t("cancel"),
        onClose: () => openUploadProfileImageModal(false),
        onRequestSubmit: async (e) => {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append("file", e[0].fileData);
                const response = await authFetch(`${BaseURL}/upload`, {
                    method: "POST",
                    body: formData,
                });
                if (response.ok) {
                    openUploadProfileImageModal(false);
                    // getUser();
                } else {
                    throw "error";
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        },
    };

    return (
        <>
            <ImportModal
                {...props}
                className={`image-import ${loading ? "is-loading" : ""}`}
            />
        </>
    );
};
export default UploadProfileImageModal;
