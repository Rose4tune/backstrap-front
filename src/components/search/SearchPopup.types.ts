export interface RecentSearchItem {
  id: string;
  keyword: string;
  searchedAt: Date;
}

export interface PopularKeywordItem {
  id: number;
  keyword: string;
  rank: number;
  isNew?: boolean;
}

export interface SearchPopupProps {
  onClose?: () => void;
  onSearch?: (keyword: string) => void;
  accessToken?: string;
}