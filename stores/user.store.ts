import { makeAutoObservable, runInAction } from 'mobx';
import { enableStaticRendering } from 'mobx-react-lite';
import { parse } from 'cookie';

import { COOKIE_NS } from '@constants/common/cookie.constant';
import getMe from 'src/apis/user/getMe';
import { components } from 'src/types/api';

import RootStore from '@stores/root.store';

type UserEntityView = components['schemas']['UserEntityView'];

const ssr = typeof window === 'undefined';
enableStaticRendering(ssr);

// Default user state for REST API
const DEFAULT_USER: Partial<UserEntityView> = {
  uuid: '',
  email: '',
  name: '',
  realName: '',
  isAdmin: false,
  schoolVerificationStatus: 'NONE',
  provider: 'APP',
  studentType: 'NONE',
  status: 'NOT_VERIFIED',
  profileImage: '',
  profileImageUrl: '',
  description: '',
  school: undefined,
  isPushNotificationOn: true,
  isSecret: false,
  isBlocked: false,
  isFollowedByMe: false,
  entityStatus: 'ACTIVE'
};

// Loading states
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

class UserStore {
  rootStore: RootStore;
  accessToken: string;
  // User data
  user: UserEntityView = DEFAULT_USER as UserEntityView;

  // Loading states
  loadingState: LoadingState = LoadingState.IDLE;
  error: string | null = null;

  // Cache control
  lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(root: RootStore) {
    makeAutoObservable(this, {
      rootStore: false // Don't make rootStore observable
    });
    this.accessToken = '';
    this.rootStore = root;
  }

  /**SSR에서 넘겨받은 정보 저장 */
  hydrate = (user: UserEntityView | Partial<UserEntityView>) => {
    if (!user) return;
    runInAction(() => {
      this.user = { ...(this.user ?? {}), ...user } as UserEntityView;
      this.lastFetchTime = Date.now();
      this.loadingState = LoadingState.SUCCESS;
      this.error = null;
    });
  };

