export interface WebsitePageData {
  id: number;
  collection_id: string;
  parent_id: string;
  data: PageData;
  company_id: number;
  website_id: number | null;
  created_at: string;
  created_by: number | null;
  updated_at: string;
  updated_by: number | null;
  status_id: number;
}

export interface PageData {
  sections: PageSection[];
}

export interface PageSection {
  id: string;
  type: string;
  image: string;
  pageId: string;
  styles: ResponsiveStyles;
  container: ElementContainer;
}

export interface ElementContainer {
  id: string;
  tag: string;
  styles: ResponsiveStyles;
  children: PageElement[];
}

export interface PageElement {
  id: string;
  tag: string;
  value?: string;
  link?: string;
  href?: string;
  src?: string;
  alt?: string;
  placeholder?: string;
  type?: string;
  styles: ResponsiveStyles;
  children?: PageElement[];
  content?: any[];
}

export interface ResponsiveStyles {
  pc: CSSStyles;
  mobile: CSSStyles;
  tablet: CSSStyles;
}

export interface CSSStyles {
  [property: string]: string | number;
}

export interface HeroSliderContent {
  link: string;
  image: string;
  title: string;
  description: string;
}

export interface CategoryProductContent {
  key: string;
  name: string;
  value: any;
  categoryId: string;
}

// Website and Page management interfaces
export interface Website {
  id: number;
  name: string;
  domain?: string;
  company_id: number;
  is_active: boolean;
  theme_config?: any;
  created_at: string;
  updated_at: string;
}

export interface WebsitePage {
  id: number;
  website_id: number;
  name: string;
  slug: string;
  title?: string;
  meta_description?: string;
  is_published: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}
