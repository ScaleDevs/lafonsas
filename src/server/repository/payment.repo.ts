import { TRPCError } from '@trpc/server';
import { Prisma } from '@prisma/client';
import prisma from './prisma.client';
import { IPayment, IPaginationInputs } from '@/utils/types';

export type IFindPaymentsInput = {
  vendor?: string;
  refNo?: string;
  dateFilter?: {
    startDate: Date | string;
    endDate: Date | string;
  };
} & IPaginationInputs;

class Respository {
  public async createPayment(data: Omit<IPayment, 'paymentId'>) {
    return prisma.payment.create({
      data: {
        ...data,
      },
    });
  }

  public async findPaymentById(paymentId: string) {
    return prisma.payment.findFirst({ where: { paymentId } });
  }

  public async findPaymentByRefNo(refNo: string) {
    return prisma.payment.findFirst({ where: { refNo } });
  }

  public async findPayments({ dateFilter, refNo, vendor, page, limit }: IFindPaymentsInput) {
    const whereFilter: Prisma.PaymentWhereInput = {};

    if (!dateFilter && !refNo && !vendor) throw new TRPCError({ code: 'BAD_REQUEST', message: 'There are no filters applied!' });

    if (!!refNo)
      whereFilter['refNo'] = {
        equals: refNo,
      };
    else if (!!dateFilter) {
      whereFilter['refDate'] = {
        gte: dateFilter.startDate,
        lte: dateFilter.endDate,
      };

      if (!!vendor)
        whereFilter['storeId'] = {
          equals: vendor,
        };
    }

    const result = await prisma.payment.findMany({
      where: whereFilter,
      distinct: ['paymentId'],
      orderBy: { refDate: 'asc' },
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
    });

    const totalCount = await prisma.payment.count({ where: whereFilter });

    return {
      pageCount: Math.ceil(totalCount / limit),
      records: result,
    };
  }

  public async updatePayment(paymentId: string, paymentPartialData: Partial<IPayment>) {
    return prisma.payment.update({
      where: {
        paymentId,
      },
      data: paymentPartialData,
    });
  }

  public async deletePayment(paymentId: string) {
    return prisma.payment.delete({
      where: {
        paymentId,
      },
    });
  }
}

export const PaymentRepository = new Respository();
