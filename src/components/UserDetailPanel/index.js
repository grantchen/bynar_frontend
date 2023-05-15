import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BaseURL, useUserManagement } from "../../sdk";
import { SidePanel } from "@carbon/ibm-products";
import { InlineLoading } from "@carbon/react";
import "./UserDetailPanel.scss";
import { useTranslation } from "react-i18next";


export const UserDetailPanel = () => {
    const [searchParams] = useSearchParams();
    const {t} = useTranslation()
    const userDetailkey = {
        fullName: t('full-name-text'),
        username: t('user-name-text'),
        country: t('country'),
        address: t('address'),
        city: t('city'),
        postalCode: t('postal-code-text'),
        phoneNumber: t('phone-number-text'),
    };
    const { getUserById, closeModalAndGoBackToUserList } = useUserManagement();
    const [userDetail, setUserDetail] = useState({
        fullName: "",
        userName: "",
        country: "",
        address: "",
        city: "",
        postalCode: "",
        phoneNumber: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const userDetails = await getUserById(
                    parseInt(searchParams?.get("userIdToShowDetails"))
                );
                setUserDetail({
                    ...userDetails.result,
                    address: `${userDetails.result.addressLine} ${userDetails.result.addressLine2}`,
                    phoneNumber: `+${userDetails.result.phoneNumber}`,
                });
            } catch (e) {
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <div className="main--content">
            <SidePanel
                includeOverlay
                open={true}
                onRequestClose={closeModalAndGoBackToUserList}
                title={t("user-detail")}
                subtitle=""
                preventCloseOnClickOutside
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {isLoading ? (
                        <div className="loading-container">
                            <InlineLoading />
                        </div>
                    ) : (
                        Object?.entries(userDetailkey)
                            .filter(([_, v]) => v != null)
                            ?.map(([key, value]) => {
                                return (
                                    <div
                                        style={{ display: "flex", gap: "8px" }}
                                        key={key}
                                    >
                                        <p className="list-users">{`${userDetailkey[key]}  :`}</p>
                                        <p className="list-user-detail">
                                            {" "}
                                            {`${userDetail[key]}`}
                                        </p>
                                    </div>
                                );
                            })
                    )}
                </div>
            </SidePanel>
        </div>
    );
};
