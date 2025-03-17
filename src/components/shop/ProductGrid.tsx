
import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/types';
import { getAllProducts } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface ProductGridProps {
  category?: string;
}

export const ProductGrid = ({ category }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || '');
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        
        // Calculate max price for range filter
        if (allProducts.length > 0) {
          const maxPrice = Math.max(...allProducts.map(p => p.price));
          setPriceRange([0, maxPrice]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever they change
    let result = products;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(term) || 
             p.description.toLowerCase().includes(term) ||
             p.category.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Apply price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    setFilteredProducts(result);
  }, [searchTerm, priceRange, selectedCategory, products]);

  // Get unique categories for the filter
  const categories = [...new Set(products.map(p => p.category))];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-border/40 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="h-5 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-border/40">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="w-full lg:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-input w-full"
              >
                <option value="">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0] === 0 ? '' : priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                className="glass-input w-full"
              />
              <span className="text-muted-foreground">à</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1] === 1000000 ? '' : priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 1000000])}
                className="glass-input w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            <span>{filteredProducts.length} produits trouvés</span>
          </div>
          
          {selectedCategory || searchTerm || priceRange[0] > 0 || priceRange[1] < 1000000 ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange([0, 1000000]);
              }}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          ) : null}
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
          <p className="text-muted-foreground">Essayez d'ajuster vos filtres pour voir plus de produits.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index % 4 * 100}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
