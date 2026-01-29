import prisma from './prisma.client';

class Repository {
    public async createProduct(productData: {
        name: string;
        value: string;
        description?: string | null;
    }) {
        return prisma.productType.create({
            data: {
                ...productData,
            },
        });
    }

    public async findAllProducts() {
        return prisma.productType.findMany({
            orderBy: { name: 'asc' },
        });
    }
}

export const productRepository = new Repository();
