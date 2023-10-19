import {
    InlineLoading,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Button,
} from "@carbon/react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { pkg } from "@carbon/ibm-products";
export const RemoveModalWithLoading = ({ deleteModalProps, loading }) => {
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
        <>
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
        </>
    );
};
