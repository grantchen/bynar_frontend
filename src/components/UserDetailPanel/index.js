import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BaseURL, useUserManagement } from "../../sdk";
import { SidePanel } from "@carbon/ibm-products";
import "./UserDetailPanel.scss";

const userDetailkey = {
    fullName: "Full Name",
    username: "User Name",
    country: "Country",
    address: "Address",
    city: "City",
    postalCode: "Postal Code",
    phoneNumber: "Phone Number",
};
export const UserDetailPanel = () => {
    const [searchParams] = useSearchParams();
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
                const userDetails = await getUserById(parseInt(searchParams?.get("userIdToShowDetails")));
                setUserDetail({
                    ...userDetails.result,
                    address: `${userDetails.result.addressLine} ${userDetails.result.addressLine2}`,
                    phoneNumber: `+${userDetails.result.phoneNumber}`
                })
            } catch (e) {
            } finally {
                setIsLoading(false);
            }
        })()
    }, []);

    return (
        <div className="main--content">
            <SidePanel
                includeOverlay
                open={true}
                onRequestClose={closeModalAndGoBackToUserList}
                title={"User Detail"}
                subtitle=""
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {Object?.entries(userDetailkey)
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
                        })}
                </div>
            </SidePanel>
        </div>
    );
};
