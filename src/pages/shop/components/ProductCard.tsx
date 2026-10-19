import { Link } from 'react-router-dom';
import type { SupabaseProduct } from '@/lib/supabase';
import { getProductImage, getProductFinalPrice, getProductOriginalPrice } from '@/lib/supabase';

interface ProductCardProps {
  product: SupabaseProduct;
  onAddToCart: (product: SupabaseProduct) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const image = getProductImage(product);
  const finalPrice = getProductFinalPrice(product);
  const originalPrice = getProductOriginalPrice(product);
  const meta = product.metadata || {};
  return (
    <div className="group">
      <Link to={`/shop/${product.id}`} className="block">
        <div className="w-full rounded-xl overflow-hidden bg-stone-100 mb-3 relative" style={{ aspectRatio: '4/3' }}>
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            {meta.isNew && (
              <span className="px-2 py-0.5 bg-stone-900 text-white text-xs rounded-full font-medium">NEW</span>
            )}
            {meta.isBest && (
              <span className="px-2 py-0.5 bg-stone-800 text-white text-xs rounded-full font-medium">BEST</span>
            )}
          </div>
        </div>
      </Link>

      <div>
        <p className="text-xs text-stone-400 mb-1">{meta.subCategory || ''}</p>
        <Link to={`/shop/${product.id}`}>
          <h3 className="text-sm font-medium text-stone-800 mb-1.5 hover:text-stone-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <i className="ri-star-fill text-stone-600 text-xs"></i>
          <span className="text-xs text-stone-500">{meta.rating ?? 0} ({meta.reviewCount ?? 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-800">{finalPrice.toLocaleString()}원</span>
            {originalPrice != null && (
              <span className="text-xs text-stone-400 line-through">{originalPrice.toLocaleString()}원</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
          >
            <i className="ri-shopping-bag-line text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
