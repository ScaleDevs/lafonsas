import { ProductTypeRepository } from '@/server/repository/productType.repo';
import { TRPCError } from '@trpc/server';

class Service {
    public async createProductType(productTypeData: {
        name: string;
        value: string;
        description?: string | null;
    }) {
        try {
            return ProductTypeRepository.createProductType({
                name: productTypeData.name.trim(),
                value: productTypeData.value.trim(),
                description: productTypeData.description?.trim() || null,
            });
        } catch (err) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong',
            });
        }
    }

    public async findAllProductTypes() {
        try {
            return ProductTypeRepository.findAllProductTypes();
        } catch (err) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong',
            });
        }
    }
}

export const ProductTypeService = new Service();
