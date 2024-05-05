import { TRPCError } from '@trpc/server';
import prisma from '../repository/prisma.client';

class Service {
  public async getBarGraphData(inputs: { storeId: string; startDate: Date | string; endDate: Date | string }) {
    try {
      const result = await prisma.delivery.groupBy({
        by: ['postingDate'],
        where: {
          postingDate: {
            gte: inputs.startDate,
            lte: inputs.endDate,
          },
          storeId: inputs.storeId,
        },
        _count: {
          id: true,
        },
      });

      console.log(
        'result===',
        result.map((v) => {
          return {
            name: v.postingDate,
            count: v._count.id,
          };
        }),
      );

      return result.map((v) => {
        return {
          name: v.postingDate,
          count: v._count.id,
        };
      });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' });
    }
  }
}

export const ReportService = new Service();
