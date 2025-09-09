import { createContext, useContext, useEffect, useMemo, useState } from "react";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { decodeJwtToken } from "../helpers/decodeJwtToken";
import { useLoginUser } from "../api/loginUser/useLoginUser";
import { useSignupUser } from "../api/signupUser/useSignupUser";
import { useLogoutUser } from "../api/logoutUser/useLogoutUser";
import { refreshToken } from "../api/refreshToken";

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthProviderValue = {
  isAuthenticated: boolean;
  userId: string | undefined;
  // Methods
  login: (data: { username: string; password: string }) => void;
  signup: (data: {
    email: string;
    username: string;
    password: string;
    birthDate: string;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthProviderValue | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    cookies.get("access_token"),
  );
  const refreshTokenCookie = cookies.get("refresh_token");

  const decodedAccessToken = useMemo<{ userId: string } | undefined>(() => {
    return decodeJwtToken<{ userId: string }>({
      token: accessToken,
    });
  }, [accessToken]);

  const isAuthenticated = useMemo<boolean>(() => {
    return accessToken !== undefined ? true : false;
  }, [accessToken]);

  const [userId, setUserId] = useState<string | undefined>(
    decodedAccessToken?.userId,
  );

  const navigate = useNavigate();
  const { mutate: loginUser } = useLoginUser();
  const { mutate: signupUser } = useSignupUser();
  const { mutate: logoutUser } = useLogoutUser();

  useEffect(() => {
    if (!accessToken && refreshTokenCookie) {
      refreshToken().then(() => {
        setAccessToken(cookies.get("access_token"));
        navigate("/");
      });
    }
  }, [navigate, accessToken, refreshTokenCookie]);

  const login = (data: { username: string; password: string }) => {
    loginUser(data, {
      onError: (error) => {
        console.error("Error logging in!", error);
        toast("Error logging in!");
      },
      onSuccess: () => {
        setUserId(decodedAccessToken?.userId);
        setAccessToken(cookies.get("access_token"));
        navigate("/");
      },
    });
  };

  const logout = () => {
    logoutUser(undefined, {
      onError: (error) => {
        console.error("Error logging out!", error);
        toast("Error logging out!");
      },
      onSuccess: () => {
        setUserId(undefined);
        navigate("/login");
      },
    });
  };

  const signup = (data: {
    email: string;
    username: string;
    password: string;
    birthDate: string;
  }) => {
    signupUser(data, {
      onError: (error) => {
        console.error("Error signing up!", error);
        toast("Error signing up!");
      },
      onSuccess: () => {
        toast("Successfully signed up!");
        navigate("/login");
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userId, login, logout, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthProviderValue => {
  const authContext = useContext(AuthContext);

  const auth = useMemo(() => {
    if (!authContext) {
      throw new Error("useAuth must be used within an AuthProvider");
    }

    const auth: AuthProviderValue = {
      isAuthenticated: authContext.isAuthenticated,
      userId: authContext.userId,
      login: authContext.login,
      logout: authContext.logout,
      signup: authContext.signup,
    };

    return auth;
  }, [authContext]);

  return auth;
};
