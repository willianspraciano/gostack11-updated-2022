import React, {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useContext,
} from 'react';
import { api } from '../services/api';

interface IAuthState {
  token: string;
  user: object;
}

interface ISignInCredentials {
  email: string;
  password: string;
}

interface IAuthContext {
  user: object;
  signIn(credentials: ISignInCredentials): Promise<void>;
  signOut(): void;
}
interface IAuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: IAuthProviderProps) {
  const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });

  const signIn = useCallback(
    async ({ email, password }: ISignInCredentials) => {
      const response = await api.post('sessions', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('@GoBarber:token', token);
      localStorage.setItem('@GoBarber:user', JSON.stringify(user));

      setData({ token, user });
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.remove('@GoBarber:token');
    localStorage.remove('@GoBarber:user');

    setData({} as IAuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}