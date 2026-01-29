import prisma from './prisma.client';

class Repository {
    public async createProductType(productTypeData: {
        name: string;
        value: string;
        description?: string | null;
    }) {
        return prisma.productType.create({
            data: {
                ...productTypeData,
            },
        });
    }

    public async findAllProductTypes() {
        return prisma.productType.findMany({
            orderBy: { name: 'asc' },
        });
    }
}

export const ProductTypeRepository = new Repository();
