import { useNavigate, useLocation } from "react-router-dom";
import {
    useEffect,
    useReducer,
    createContext,
    useMemo,
    useContext,
    useCallback,
} from "react";
import { BaseURL } from "./constant";
import { Auth } from "aws-amplify";
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

    useEffect(() => {
        (async () => {
            try {
                const res = await Auth.currentSession();
                if (res?.accessToken?.jwtToken) {
                    setState({ token: res?.accessToken?.jwtToken });
                } else {
                    setState({ token: null });
                }
            } catch (e) {
                // todo remove this fucking hack
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await fetch(`${BaseURL}/user`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    });
                    if (response.status === 401) {
                        localStorage.clear();
                    } else if (response.ok) {
                        setState({ token });
                        return;
                    }
                }
                setState({ token: null });
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
            } else {
                await Auth.signOut();
                navigate("/signin");
            }
        } catch (e) {
            console.log("Error signing out!");
            navigate("/signin");
        }
    }, [state.token]);
    useEffect(() => {
        getUser();
    }, [getUser]);

    useEffect(() => {
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
                    const user = await Auth.currentSession();
                    token = user?.accessToken?.jwtToken;
                } catch (error) {
                    return new Promise();
                }
            }
            let res = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            if (res.status === 401) {
                try {
                    const user = await Auth.currentSession();
                    token = user?.accessToken?.jwtToken;
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
                            "Content-Type": "application/json",
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

    const signout = useCallback(async () => {
        try {
            await Auth.signOut();
            navigate("/signin");
            setState({
                ...initialState,
                token: null,
            });
            navigate("/signin");
            // todo remove this fucking hack
            localStorage.clear();
        } catch (e) {
            console.log(e);
        }
    }, []);

    const refreshPostSignIn = useCallback(async () => {
        try {
            const res = await Auth.currentSession();
            if (res?.accessToken?.jwtToken) {
                setState({ token: res?.accessToken?.jwtToken });
            } else {
                setState({ token: null });
            }
        } catch (e) {
            setState({ token: null });
        }
    }, []);
    // todo remove this fucking hack
    const hackPatchToken = useCallback((token) => {
        localStorage.setItem("token", token);
        setState({ token });
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
            signout,
            authFetch,
            refreshPostSignIn,
            hackPatchToken,
            updateUserLanguagePreference,
        }),
        [
            state,
            signout,
            authFetch,
            refreshPostSignIn,
            hackPatchToken,
            updateUserLanguagePreference,
        ]
    );
    return <Provider value={providerValue}>{children}</Provider>;
};

export const useAuth = () => useContext(AuthContext);
