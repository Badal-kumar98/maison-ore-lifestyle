export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: string;
  short_description: string;
  description: string;
  details: string[];
  image_url: string;
  gallery: string[];
  materials: string;
  dimensions: string;
  origin: string;
  variants: string[];
  in_stock: boolean;
  featured: boolean;
  edition: string | null;
  sort_order: number;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
};

export type CartItem = {
  id: number;
  quantity: number;
  variant: string;
  product: Product;
};
