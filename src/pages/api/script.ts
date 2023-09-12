import { NextApiRequest, NextApiResponse } from 'next';
// import prisma from '@/server/repository/prisma.client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('========== RUNNING SCRIPT ========');

  // const result = await prisma.delivery.findMany({
  //   where: {
  //     paymentId: {
  //       not: null,
  //     },
  //   },
  //   orderBy: { postingDate: 'asc' },
  // });

  // const cashRecords = result.filter((v) => (v.checkNumber === '' || v.checkNumber === null) && v.checkDate === null);

  // PaymentService.createPayment(
  //   {
  //     storeId: cashRecords[0].storeId,
  //     modeOfPayment: 'CASH',
  //     refNo: cashRecords[0].deliveryNumber,
  //     refDate: new Date(cashRecords[0].postingDate),
  //     amount: cashRecords[0].amountPaid ?? 0,
  //     badOrder: cashRecords[0].badOrder ?? 0,
  //     widthHoldingTax: cashRecords[0].widthHoldingTax ?? 0,
  //     otherDeductions: cashRecords[0].otherDeduction ?? 0,
  //     bankName: null,
  //   },
  //   [cashRecords[0].id],
  // );

  // for (const record of cashRecords) {
  //   PaymentService.createPayment(
  //     {
  //       storeId: record.storeId,
  //       modeOfPayment: 'CASH',
  //       refNo: record.deliveryNumber,
  //       refDate: new Date(record.postingDate),
  //       amount: record.amountPaid ?? 0,
  //       badOrder: record.badOrder ?? 0,
  //       widthHoldingTax: record.widthHoldingTax ?? 0,
  //       otherDeductions: record.otherDeduction ?? 0,
  //       bankName: null,
  //     },
  //     [record.id],
  //   );
  // }

  // console.log('result.length', result.length);
  // console.log(cashRecords.length);

  res.json({ healthCheck: 'Healthy' });
  res.end();
}
