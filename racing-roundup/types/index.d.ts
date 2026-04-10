// Type definitions for Racing Roundup project

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
  loading?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export interface NavigationProps {
  transparent?: boolean;
}

export interface FooterProps {
  // Add any props needed for the Footer component
}

// Add mongoose global type augmentation to prevent TypeScript errors
declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}
