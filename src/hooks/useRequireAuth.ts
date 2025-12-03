import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from '@stores/useStore.hook';

/**
 * Custom hook for authentication requirement
 * Redirects to login page if user is not authenticated
 *
 * @param redirectTo - Path to redirect if not authenticated (default: '/user/sign-in')
 * @returns Object containing authentication state
 */
export const useRequireAuth = (redirectTo?: string) => {
  const router = useRouter();
  const { UserStore } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Wait for router to be ready
        if (!router.isReady) {
          return;
        }

        setAuthError(null);

        // Auto-fetch user data if not already loaded and not currently loading
        if (UserStore.isEmpty() && !UserStore.isLoading) {
          await UserStore.fetchUser();
        }

        // Wait for loading to complete
        if (UserStore.isLoading) {
          return;
        }

        // Mark as initialized once we have a definitive authentication state
        setIsInitialized(true);

        // Check if user is authenticated
        if (!UserStore.isAuthenticated && redirectTo) {
          console.log('User not authenticated, redirecting to:', redirectTo);
          router.push(redirectTo);
          return;
        }

      } catch (error) {
        setIsInitialized(true);
        if (redirectTo) {
          console.error('Authentication check failed:', error);
          setAuthError(error instanceof Error ? error.message : 'Authentication failed');
          router.push(redirectTo);
        }
      }
    };

    checkAuthentication();
  }, [router, router.isReady, UserStore.isAuthenticated, UserStore.isLoading, redirectTo]);

  const isLoading = !isInitialized || UserStore.isLoading;

  return {
    isLoading,
    isAuthenticated: isInitialized && UserStore.isAuthenticated,
    authError,
    user: UserStore.user,
  };
};

export default useRequireAuth;