import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface Provider {
  id: string;
  company_name: string;
  cnpj: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  provider: Provider;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  provider: Provider;
  token: string;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateProvider(provider: Provider): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@MandouBemFornecedor:token');
    const provider = localStorage.getItem('@MandouBemFornecedor:provider');

    if (token && provider) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, provider: JSON.parse(provider) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('provider/sessions', {
      email,
      password,
    });

    const { token, provider } = response.data;

    localStorage.setItem('@MandouBemFornecedor:token', token);
    localStorage.setItem(
      '@MandouBemFornecedor:provider',
      JSON.stringify(provider),
    );

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, provider: provider });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@MandouBemFornecedor:token');
    localStorage.removeItem('@MandouBemFornecedor:provider');

    setData({} as AuthState);
  }, []);

  const updateProvider = useCallback(
    (provider: Provider) => {
      localStorage.setItem(
        '@MandouBemFornecedor:provider',
        JSON.stringify(provider),
      );

      setData({
        token: data.token,
        provider: provider,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{
        provider: data.provider,
        signIn,
        signOut,
        updateProvider: updateProvider,
        token: data.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
export { AuthProvider, useAuth };
