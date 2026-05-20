export interface Thread {
  id: string;
  title: string;
  createdAt: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
}

export interface ProductData {
  name: string;
  price: number;
  description?: string;
  category?: string;
}
