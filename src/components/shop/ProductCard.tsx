
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ShoppingCart, Heart } from 'lucide-react';
import { addToCart } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Retiré des favoris" : "Ajouté aux favoris",
      description: `${product.name} a été ${isWishlisted ? "retiré de" : "ajouté à"} votre liste de favoris.`,
    });
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-4 shadow-sm border border-border/40",
        "hover-scale transition-all overflow-hidden h-full flex flex-col",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
        <button 
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full z-10 shadow-sm backdrop-blur-sm hover:bg-white transition-colors"
          aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart 
            size={18} 
            className={cn(
              "transition-colors",
              isWishlisted 
                ? "fill-red-500 text-red-500" 
                : "text-gray-400 hover:text-red-500"
            )} 
          />
        </button>
        
        <Link to={`/shop/${product.id}`}>
          <div className={cn(
            "w-full h-full bg-gray-100 relative",
            !isImageLoaded && "animate-pulse"
          )}>
            <img
              src={product.image}
              alt={product.name}
              onLoad={() => setIsImageLoaded(true)}
              className={cn(
                "object-cover w-full h-full transition-opacity duration-300",
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}
            />
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            )} />
          </div>
        </Link>
      </div>
      
      <div className="flex-grow">
        <Link to={`/shop/${product.id}`} className="block">
          <h3 className="font-medium text-foreground line-clamp-2 mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.category}</p>
      </div>
      
      <div className="mt-auto flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-foreground">{product.price.toLocaleString()} FCFA</p>
          {product.oldPrice && (
            <p className="text-sm text-muted-foreground line-through">
              {product.oldPrice.toLocaleString()} FCFA
            </p>
          )}
        </div>
        
        <Button 
          onClick={handleAddToCart} 
          className="w-full group"
        >
          <ShoppingCart size={16} className="mr-2" />
          <span>Ajouter au panier</span>
        </Button>
      </div>
    </div>
  );
};
