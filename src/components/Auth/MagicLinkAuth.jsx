import { getQueryVariable } from "../../sdk";
import { useEffect } from "react";

export const MagicLinkAuth = () => {
    useEffect(() => {
        handleContinueUrlRedirect()
    }, [])

    const handleContinueUrlRedirect = () => {
        const url = getQueryVariable(window.location.href, "continueUrl")
        console.log(url);
        // TODO open previous tab
        window.location = url;
    };

    return (
        <></>
    )
}
export default MagicLinkAuth
