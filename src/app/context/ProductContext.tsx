import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product, Category, MOCK_PRODUCTS, MOCK_CATEGORIES, StockStatus, StockMovement } from '../data/productData';
import { toast } from 'sonner';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'stockMovements' | 'reservedStock' | 'isArchived'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  archiveProduct: (id: string) => void;
  adjustStock: (id: string, delta: number, type: StockMovement['type'], reason: string, referenceId?: string) => void;
  reserveStock: (id: string, qty: number, reason: string, referenceId?: string) => void;
  commitStock: (id: string, qty: number, reason: string, referenceId?: string) => void;
  releaseStock: (id: string, qty: number, reason: string, referenceId?: string) => void;
  getProductById: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
  getOutOfStockProducts: () => Product[];
  getTotalInventoryValue: () => number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

function deriveStatus(stock: number, threshold: number): StockStatus {
  if (stock <= 0) return 'Out of Stock';
  if (stock <= threshold) return 'Low Stock';
  return 'In Stock';
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);

  const addStockMovement = useCallback((productId: string, movement: Omit<StockMovement, 'id' | 'date'>) => {
    const now = new Date().toISOString();
    const newMovement: StockMovement = {
      ...movement,
      id: `MOV-${String(Date.now()).slice(-6)}`,
      date: now,
    };

    setProducts((prev: Product[]) => prev.map((p: Product) => {
      if (p.id !== productId) return p;
      return {
        ...p,
        stockMovements: [newMovement, ...p.stockMovements],
        updatedAt: now.split('T')[0],
      };
    }));
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'stockMovements' | 'reservedStock' | 'isArchived'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newProduct: Product = {
      ...product,
      id: `PRD-${String(Date.now()).slice(-4)}`,
      status: deriveStatus(product.stock, product.lowStockThreshold),
      reservedStock: 0,
      isArchived: false,
      stockMovements: [{
        id: `MOV-${String(Date.now()).slice(-6)}`,
        date: new Date().toISOString(),
        delta: product.stock,
        type: 'Inbound',
        reason: 'Initial Product Creation',
      }],
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev: Product[]) => [newProduct, ...prev]);
    toast.success(`${product.name} added to catalogue.`);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev: Product[]) => prev.map((p: Product) => {
      if (p.id !== id) return p;
      const updated = { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
      const newStatus = deriveStatus(updated.stock, updated.lowStockThreshold);
      
      if (p.status !== 'Out of Stock' && newStatus === 'Out of Stock') {
        toast.error(`${updated.name} is now out of stock!`, { duration: 5000 });
      } else if (p.status === 'In Stock' && newStatus === 'Low Stock') {
        toast.warning(`${updated.name} is reaching reorder threshold (${updated.stock} left).`);
      }

      return { ...updated, status: newStatus };
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev: Product[]) => prev.filter((p: Product) => p.id !== id));
    toast.info('Product removed from system.');
  }, []);

  const archiveProduct = useCallback((id: string) => {
    updateProduct(id, { isArchived: true });
    toast.info('Product archived and hidden from sales.');
  }, [updateProduct]);

  const adjustStock = useCallback((id: string, delta: number, type: StockMovement['type'], reason: string, referenceId?: string) => {
    setProducts((prev: Product[]) => prev.map((p: Product) => {
      if (p.id !== id) return p;
      const newStock = Math.max(0, p.stock + delta);
      const newStatus = deriveStatus(newStock, p.lowStockThreshold);
      const now = new Date().toISOString();

      if (p.status !== 'Out of Stock' && newStatus === 'Out of Stock') {
        toast.error(`${p.name} is now out of stock!`, { duration: 5000 });
      } else if (p.status === 'In Stock' && newStatus === 'Low Stock' && delta < 0) {
        toast.warning(`${p.name} is reaching reorder threshold (${newStock} left).`);
      }

      const movement: StockMovement = {
        id: `MOV-${String(Date.now()).slice(-6)}`,
        date: now,
        delta,
        type,
        reason,
        referenceId,
      };

      return {
        ...p,
        stock: newStock,
        status: newStatus,
        stockMovements: [movement, ...p.stockMovements],
        updatedAt: now.split('T')[0],
      };
    }));
  }, []);

  const reserveStock = useCallback((id: string, qty: number, reason: string, referenceId?: string) => {
    setProducts((prev: Product[]) => prev.map((p: Product) => {
      if (p.id !== id) return p;
      const movement: StockMovement = {
        id: `MOV-${String(Date.now()).slice(-6)}`,
        date: new Date().toISOString(),
        delta: qty,
        type: 'Reservation',
        reason,
        referenceId,
      };
      return {
        ...p,
        reservedStock: p.reservedStock + qty,
        stockMovements: [movement, ...p.stockMovements],
      };
    }));
  }, []);

  const commitStock = useCallback((id: string, qty: number, reason: string, referenceId?: string) => {
    setProducts((prev: Product[]) => prev.map((p: Product) => {
      if (p.id !== id) return p;
      const now = new Date().toISOString();
      const movement: StockMovement = {
        id: `MOV-${String(Date.now()).slice(-6)}`,
        date: now,
        delta: -qty,
        type: 'Commitment',
        reason,
        referenceId,
      };
      const newStock = Math.max(0, p.stock - qty);
      return {
        ...p,
        stock: newStock,
        reservedStock: Math.max(0, p.reservedStock - qty),
        status: deriveStatus(newStock, p.lowStockThreshold),
        stockMovements: [movement, ...p.stockMovements],
        updatedAt: now.split('T')[0],
      };
    }));
  }, []);

  const releaseStock = useCallback((id: string, qty: number, reason: string, referenceId?: string) => {
    setProducts((prev: Product[]) => prev.map((p: Product) => {
      if (p.id !== id) return p;
      return {
        ...p,
        reservedStock: Math.max(0, p.reservedStock - qty),
      };
    }));
  }, []);

  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);
  const getLowStockProducts = useCallback(() => products.filter(p => !p.isArchived && p.status === 'Low Stock'), [products]);
  const getOutOfStockProducts = useCallback(() => products.filter(p => !p.isArchived && p.status === 'Out of Stock'), [products]);
  const getTotalInventoryValue = useCallback(() =>
    products.reduce((sum: number, p: Product) => sum + p.price * p.stock, 0), [products]);

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      archiveProduct,
      adjustStock,
      reserveStock,
      commitStock,
      releaseStock,
      getProductById,
      getLowStockProducts,
      getOutOfStockProducts,
      getTotalInventoryValue,
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
}
