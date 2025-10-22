export interface SimpleCategory {
    id: number,
    nombre: string
}


export interface CreateProductRequest {

    nombre: string;
    image?: File | null; 
    image_url?: string | null;
    marca: string;
    descripcion?: string | null;
    precio: number;
    stock: number;
    category_id?: number; 
    estado?: boolean;
}
