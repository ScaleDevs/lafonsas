import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import useAuthStoreTrack from '@/store/auth.store';
import { trpc } from '@/utils/trpc';
import { useSyncTabs } from './useSyncTabs';

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export default function useLogin() {
  const router = useRouter();
  const { setAuthState } = useAuthStoreTrack();
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const { mutate, isLoading: isSignInLoading } = trpc.useMutation('auth.signIn');
  const { loginAllTabs } = useSyncTabs();

  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const updateAuthStates = (data: { AccessToken?: string; IdToken?: string; ExpiresIn?: number; expiresAt?: number }) => {
    setAuthState('accessToken', data.AccessToken);
    setAuthState('idToken', data.IdToken);
    setAuthState('expiresIn', data.ExpiresIn);
    setAuthState('expiresAt', data.expiresAt);
    router.push('/dashboard');
    loginAllTabs();
  };

  const signIn = (formData: typeof schema._input) => {
    mutate(formData, {
      onSuccess(data) {
        const { authResult, expiresAt } = data;
        setErrMessage(null);
        if (authResult?.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
          setAuthState('forceChangePassword', true);
          setAuthState('username', formData.username);
          authResult.Session && setAuthState('session', authResult.Session);
        } else if (authResult.AuthenticationResult)
          updateAuthStates({
            AccessToken: authResult.AuthenticationResult.AccessToken,
            IdToken: authResult.AuthenticationResult.IdToken,
            ExpiresIn: authResult.AuthenticationResult.ExpiresIn,
            expiresAt,
          });
      },
      onError(error) {
        const errorMsg = JSON.parse(error.message);
        setErrMessage(errorMsg[0].message);

        setTimeout(() => {
          setErrMessage(null);
        }, 5000);
      },
    });
  };

  return {
    isSignInLoading,
    errMessage,
    handleSubmit,
    register,
    signIn,
    updateAuthStates,
    setValue,
  };
}
