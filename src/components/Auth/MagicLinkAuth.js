import { getQueryVariable } from "../../sdk";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

// MagicLinkAuth is a component that handles the redirect from the magic link
export const MagicLinkAuth = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    handleContinueUrlRedirect()
  }, [])

  // handleContinueUrlRedirect open the continueUrl if it exists
  const handleContinueUrlRedirect = () => {
    let continueUrl = getQueryVariable(window.location.href, "continueUrl")
    if (!continueUrl) {
      return
    }

    // append location search params to continueUrl
    const url = new URL(continueUrl);
    for (let key of searchParams.keys()) {
      if (key === "continueUrl") {
        continue;
      }
      url.searchParams.append(key, searchParams.get(key));
    }


    console.log(url.href);
    // TODO open previous tab
    window.location = url.href;
  };

  return (
    <></>
  )
}
export default MagicLinkAuth
