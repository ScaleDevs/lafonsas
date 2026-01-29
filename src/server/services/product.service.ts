import { productRepository } from '@/server/repository/product.repo';
import { TRPCError } from '@trpc/server';

class Service {
    public async createProduct(productData: {
        name: string;
        value: string;
        description?: string | null;
    }) {
        try {
            return productRepository.createProduct({
                name: productData.name.trim(),
                value: productData.value.trim(),
                description: productData.description?.trim() || null,
            });
        } catch (err) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong',
            });
        }
    }

    public async findAllProducts() {
        try {
            return productRepository.findAllProducts();
        } catch (err) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong',
            });
        }
    }
}

export const productService = new Service();
