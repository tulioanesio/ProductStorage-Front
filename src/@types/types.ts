export interface Category {
 id: number;
 name: string;
 size: string;
 packaging: string;
}

export interface ProdutoType {
 id: number;
 name: string;
 unitPrice: number;
 unitOfMeasure: string;
 availableStock: number;
 minQuantity: number;
 maxQuantity: number;
 category: Category;
}

export interface PageResponse<T> {
 content: T[];
 totalElements: number;
 totalPages: number;
 number: number;
 size: number;
 first: boolean;
 last: boolean;
}