  /**
   * Fetch user data from REST API
   */
  fetchUser = async (forceRefresh: boolean = false): Promise<void> => {
    // Skip if running on server
    if (ssr) return;

    // Check cache validity
    const now = Date.now();
    if (!forceRefresh && this.isDataFresh() && !this.isEmpty()) {
      return;
    }

    // Get access token from cookies
    const accessToken = this.getAccessTokenFromCookies();
    if (!accessToken) {
      this.handleNoAuth();
      return;
    } else this.accessToken = accessToken;

    this.setLoadingState(LoadingState.LOADING);

    try {
      const response = await getMe(accessToken);

      runInAction(() => {
        if (response.success && response.data) {
          this.user = response.data;
          this.lastFetchTime = now;
          this.loadingState = LoadingState.SUCCESS;
          this.error = null;
        } else {
          this.handleError(response.messages || 'Failed to fetch user data');
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Network error occurred while fetching user data';

      this.handleError(errorMessage);
    }
  };

  /**
   * Refresh user data (force fetch)
   */
  refreshUser = (): Promise<void> => {
    return this.fetchUser(true);
  };

  /**
   * Reset user store to default state
   */
  reset = (): void => {
    runInAction(() => {
      this.user = DEFAULT_USER as UserEntityView;
      this.loadingState = LoadingState.IDLE;
      this.error = null;
      this.lastFetchTime = 0;
    });
  };

  /**
   * Update user data locally (optimistic update)
   */
  updateUser = (userData: Partial<UserEntityView>): void => {
    runInAction(() => {
      this.user = { ...this.user, ...userData };
    });
  };

  // ===================
  // PRIVATE METHODS
  // ===================

  private getAccessTokenFromCookies = (): string | null => {
    try {
      const cookies = parse(document.cookie);
      if (!cookies[COOKIE_NS]) return null;

      const cookieData = JSON.parse(cookies[COOKIE_NS]);
      return cookieData?.authPayload?.access_token || null;
    } catch (error) {
      console.warn('Failed to parse auth cookie:', error);
      return null;
    }
  };

  private handleNoAuth = (): void => {
    runInAction(() => {
      this.reset();
      this.loadingState = LoadingState.ERROR;
      this.error = 'Authentication required';
    });
  };

  private handleError = (errorMessage: string): void => {
    runInAction(() => {
      this.loadingState = LoadingState.ERROR;
      this.error = errorMessage;
      console.error('UserRestStore error:', errorMessage);
    });
  };

  private setLoadingState = (state: LoadingState): void => {
    runInAction(() => {
      this.loadingState = state;
      if (state === LoadingState.LOADING) {
        this.error = null;
      }
    });
  };

  private isDataFresh = (): boolean => {
    const now = Date.now();
    return (now - this.lastFetchTime) < this.CACHE_DURATION;
  };

  // ===================
  // COMPUTED PROPERTIES
  // ===================

  /**
   * Check if user data is empty
   */
  isEmpty = (): boolean => {
    return !this.user.uuid || this.user.uuid.length === 0;
  };

  /**
   * Check if user is authenticated
   */
  get isAuthenticated(): boolean {
    return !this.isEmpty() && this.loadingState !== LoadingState.ERROR;
  }

  /**
   * Check if user is admin
   */
  get isAdmin(): boolean {
    return !!this.user.isAdmin;
  }

  /**
   * Check if user is verified
   */
  get isVerified(): boolean {
    return (this.user.schoolVerificationStatus === 'APPROVED');
  }

  /**
   * Check if data is currently loading
   */
  get isLoading(): boolean {
    return this.loadingState === LoadingState.LOADING;
  }

  /**
   * Check if there's an error
   */
  get hasError(): boolean {
    return this.loadingState === LoadingState.ERROR && !!this.error;
  }

  /**
   * Get user's display name
   */
  get displayName(): string {
    return this.user.name || this.user.realName || this.user.email || 'Unknown User';
  }

  /**
   * Get user's profile image URL
   */
  get profileImageUrl(): string | null {
    return this.user.profileImageUrl || this.user.profileImage || null;
  }

  /**
   * Check if user has completed profile
   */
  get hasCompleteProfile(): boolean {
    return !!(
      this.user.name &&
      this.user.email &&
      this.user.school &&
      this.user.major
    );
  }

  // ===================
  // CONVENIENCE GETTERS
  // ===================

  /**
   * Get current user data (auto-fetch if needed)
   */
  getUser = (): UserEntityView => {
    // Auto-fetch if empty and not SSR
    if (this.isEmpty() && !ssr && this.loadingState === LoadingState.IDLE) {
      this.fetchUser();
    }
    return this.user;
  };

  /**
   * Get user UUID
   */
  getUserId = (): string => {
    return this.user.uuid || '';
  };

  /**
   * Get user email
   */
  getUserEmail = (): string => {
    return this.user.email || '';
  };

  /**
   * Get user school information
   */
  getUserSchool = () => {
    return this.user.school;
  };

  /**
 * Get user accessToken
 */
  getAccessToken = (): string => {
    return this.accessToken;
  };

  /**
   * Check specific permission
   */
  hasPermission = (permission: 'admin' | 'verified' | 'active'): boolean => {
    switch (permission) {
      case 'admin':
        return this.isAdmin;
      case 'verified':
        return this.isVerified;
      case 'active':
        return this.user.status === 'ACTIVATED';
      default:
        return false;
    }
  };

  // ===================
  // LEGACY COMPATIBILITY (for easier migration from MeStore)
  // ===================

  /**
   * Legacy compatibility methods
   */
  get me(): UserEntityView {
    return this.user;
  }

  refetch = (): Promise<boolean> => {
    return this.fetchUser(true).then(() => !this.isEmpty());
  };

  getMe = (): UserEntityView => {
    return this.getUser();
  };

  getUUID = (): string => {
    return this.getUserId();
  };
}

export default UserStore;