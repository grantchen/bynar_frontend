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
    ModalFooter,
    TextInput,
    ToastNotification,
    Loading,
    Button,
} from "carbon-components-react";
import { useState } from "react";
const RemoveModal = (props) => {
    // console.log(props, "testt")
    const [removeModalOpen,setRemoveModalOpen] = useState(true);
    const [userInput, setUserInput] = useState('');
    // const idRef = useRef(uuidv4());
    const onChangeHandler = (e) => {
      setUserInput(e.target.value);
    };
    const handleClose=()=>{
       setRemoveModalOpen(false);
       props?.onClose();
    }
    const checkPrimaryButtonDisabled = () => {
        // user control should be used primarily
        if (props?.primaryButtonDisabled) {
          return true;
        } else if (props?.textConfirmation && userInput !== props?.resourceName) {
          return true;
        }
        return false;
      };
    const primaryButtonStatus = checkPrimaryButtonDisabled();
    return (
        <>
            <ComposedModal
                open={removeModalOpen}
                size="md"
                onClose={handleClose}
            >
                <ModalHeader title={props?.title}
                    label={props?.label} />
                <ModalBody>
                    {/* <p className={`${blockClass}__body`}>{body}</p> */}
                    {props?.textConfirmation && (
                        <TextInput
                            // id={`${idRef.current}-confirmation-input`}
                            // className={`${blockClass}__input`}
                            invalidText={props?.inputInvalidText}
                            labelText={props?.inputLabelText}
                            placeholder={props?.inputPlaceholderText}
                            onChange={onChangeHandler}
                            value={userInput}
                            data-modal-primary-focus
                        />
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button kind="secondary" onClick={handleClose}  data-modal-primary-focus={!props?.textConfirmation}>
                        {"cancel"}
                    </Button>
                    <Button type="submit" kind="danger"  disabled={primaryButtonStatus}>
                        {"delete"}
                    </Button>
                </ModalFooter>
            </ComposedModal>
        </>
    )
}

export default RemoveModal;