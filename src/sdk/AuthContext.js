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
    tokenClaims: null, // token claims
    theme: null,
    lang: null,
};
export const AuthContext = createContext(initialState);
const { Provider } = AuthContext;
const simpleReducer = (state, payload) => ({ ...state, ...payload });

export const AuthProvider = ({ children }) => {
    const [state, setState] = useReducer(simpleReducer, initialState);

    const navigate = useNavigate();
    const location = useLocation();
    const { i18n } = useTranslation();
    const { t } = useTranslation();

    const clearLoginState = useCallback(() => {
        setState({ token: null, user: null, tokenClaims: null });
    }, [])

    useEffect(() => {
        let unsubscribeIdTokenChanged;
        (async () => {
            try {
                const auth = getAuth();
                unsubscribeIdTokenChanged = auth.onIdTokenChanged(async (user) => {
                    if (user) {
                        const idTokenResult = await auth.currentUser.getIdTokenResult()
                        const token = idTokenResult.token
                        const claims = idTokenResult.claims
                        if (token !== state.token || claims !== state.tokenClaims) {
                            setState({ token: token, tokenClaims: claims });
                        }
                    } else {
                        console.log('clear token, id token changed')
                        clearLoginState();
                    }
                })

                await auth.authStateReady()
                if (auth.currentUser) {
                    const idTokenResult = await auth.currentUser.getIdTokenResult()
                    const token = idTokenResult.token
                    const claims = idTokenResult.claims
                    setState({ token: token, tokenClaims: claims });
                } else {
                    console.log('clear token, no currentUser')
                    clearLoginState();
                }
            } catch (e) {
                console.log(e, 'clear token, error in auth state ready')
                clearLoginState();
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
            // TODO fetch exception, not call getAuthorizationToken
            // if (token === "loading") {
            //     try {
            //         const auth = getAuth();
            //         token = await auth.currentUser?.getIdToken()
            //     } catch (error) {
            //         return new Promise();
            //     }
            // }
            let res = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: await getAuthorizationToken(),
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

    // request TreeGrid api
    const treeGridRequest = useCallback((url, param, callback) => {
        authFetch(url, {
            method: "POST",
            body: new URLSearchParams(`Data=${ param }`),
        }).then((response) => response.json())
            .then((data) => {
                callback(data)
            });
        return true
    }, [authFetch]);

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
            clearLoginState();
            console.log(e)
            throw new Error(t("login-failed-invalid"))
        }

        throw new Error('Login failed, invalid link')
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
            clearLoginState();
            throw e
        }
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
                clearLoginState();
            }
        } catch (e) {
            clearLoginState();
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

    // check if user has permission, example: hasPermission("invoices", "add")
    const hasPermission = useCallback((name, permission) => {
        if (!state?.user) {
            return false;
        }

        if (!state.user.permissions) {
            return false;
        }

        if (!state.user.permissions["services"]) {
            return false;
        }

        // return true if some of services permission matched
        return state.user.permissions["services"].some(item => {
            if (item.name === "*" || item.name === name) {
                // return true if item.permissions includes "*" or permission
                if (item.permissions.some(item => item === "*" || item === permission)) {
                    return true
                }
            }
        })
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
            treeGridRequest,
        }),
        [
            state,
            signin,
            signout,
            authFetch,
            refreshPostSignIn,
            updateUserLanguagePreference,
            updateUserThemePreference,
            getUser,
            getAuthorizationToken,
            hasPermission,
            treeGridRequest,
        ]
    );
    return <Provider value={ providerValue }>{ children }</Provider>;
};

export const useAuth = () => useContext(AuthContext);
