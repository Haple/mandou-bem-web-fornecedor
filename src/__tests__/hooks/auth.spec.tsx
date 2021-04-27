import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import api from '~/services/api';
import { useAuth, AuthProvider } from '~/hooks/auth';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      provider: {
        id: 'provider-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'jwt-token',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@MandouBemFornecedor:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@MandouBemFornecedor:provider',
      JSON.stringify(apiResponse.provider),
    );

    expect(result.current.provider.email).toEqual('johndoe@example.com');
  });

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@MandouBemFornecedor:token':
          return 'token-123';
        case '@MandouBemFornecedor:provider':
          return JSON.stringify({
            id: 'provider-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.provider.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@MandouBemFornecedor:token':
          return 'token-123';
        case '@MandouBemFornecedor:provider':
          return JSON.stringify({
            id: 'provider-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.provider).toBeUndefined();
  });

  it('should be able to update provider data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const provider = {
      id: 'provider-id',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar: 'image-test.jpg',
      is_admin: false,
    };

    act(() => {
      result.current.updateProvider(provider);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@MandouBemFornecedor:provider',
      JSON.stringify(provider),
    );

    expect(result.current.provider).toEqual(provider);
  });
});
