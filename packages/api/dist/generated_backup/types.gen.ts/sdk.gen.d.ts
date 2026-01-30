import type { Client, Options as Options2, TDataShape } from './client';
import type { CreateCartData, CreateCartErrors, CreateCartResponses, CreateProductData, CreateProductErrors, CreateProductResponses, DeleteCartByIdData, DeleteCartByIdErrors, DeleteCartByIdResponses, DeleteProductByIdData, DeleteProductByIdErrors, DeleteProductByIdResponses, GetCartByIdData, GetCartByIdErrors, GetCartByIdResponses, GetCartsByUserData, GetCartsByUserErrors, GetCartsByUserResponses, GetCartsData, GetCartsErrors, GetCartsResponses, GetCategoriesData, GetCategoriesErrors, GetCategoriesResponses, GetProductByIdData, GetProductByIdErrors, GetProductByIdResponses, GetProductsByCategoryData, GetProductsByCategoryErrors, GetProductsByCategoryResponses, GetProductsData, GetProductsErrors, GetProductsResponses, GetUsersData, GetUsersErrors, GetUsersResponses, LoginData, LoginErrors, LoginResponses, UpdateCartByIdData, UpdateCartByIdErrors, UpdateCartByIdResponses, UpdateProductByIdData, UpdateProductByIdErrors, UpdateProductByIdResponses } from './types.gen';
export type Options<TData extends TDataShape = TDataShape, ThrowOnError extends boolean = boolean> = Options2<TData, ThrowOnError> & {
    /**
     * You can provide a client instance returned by `createClient()` instead of
     * individual options. This might be also useful if you want to implement a
     * custom client.
     */
    client?: Client;
    /**
     * You can pass arbitrary values through the `meta` object. This can be
     * used to access values that aren't defined as part of the SDK function.
     */
    meta?: Record<string, unknown>;
};
/**
 * Lista todos os produtos
 */
export declare const getProducts: <ThrowOnError extends boolean = false>(options?: Options<GetProductsData, ThrowOnError>) => import("./client").RequestResult<GetProductsResponses, GetProductsErrors, ThrowOnError, "fields">;
/**
 * Cria um novo produto
 */
export declare const createProduct: <ThrowOnError extends boolean = false>(options: Options<CreateProductData, ThrowOnError>) => import("./client").RequestResult<CreateProductResponses, CreateProductErrors, ThrowOnError, "fields">;
/**
 * Deleta um produto por ID
 */
export declare const deleteProductById: <ThrowOnError extends boolean = false>(options: Options<DeleteProductByIdData, ThrowOnError>) => import("./client").RequestResult<DeleteProductByIdResponses, DeleteProductByIdErrors, ThrowOnError, "fields">;
/**
 * Retorna um produto por ID
 */
export declare const getProductById: <ThrowOnError extends boolean = false>(options: Options<GetProductByIdData, ThrowOnError>) => import("./client").RequestResult<GetProductByIdResponses, GetProductByIdErrors, ThrowOnError, "fields">;
/**
 * Atualiza um produto por ID
 */
export declare const updateProductById: <ThrowOnError extends boolean = false>(options: Options<UpdateProductByIdData, ThrowOnError>) => import("./client").RequestResult<UpdateProductByIdResponses, UpdateProductByIdErrors, ThrowOnError, "fields">;
/**
 * Retorna produtos de uma categoria específica
 */
export declare const getProductsByCategory: <ThrowOnError extends boolean = false>(options: Options<GetProductsByCategoryData, ThrowOnError>) => import("./client").RequestResult<GetProductsByCategoryResponses, GetProductsByCategoryErrors, ThrowOnError, "fields">;
/**
 * Lista todas as categorias
 */
export declare const getCategories: <ThrowOnError extends boolean = false>(options?: Options<GetCategoriesData, ThrowOnError>) => import("./client").RequestResult<GetCategoriesResponses, GetCategoriesErrors, ThrowOnError, "fields">;
/**
 * Lista todos os carrinhos
 */
export declare const getCarts: <ThrowOnError extends boolean = false>(options?: Options<GetCartsData, ThrowOnError>) => import("./client").RequestResult<GetCartsResponses, GetCartsErrors, ThrowOnError, "fields">;
/**
 * Cria um novo carrinho
 */
export declare const createCart: <ThrowOnError extends boolean = false>(options: Options<CreateCartData, ThrowOnError>) => import("./client").RequestResult<CreateCartResponses, CreateCartErrors, ThrowOnError, "fields">;
/**
 * Deleta um carrinho por ID
 */
export declare const deleteCartById: <ThrowOnError extends boolean = false>(options: Options<DeleteCartByIdData, ThrowOnError>) => import("./client").RequestResult<DeleteCartByIdResponses, DeleteCartByIdErrors, ThrowOnError, "fields">;
/**
 * Retorna um carrinho por ID
 */
export declare const getCartById: <ThrowOnError extends boolean = false>(options: Options<GetCartByIdData, ThrowOnError>) => import("./client").RequestResult<GetCartByIdResponses, GetCartByIdErrors, ThrowOnError, "fields">;
/**
 * Atualiza um carrinho por ID
 */
export declare const updateCartById: <ThrowOnError extends boolean = false>(options: Options<UpdateCartByIdData, ThrowOnError>) => import("./client").RequestResult<UpdateCartByIdResponses, UpdateCartByIdErrors, ThrowOnError, "fields">;
/**
 * Retorna carrinhos de um usuário
 */
export declare const getCartsByUser: <ThrowOnError extends boolean = false>(options: Options<GetCartsByUserData, ThrowOnError>) => import("./client").RequestResult<GetCartsByUserResponses, GetCartsByUserErrors, ThrowOnError, "fields">;
/**
 * Lista todos os usuários
 */
export declare const getUsers: <ThrowOnError extends boolean = false>(options?: Options<GetUsersData, ThrowOnError>) => import("./client").RequestResult<GetUsersResponses, GetUsersErrors, ThrowOnError, "fields">;
/**
 * Autentica um usuário
 */
export declare const login: <ThrowOnError extends boolean = false>(options: Options<LoginData, ThrowOnError>) => import("./client").RequestResult<LoginResponses, LoginErrors, ThrowOnError, "fields">;
