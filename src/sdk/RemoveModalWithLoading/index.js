import {
    InlineLoading,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Button,
    Theme
} from "@carbon/react";
import "./removemodal.scss";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { pkg } from "@carbon/ibm-products";
import { useThemePreference } from "../../sdk";
export const RemoveModalWithLoading = ({ deleteModalProps, loading }) => {
    const { themePreference } = useThemePreference();
    const [userInput, setUserInput] = useState("");
    const { t } = useTranslation();
    const onChangeHandler = useCallback((e) => {
        setUserInput(e.target.value);
    }, []);
    const handleClose = useCallback(() => {
        setUserInput("");
        deleteModalProps?.onClose();
    }, []);
    const isPrimaryButtonDisabled = useMemo(() => {
        if (deleteModalProps?.primaryButtonDisabled) {
            return true;
        } else if (
            deleteModalProps?.textConfirmation &&
            userInput !== deleteModalProps?.resourceName
        ) {
            return true;
        }
        return false;
    }, [deleteModalProps, userInput]);

    const blockClass = `${pkg.prefix}--remove-modal`;
    return (
        <Theme theme={themePreference === "white" ? "g10" : "g90"}>
            <ComposedModal
                open={Boolean(deleteModalProps)}
                size="sm"
                onClose={handleClose}
                preventCloseOnClickOutside
            >
                <ModalHeader
                    title={deleteModalProps?.title}
                    label={deleteModalProps?.label}
                />
                <ModalBody>
                    <p className={`${blockClass}__body`}>
                        {deleteModalProps?.body}
                    </p>
                    {deleteModalProps?.textConfirmation && (
                        <TextInput
                            id={"text-confirmation-input"}
                            className={`${blockClass}__input`}
                            invalidText={deleteModalProps?.inputInvalidText}
                            labelText={deleteModalProps?.inputLabelText}
                            placeholder={deleteModalProps?.inputPlaceholderText}
                            onChange={onChangeHandler}
                            value={userInput}
                            data-modal-primary-focus
                        />
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        kind="secondary"
                        onClick={handleClose}
                        data-modal-primary-focus={
                            !deleteModalProps?.textConfirmation
                        }
                    >
                        {t("close")}
                    </Button>
                    <Button
                        type="submit"
                        kind="danger"
                        disabled={isPrimaryButtonDisabled}
                        onClick={deleteModalProps?.onRequestSubmit}
                        className="button-with-loading"
                    >
                        {t("delete")}
                        {loading && (
                            <InlineLoading className="inline-loading-within-btn" />
                        )}
                    </Button>
                </ModalFooter>
            </ComposedModal>
        </Theme>
    );
};
