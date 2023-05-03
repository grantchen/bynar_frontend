import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useReducer, createContext, useMemo ,useState} from "react";
import { BaseURL } from "../constant";
import { Auth } from "aws-amplify";
const initialState = {
  signin: () =>
    Promise.resolve(null),
  signout: () => Promise.resolve(null),
  user: null,
  token: null,
  isLoggedIn: false,
  error: null,
  isLoading: false,
  isValidLogin: false,
  theme: null,
  lang: null,
}
export const AuthContext = createContext(initialState)
const { Provider, Consumer } = AuthContext;
const simpleReducer = (state, payload) => ({ ...state, ...payload });

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useReducer(simpleReducer, initialState);
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        setState({
          token,
          isLoggedIn: true,
        });
      }
    } catch (e) {
      setState({
        token: null,
        isLoggedIn: false,
        name: null,
        theme: null,
        lang: null,
      });
    } finally {
      setState({
        isFirstRender: false,
      });
    }
  }, []);

  

  useEffect(() => {
    if (!isMounted) {
      const tokenCheck = localStorage.getItem("token");
      if (tokenCheck !== null) {
        if (location.pathname === '/signin' || location.pathname === '/forgotpassword' || location.pathname === '/signup' || location.pathname === '/home' || location.pathname === '/dashboard') {
          navigate('/home/dashboard')
        }
        else if (location.pathname === '/userlist') {
          navigate('/userlist')
        }
        else if (location.pathname === '/datatable') {
          navigate('/home/datatable')
        }
      } else {
        debugger;
        if (location.pathname === '/home' || location.pathname === '/dashboard' || location.pathname === '/datatable' || location.pathname === '/tearsheet' || location.pathname === '/adduser' || location.pathname === '/userlist' || location.pathname === '/datatable' || location.pathname === '/home/userlist' || location.pathname === '/home/dashboard' || location.pathname === '/home/datatable') {
          navigate('/home/dashboard');
        }

      }
    }
    setIsMounted(true);
  }, [location, navigate, isMounted]);


  const signin = async (data, isMfa) => {
    try {
      setState({ isLoading: true, isValidLogin: false });
      let endPoint = "";
      let token = "";
      let message = "";
      if (isMfa) {
        endPoint = "mfa";
      }
      else {
        endPoint = "login";
      }
      const response = await fetch(`${BaseURL}/${endPoint}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json();
      if (response.ok) {
        token = res.Token;
        message = res.message;
      }
      else {
        return res;
      }
      if (token) {
        setState({
          isLoggedIn: true,
          token,
          error: null
        });
        localStorage.setItem("token", token);
        localStorage.setItem("theme", 'carbon-theme--white');
        localStorage.setItem("lang", "english");
        const bodyElement = document.body;
        bodyElement.className = localStorage.getItem("theme");
        navigate("/dashboard");

      } else {
        setState({
          inValidLogin: true,
          isLoggedIn: false,
          token: null
        });
        return res;
      }
    } catch (e) {
      setState({ error: "Error logging in" });
      return { error: "Error logging in" }
    } finally {
      setState({ isLoading: false });
    }
  };

  const signout = async () => {
    try {
      await Auth.signOut()
      localStorage.removeItem("token");
      localStorage.removeItem("theme");
      localStorage.removeItem("lang");
      navigate("/signin");
      setState({
        user: null,
        token: null,
        isLoggedIn: false
      });
    }
    catch (e) {
      console.log(e)
    }
  };


  const providerValue = useMemo(
    () => ({
      ...state,
      signin,
      signout,
    }),
    [
      state,
      signin,
      signout,
    ]
  )
  return (
    <Provider value={providerValue}>
      {children}
    </Provider>
  )
}