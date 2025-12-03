/**
 * ProfileBox Component Types
 * 
 * Type definitions for the ProfileBox component and related functionality
 */

export interface ProfileBoxProps {
  /** Additional CSS classes to apply to the component */
  className?: string;
}

export interface UserStats {
  /** Number of posts written by the user */
  posts: number;
  /** Number of comments made by the user */
  comments: number;
  /** Number of likes received by the user */
  likes: number;
  /** Number of items scrapped by the user */
  scraps: number;
}

export interface MenuItem {
  /** Icon component to display */
  icon: React.ReactNode;
  /** Label text for the menu item */
  label: string;
  /** Count/number to display for this menu item */
  count: number;
  /** Optional click handler for the menu item */
  onClick?: () => void;
  /** Optional href for navigation */
  href?: string;
}

export interface ProfileImageProps {
  /** Source URL of the profile image */
  src?: string | null;
  /** Alt text for the image */
  alt: string;
  /** Size of the profile image */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

export interface SchoolInfo {
  /** Name of the school/university */
  name: string;
  /** Optional school code or identifier */
  code?: string;
  /** Optional school type */
  type?: 'university' | 'college' | 'high_school' | 'other';
}

export interface UserDisplayInfo {
  /** User's display name (nickname) */
  displayName: string;
  /** User's real name */
  realName?: string;
  /** User's email address */
  email?: string;
  /** Profile image URL */
  profileImageUrl?: string | null;
  /** School information */
  school?: SchoolInfo;
  /** Whether the user is verified */
  isVerified?: boolean;
  /** Whether the user is an admin */
  isAdmin?: boolean;
}

export interface ProfileBoxState {
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Any error that occurred */
  error: string | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** User's statistics */
  stats: UserStats;
}

// Icon component prop types
export interface IconProps {
  /** Additional CSS classes for styling */
  className?: string;
  /** Size of the icon */
  size?: number;
  /** Color of the icon */
  color?: string;
}

// Hook return types
export interface UseProfileBoxReturn {
  /** User display information */
  userInfo: UserDisplayInfo;
  /** User statistics */
  stats: UserStats;
  /** Component state */
  state: ProfileBoxState;
  /** Function to refresh user data */
  refresh: () => void;
}

// Event handler types
export type ProfileBoxEventHandler = (event: React.MouseEvent<HTMLDivElement>) => void;
export type MenuItemClickHandler = (item: MenuItem, index: number) => void;

// Style variant types
export type ProfileBoxVariant = 'default' | 'compact' | 'detailed';
export type ProfileBoxTheme = 'light' | 'dark' | 'auto';

// Configuration types
export interface ProfileBoxConfig {
  /** Whether to show user statistics */
  showStats?: boolean;
  /** Whether to show school information */
  showSchool?: boolean;
  /** Whether to enable hover effects */
  enableHover?: boolean;
  /** Custom menu items to display */
  customMenuItems?: MenuItem[];
  /** Variant of the profile box */
  variant?: ProfileBoxVariant;
  /** Theme preference */
  theme?: ProfileBoxTheme;
}