// Type definitions for the Racing Roundup website

export interface Article {
  _id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'F1' | 'MotoGP' | 'Other';
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleCardProps {
  article: Article;
}

export interface ArticleListProps {
  articles: Article[];
  loading: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}
