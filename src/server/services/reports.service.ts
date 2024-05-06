import dayjs from 'dayjs';
import { TRPCError } from '@trpc/server';
import prisma from '../repository/prisma.client';

class Service {
  public async getSKUReports(inputs: {
    storeId: string;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    try {
      const result = await prisma.delivery.aggregateRaw({
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $gte: [
                      '$postingDate',
                      {
                        $dateFromString: {
                          dateString: new Date(inputs.startDate).toISOString(),
                        },
                      },
                    ],
                  },
                  {
                    $lte: [
                      '$postingDate',
                      {
                        $dateFromString: {
                          dateString: new Date(inputs.endDate).toISOString(),
                        },
                      },
                    ],
                  },
                ],
              },

              storeId: { $oid: inputs.storeId },
            },
          },
          {
            $unwind: '$orders',
          },
          {
            $group: {
              _id: '$orders.size',
              qty: {
                $sum: '$orders.quantity',
              },
            },
          },
        ],
      });

      return result as unknown as { _id: string; qty: number }[];
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      });
    }
  }

  public async getDeductionsReport(inputs: {
    storeId: string;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    try {
      const result = await prisma.payment.aggregate({
        where: {
          refDate: {
            gte: inputs.startDate,
            lte: inputs.endDate,
          },
          storeId: inputs.storeId,
        },
        _sum: {
          badOrder: true,
          widthHoldingTax: true,
          otherDeductions: true,
          amount: true,
        },
      });

      return Object.entries(result._sum).map((v) => ({
        name: v[0],
        value: v[1] ?? 0,
      }));
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
      });
    }
  }
}

export const ReportService = new Service();
