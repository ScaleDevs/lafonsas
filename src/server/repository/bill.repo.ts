import { Prisma } from '@prisma/client';
import prisma from './prisma.client';
import { IBill, IPaginationInputs } from '@/utils/types';

export type IFindBillsInput = {
  vendor?: string;
  dateFilter: {
    startDate: Date | string;
    endDate: Date | string;
  };
} & IPaginationInputs;

class Respository {
  public async createBill(billData: Omit<IBill, 'billId'>) {
    return prisma.bill.create({
      data: {
        ...billData,
      },
    });
  }

  public async findBillById(billId: string) {
    return prisma.bill.findFirst({ where: { billId } });
  }

  public async findBillByReferenceNumber(refNo: string) {
    return prisma.bill.findFirst({ where: { invoiceRefNo: refNo } });
  }

  public async findBills({ dateFilter, vendor, page, limit }: IFindBillsInput) {
    const whereFilter: Prisma.BillWhereInput = {
      date: {
        gte: dateFilter.startDate,
        lte: dateFilter.endDate,
      },
    };

    if (!!vendor)
      whereFilter['vendor'] = {
        contains: vendor,
      };

    const result = await prisma.bill.findMany({
      where: whereFilter,
      orderBy: { date: 'asc' },
      skip: page > 0 ? (page - 1) * limit : 0,
      take: limit,
    });

    const totalCount = await prisma.bill.count({ where: whereFilter });

    return {
      pageCount: Math.ceil(totalCount / limit),
      records: result,
    };
  }

  public async updateBill(billId: string, billPartialData: Partial<IBill>) {
    return prisma.bill.update({
      where: {
        billId,
      },
      data: billPartialData,
    });
  }

  public async deleteBill(billId: string) {
    return prisma.bill.delete({
      where: {
        billId,
      },
    });
  }
}

export const BillRepository = new Respository();
