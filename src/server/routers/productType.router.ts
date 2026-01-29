import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { ProductTypeService } from '@/server/services/productType.service';

export const productTypeRouter = createRouter()
    .middleware(authMiddleware)
    .mutation('create', {
        input: z.object({
            name: z.string(),
            value: z.string(),
            description: z.string().optional().nullable(),
        }),
        resolve({ input }) {
            return ProductTypeService.createProductType(input);
        },
    })
    .query('getAll', {
        resolve() {
            return ProductTypeService.findAllProductTypes();
        },
    });
