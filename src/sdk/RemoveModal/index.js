import {
    InlineLoading,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Button,
} from "carbon-components-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { pkg } from "@carbon/ibm-products";
export const RemoveModal = ({ deleteModalProps, loading }) => {
    const [removeModalOpen, setRemoveModalOpen] = useState(true);
    const [userInput, setUserInput] = useState('');
    const { t } = useTranslation();
    const onChangeHandler = (e) => {
        setUserInput(e.target.value);
    };
    const handleClose = () => {
        setUserInput('');
        setRemoveModalOpen(false);
        deleteModalProps?.onClose();
    }
    const checkPrimaryButtonDisabled = () => {
        // user control should be used primarily
        if (deleteModalProps?.primaryButtonDisabled) {
            return true;
        } else if (deleteModalProps?.textConfirmation && userInput !== deleteModalProps?.resourceName) {
            return true;
        }
        return false;
    };
    const primaryButtonStatus = checkPrimaryButtonDisabled();
    const blockClass = `${pkg.prefix}--remove-modal`;

    return (
        <>
            <ComposedModal
                open={removeModalOpen}
                size="sm"
                onClose={handleClose}
                preventCloseOnClickOutside
            >
                <ModalHeader title={deleteModalProps?.title}
                    label={deleteModalProps?.label} />
                <ModalBody>
                    <p className={`${blockClass}__body`}>{deleteModalProps?.body}</p>
                    {deleteModalProps?.textConfirmation && (
                        <TextInput
                            id={'text-confirmation-input'}
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
                    <Button kind="secondary" onClick={handleClose} data-modal-primary-focus={!deleteModalProps?.textConfirmation}>
                        {t("close")}
                    </Button>
                    <Button type="submit" kind="danger" disabled={primaryButtonStatus} onClick={deleteModalProps?.onRequestSubmit}>
                        {t("delete")}
                        {loading && <div className="loader-page">
                                <InlineLoading />
                            </div>}
                    </Button>
                </ModalFooter>
            </ComposedModal>
        </>
    )
}
