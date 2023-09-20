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
        let unsubscribeIdTokenChanged;
        (async () => {
            try {
                const auth = getAuth();
                await auth.authStateReady()
                if (auth.currentUser) {
                    const token = await auth.currentUser.getIdToken()
                    setState({ token: token });

                    unsubscribeIdTokenChanged = auth.onIdTokenChanged(async (user) => {
                      if (user) {
                        const token = await user.getIdToken()
                        if (token !== state.token) {
                          setState({ token: token });
                        }
                      } else {
                        console.log('clear token, id token changed')
                        setState({ token: null, user: null });
                      }
                    })
                } else {
                    console.log('clear token, no currentUser')
                    setState({ token: null });
                }
            } catch (e) {
                console.log(e, 'clear token, error in auth state ready')
                setState({ token: null, user: null });
            }
        })();

        return () => {
            if (unsubscribeIdTokenChanged) {
                unsubscribeIdTokenChanged()
            }
        }
    }, []);

    const getUser = useCallback(async () => {
        if (state.token === "loading" || state.token === null) {
            return;
        }
        try {
            const response = await fetch(`${ BaseURL }/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + state.token,
                },
            });

            if (response.ok) {
                const res = await response.json();
                setState({ user: res });
                localStorage.setItem('lang', res?.languagePreference)
                await i18n.changeLanguage(res?.languagePreference);
            } else {
                console.log('clear token, error response in get user')
                signout()
            }
        } catch (e) {
            console.log(e, 'clear token, error in get user')
            signout()
        }
    }, [state.token]);
    useEffect(() => {
        getUser();
    }, [getUser]);

    useEffect(() => {
        if (location.pathname === "/" ||
            location.pathname === "/test" ||
            location.pathname === "/auth/magic-link") {
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
                    token = await auth.currentUser?.getIdToken()
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
                const result = await signInWithEmailLink(auth, email, href)
                await auth.updateCurrentUser(result.user)
                const token = await result.user?.getIdToken()
                setState({ token: token });
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
            setState({ token: token });
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
                languagePreference,
            };

            const response = await authFetch(`${ BaseURL }/update-user-language-preference`, {
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

    // get request authorization token
    const getAuthorizationToken = useCallback(async () => {
        const auth = getAuth();
        await auth.authStateReady()
        const token = await auth.currentUser.getIdToken()
        return "Bearer " + token
    }, []);

    // check if user has permission
    const hasPermission = useCallback(async (permission) => {
        if (!state?.user) {
            return false;
        }
        return state.user.permissions && state.user.permissions[permission] === 1
    }, [state.user]);

    const updateUserThemePreference = useCallback(
        async ({ themePreference }) => {
            if (!state?.user) {
                return;
            }
            const updateUserTheme = {
                themePreference,
            };

            const response = await authFetch(`${BaseURL}/update-user-theme-preference`, {
                method: "PUT",
                body: JSON.stringify(updateUserTheme),
            });

            const res = await response.json();

            if (response.ok) {
                localStorage.setItem("theme-preference", themePreference)
                setState({
                    user: {
                        ...state.user,
                        themePreference,
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
            updateUserThemePreference,
            getUser,
            getAuthorizationToken,
            hasPermission,
        }),
        [
            state,
            signin,
            signinWithCustomToken,
            signout,
            authFetch,
            refreshPostSignIn,
            updateUserLanguagePreference,
            updateUserThemePreference,
            getUser,
            getAuthorizationToken,
            hasPermission,
        ]
    );
    return <Provider value={ providerValue }>{ children }</Provider>;
};

export const useAuth = () => useContext(AuthContext);
