import superjson from 'superjson';
import { createRouter } from '../createRouter';
import { authRouter } from './auth.router';
import { deliveryRouter } from './delivery.router';
import { storeRouter } from './store.router';
import { billRouter } from './bill.router';
import { expenseRouter } from './expense.router';
import { accountRouter } from './account.router';
import { paymentRouter } from './payment.router';
import { reportRouter } from './report.router';
import { productTypeRouter } from './productType.router';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  .transformer(superjson)
  .query('health', {
    resolve() {
      return {
        code: 200,
        status: 'healthy',
      };
    },
  })
  .merge('auth.', authRouter)
  .merge('delivery.', deliveryRouter)
  .merge('store.', storeRouter)
  .merge('bill.', billRouter)
  .merge('expense.', expenseRouter)
  .merge('account.', accountRouter)
  .merge('payment.', paymentRouter)
  .merge('reports.', reportRouter)
  .merge('productType.', productTypeRouter);

export type AppRouter = typeof appRouter;
