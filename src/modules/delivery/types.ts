import z from 'zod';

export const deliveryFormSchema = z.object({
  storeId: z.string().min(1, 'Please Choose Store'),
  deliveryNumber: z.string().min(1, 'Please Input Delivery Number'),
  postingDate: z.string().min(1, 'Please Input posting date'),
  badOrder: z.number({ invalid_type_error: 'Must input a number!' }).optional(),
  widthHoldingTax: z.number({ invalid_type_error: 'Must input a number!' }).optional(),
  otherDeduction: z.number({ invalid_type_error: 'Must input a number!' }).optional(),
  amountPaid: z.number({ invalid_type_error: 'Must input a number!' }).optional(),
  checkNumber: z.string().optional(),
  checkDate: z.string().optional(),
  orders: z
    .array(
      z.object({
        size: z.string().min(1, 'Please select size'),
        quantity: z.number({ invalid_type_error: 'Must input a quantity!' }).min(1, 'Please add quantity'),
      }),
    )
    .min(1, 'Please add an order!'),
  returnSlip: z.array(
    z.object({
      size: z.string().min(1, 'Please select size'),
      quantity: z.number({ invalid_type_error: 'Must input a quantity!' }).min(1, 'Please add quantity'),
      price: z.number({ invalid_type_error: 'Must input a price!' }).min(1, 'Please add price'),
    }),
  ),
});

export type DeliveryFormSchemaType = z.infer<typeof deliveryFormSchema>;

export type HandleChangeStepParams = {
  step: number;
  data?: DeliveryFormSchemaType & { amount: number };
  isSuccessfulSubmit?: boolean;
  isResetData?: boolean;
};
