import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  name: string;
  price: number;
  description?: string;
  category?: string;
}

export function ProductCard({ name, price, description, category }: ProductCardProps) {
  return (
    <div className="my-2 max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <div className="flex h-32 items-center justify-center bg-muted">
        <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-50" />
      </div>
      <div className="p-4">
        {category && (
          <span className="mb-1 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {category}
          </span>
        )}
        <h3 className="text-lg font-semibold">{name}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">{price.toLocaleString('ru-RU')} ₽</span>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}
