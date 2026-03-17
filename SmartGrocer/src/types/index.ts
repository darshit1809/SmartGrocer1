export interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}

export interface InvoiceItem {
    productId: string;
    quantity: number;
    totalPrice: number;
}

export interface Invoice {
    id: string;
    items: InvoiceItem[];
    totalAmount: number;
}

export interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export interface InventoryContextType {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (id: string, quantity: number) => void;
}