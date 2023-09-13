import { useNavigate, useLocation } from "react-router-dom";
import {
    useEffect,
    useReducer,
    createContext,
    useMemo,
    useContext,
    useCallback,
} from "react";
import { BaseURL, FireBaseAPIKey, FireBaseAuthDomain } from "./constant";
import { useTranslation } from "react-i18next";
import { initializeApp } from "firebase/app";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, signInWithCustomToken } from "firebase/auth";

const firebaseConfig = {
    apiKey: FireBaseAPIKey,
    authDomain: FireBaseAuthDomain,
};
initializeApp(firebaseConfig);

const initialState = {
    user: null,
    token: "loading",
    theme: null,
    lang: null,
};
export const AuthContext = createContext(initialState);
const { Provider, Consumer } = AuthContext;
const simpleReducer = (state, payload) => ({ ...state, ...payload });

export const AuthProvider = ({ children }) => {
    const [state, setState] = useReducer(simpleReducer, initialState);

    const navigate = useNavigate();
    const location = useLocation();
    const { i18n } = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const auth = getAuth();
                await auth.authStateReady()
                if (auth.currentUser) {
                    const token  = await auth.currentUser?.getIdToken()
                    setState({ user: auth.currentUser, token: token });
                } else {
                    setState({ token: null, user: null });
                }
            } catch (e) {
                setState({ token: null, user: null });
            }
        })();
    }, []);

    const getUser = useCallback(async () => {
        if (state.token === "loading" || state.token === null) {
            return;
        }
        try {
            const response = await fetch(`${BaseURL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + state.token,
                },
            });

            if (response.ok) {
                const res = await response.json();
                setState({ user: res.result });
                localStorage.setItem('lang', res?.result?.languagePreference)
                await i18n.changeLanguage(res?.result?.languagePreference);
            } else {
                // TODO api of /user incomplete
                debugger
                // signout()
            }
        } catch (e) {
            console.log("Error signing out!");
            // TODO api of /user incomplete
            // signout()
        }
    }, [state.token]);
    useEffect(() => {
        getUser();
    }, [getUser]);

    useEffect(() => {
        if (location.pathname === "/" || location.pathname === "/test") {
            return
        }
        switch (state.token) {
            case "loading":
                return;
            case null:
                if (
                    !(
                        location.pathname === "/signin" ||
                        location.pathname === "/forgotpassword" ||
                        location.pathname === "/signup"
                    )
                ) {
                    navigate("/signin");
                }
                break;
            default:
                if (
                    location.pathname === "/signin" ||
                    location.pathname === "/forgotpassword" ||
                    location.pathname === "/signup"
                ) {
                    navigate("/home/dashboard");
                }
                break;
        }
    }, [location.pathname, state.token]);

    const authFetch = useCallback(
        async (url, options = {}) => {
            let token = state.token;
            if (token === "loading") {
                try {
                    const auth = getAuth();
                    token = await auth.currentUser?.getIdToken()
                } catch (error) {
                    return new Promise();
                }
            }
            let res = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: "Bearer " + token,
                },
            });
            if (res.status === 401) {
                try {
                    const auth = getAuth();
                    token = await auth.currentUser?.getIdToken(true)
                } catch (error) {
                    signout();
                    return new Promise();
                }
                if (token) {
                    setState({ token });
                    res = await fetch(url, {
                        ...options,
                        headers: {
                            ...options.headers,
                            Authorization: "Bearer " + token,
                        },
                    });
                    if (res.status === 401) {
                        signout();
                        return new Promise();
                    }
                } else {
                    signout();
                }
            }
            return res;
        },
        [state.token]
    );

    const signin = useCallback(async (email, href) => {
        try {
            const auth = getAuth();
            if (isSignInWithEmailLink(auth, href)) {
                // signs in using an email and sign-in email link.
                const result = await signInWithEmailLink(auth, email, location.href)
                await auth.updateCurrentUser(result.user)
                const token = await result.user?.getIdToken()
                setState({ user: result.user, token: token });
                return result
            }
        } catch (e) {
            setState({ user: null, token: null });
            throw e
        }

        throw new Error('sign in failed')
    }, []);

    // signinWithCustomToken is used to sign in with custom token
    const signinWithCustomToken = useCallback(async (customToken) => {
        try {
            const auth = getAuth();
            const result = await signInWithCustomToken(auth, customToken)
            await auth.updateCurrentUser(result.user)
            const token = await result.user?.getIdToken()
            setState({ user: result.user, token: token });
            return result
        } catch (e) {
            setState({ user: null, token: null });
            throw e
        }

        throw new Error('sign in failed')
    }, []);

    const signout = useCallback(async () => {
        try {
            const auth = getAuth();
            await auth.signOut();
            navigate("/signin");
            setState({
                ...initialState,
                token: null,
            });
            navigate("/signin");
            localStorage.clear();
            document.documentElement.setAttribute('data-carbon-theme', 'white')
        } catch (e) {
            console.log(e);
        }
    }, []);

    const refreshPostSignIn = useCallback(async () => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken(true);
            if (token) {
                setState({ token: token });
            } else {
                setState({ token: null });
            }
        } catch (e) {
            setState({ token: null });
        }
    }, []);

    const updateUserLanguagePreference = useCallback(
        async ({ languagePreference }) => {
            if (!state?.user) {
                return;
            }
            const updateUserLanguage = {
                ...state?.user,
                languagePreference,
            };

            const response = await authFetch(`${BaseURL}/user`, {
                method: "PUT",
                body: JSON.stringify(updateUserLanguage),
            });

            const res = await response.json();

            if (response.ok) {
                localStorage.setItem('lang', languagePreference)
                await i18n.changeLanguage(languagePreference);
                setState({
                    user: {
                        ...state.user,
                        languagePreference,
                    },
                });
            } else if (response.status === 500) {
                throw { message: res.error, type: "error" };
            } else {
                throw { message: "Error updating user", type: "error" };
            }
        },
        [state?.user, authFetch]
    );

    const providerValue = useMemo(
        () => ({
            ...state,
            signin,
            signinWithCustomToken,
            signout,
            authFetch,
            refreshPostSignIn,
            updateUserLanguagePreference,
            getUser,
        }),
        [
            state,
            signin,
            signinWithCustomToken,
            signout,
            authFetch,
            refreshPostSignIn,
            updateUserLanguagePreference,
            getUser,
        ]
    );
    return <Provider value={providerValue}>{children}</Provider>;
};

export const useAuth = () => useContext(AuthContext);
