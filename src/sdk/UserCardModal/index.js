import {
    InlineLoading,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    Button,
} from "carbon-components-react";
import { useTranslation } from "react-i18next";
import { useUserManagement } from "../context";
import { CardFrame, Frames } from "frames-react";
import { useCallback, useState, useRef, useEffect } from "react";
import { useAuth } from "../AuthContext";
import './UserCardModal.scss'
const UserCardModal = ({ open }) => {
    const [loading, setLoading] = useState();
    const { authFetch } = useAuth();
    const { closeModalAndGoBackToUserList, handleVerifyCard } = useUserManagement();
    const { t } = useTranslation();
    const handleClose = useCallback(() => {
        closeModalAndGoBackToUserList();
    }, []);

    const verifyUserCardDetails = useCallback(
        async () => {
            try {
                const res = await Frames.submitCard();
                await handleVerifyCard(res?.token);
            } catch (e) {
                throw { message: t("error-adding-user-card"), type: "error" };
            }
            finally {
                Frames.init("pk_sbox_u4jn2iacxvzosov4twmtl2yzlqe");
            }
        },
        [authFetch]
    );

    const handleSubmit = useCallback(async () => {
        try {
            setLoading(true);
            await verifyUserCardDetails();
        } catch (e) {
            console.log("adding card", e)
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ComposedModal
            open={open}
            size="xs"
            onClose={handleClose}
            className="theme-change-modal"
        >
            <ModalHeader title={t("add-new-card")} />
            <ModalBody>
                <Frames
                    config={{
                        publicKey: "pk_sbox_u4jn2iacxvzosov4twmtl2yzlqe",
                    }}
                >
                    <div>
                        <div>
                            <p className="input-heading">{t("card-details")}</p>
                        </div>
                        <div>
                            <CardFrame className="card-number" />
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
        </ComposedModal>)
}
export default UserCardModal;