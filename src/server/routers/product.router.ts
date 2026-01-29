import { z } from 'zod';
import { createRouter } from '../createRouter';
import { authMiddleware } from '../util';
import { productService } from '@/server/services/product.service';

export const productRouter = createRouter()
    .middleware(authMiddleware)
    .mutation('create', {
        input: z.object({
            name: z.string(),
            value: z.string(),
            description: z.string().optional().nullable(),
        }),
        resolve({ input }) {
            return productService.createProduct(input);
        },
    })
    .query('getAll', {
        resolve() {
            return productService.findAllProducts();
        },
    });
