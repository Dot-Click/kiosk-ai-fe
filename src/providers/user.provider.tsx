import {
  FC,
  useState,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";
import { createAuthClient, type BetterFetchError } from "better-auth/react";
import {
  adminClient,
  emailOTPClient,
  twoFactorClient,
  phoneNumberClient,
} from "better-auth/client/plugins";
import * as permissions from "@/configs/permissions.config";
import { backendDomain } from "@/configs/axios.config";
import { SafariCookieWarning } from "@/components/common/safaricookiewarning";

const { ac, ...roles } = permissions;

export const authClient = createAuthClient({
  plugins: [
    adminClient({ ac, roles }),
    emailOTPClient(),
    phoneNumberClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        // Let Better Auth handle the 2FA redirect properly
        console.log("2FA redirect detected - Better Auth handling the flow");
        // Don't prevent the default behavior - let Better Auth establish the session
      },
    }),
  ],
  baseURL: backendDomain,
  fetchOptions: {
    credentials: "include", // Ensure cookies are sent with requests
  },
});

export type SessionObject = typeof authClient.$Infer.Session;
export type Role = keyof typeof roles;

type Data = {
  // Typed role property( Modify as needed )
  user: SessionObject["user"] & { role: Role; twoFactorMethod: string | null };
  session: SessionObject["session"];
};

interface ContextData {
  refetchUser: () => void;
  isLoading: boolean;
  data: Data | null;
  showSafariWarning: boolean;
  setShowSafariWarning: (show: boolean) => void;
}

// Global 2FA State Context
interface TwoFactorContextData {
  showTwoFactor: boolean;
  userEmail: string;
  rememberMe: boolean;
  twoFactorMethod: string | null;
  userPhone: string | null;
  setShowTwoFactor: (show: boolean) => void;
  setUserEmail: (email: string) => void;
  setRememberMe: (remember: boolean) => void;
  setTwoFactorMethod: (method: string | null) => void;
  setUserPhone: (phone: string | null) => void;
  resetTwoFactorState: () => void;
}

const TwoFactorContext = createContext<TwoFactorContextData>({} as any);

export const useTwoFactor = () => {
  const context = useContext(TwoFactorContext);
  if (!context) {
    throw new Error("useTwoFactor must be used within a TwoFactorProvider");
  }
  return context;
};

interface BeterAuthProviderProps extends PropsWithChildren {
  /**
   * @type boolean
   * @default false
   * @description periodically fetches user if server throws error while fetching session, should be used for development reason.
   */
  refetchOnError?: boolean;
  /**
   * @type function
   * @param error Error
   * @returns void
   * @description contains session error.
   */
  onError?: (error: BetterFetchError) => void;
}

const UserAuthContext = createContext<ContextData>({} as any);

/**
 * UserProvider supplies authentication and user session context to the application.
 *
 * This provider manages user state, session, and loading status, and should wrap your app at the top level
 * (e.g., in App.tsx or main layout) to ensure all components have access to user context via useUser().
 *
 * @example
 *   <UserProvider>
 *     <App />
 *   </UserProvider>
 *
 * Must be used at the top level of your React component tree.
 */
export const UserProvider: FC<BeterAuthProviderProps> = ({
  onError,
  children,
  refetchOnError = false,
}) => {
  const { data: authData, isPending, error, refetch } = authClient.useSession();
  const [data, setData] = useState<ContextData["data"]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refetchUser = refetch;
  const [showSafariWarning, setShowSafariWarning] = useState(false);

  // Global 2FA State
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  const resetTwoFactorState = () => {
    setShowTwoFactor(false);
    setUserEmail("");
    setRememberMe(false);
    setTwoFactorMethod(null);
    setUserPhone(null);
  };

  useEffect(() => {
    if (isPending) {
      setIsLoading(true);
      return;
    }
    if (authData?.user && authData?.session) {
      setData(authData as Data);
      setIsLoading(false);
      // Reset 2FA state when user is authenticated
      resetTwoFactorState();
    } else {
      setData(null);
      setIsLoading(false);
    }
    if (error) {
      onError?.(error);
      if (refetchOnError) {
        setTimeout(() => {
          refetchUser();
        }, 1000);
      }
    }
  }, [authData, isPending, error, onError, refetchOnError]);

  const twoFactorValue: TwoFactorContextData = {
    showTwoFactor,
    userEmail,
    rememberMe,
    twoFactorMethod,
    userPhone,
    setShowTwoFactor,
    setUserEmail,
    setRememberMe,
    setTwoFactorMethod,
    setUserPhone,
    resetTwoFactorState,
  };

  const handleSafariRefresh = () => {
    setShowSafariWarning(false);
    window.location.reload();
  };

  const handleSafariCancel = () => {
    setShowSafariWarning(false);
  };

  return (
    <TwoFactorContext.Provider value={twoFactorValue}>
      <UserAuthContext.Provider
        value={{
          data,
          isLoading,
          refetchUser,
          showSafariWarning,
          setShowSafariWarning,
        }}
      >
        {children}
        <SafariCookieWarning
          showWarning={showSafariWarning}
          onRefresh={handleSafariRefresh}
          onCancel={handleSafariCancel}
        />
      </UserAuthContext.Provider>
    </TwoFactorContext.Provider>
  );
};

/**
 * useUser is a custom hook that provides access to the current user, session, loading state, and a refetch function.
 *
 * Must be used within a UserProvider.
 *
 * @example
 *   const { data, isLoading, refetchUser } = useUser();
 *   if (isLoading) return <div>Loading...</div>;
 *   if (data?.user) return <div>Hello, {data.user.name}!</div>;
 *
 */
export const useUser = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("userUser must be used within a UserProvider");
  }
  return context;
};

export type UseUser = ReturnType<typeof useUser>;
