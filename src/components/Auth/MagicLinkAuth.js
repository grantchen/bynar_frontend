import { getQueryVariable } from "../../sdk";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const MagicLinkAuth = () => {
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    handleContinueUrlRedirect()
  }, [])

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
