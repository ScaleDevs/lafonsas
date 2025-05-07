import z from 'zod';

export const deliveryFormSchema = z.object({
  storeId: z.string().min(1, 'Please Choose Store'),
  deliveryNumber: z.string().min(1, 'Please Input Delivery Number'),
  counterNumber: z.string().optional(),
  productType: z.string().min(1, 'Please Input Product Type'),
  postingDate: z.string().min(1, 'Please Input posting date'),
  orders: z
    .array(
      z.object({
        size: z.string().min(1, 'Please select size'),
        quantity: z
          .number({ invalid_type_error: 'Must input a quantity!' })
          .min(1, 'Please add quantity'),
      }),
    )
    .min(1, 'Please add an order!'),
  returnSlip: z.array(
    z.object({
      size: z.string().min(1, 'Please select size'),
      quantity: z
        .number({ invalid_type_error: 'Must input a quantity!' })
        .min(1, 'Please add quantity'),
      price: z
        .number({ invalid_type_error: 'Must input a price!' })
        .min(1, 'Please add price'),
    }),
  ),
});

export type DeliveryFormSchemaType = z.infer<typeof deliveryFormSchema>;

export type HandleChangeStepParams = {
  step: number;
  data?: DeliveryFormSchemaType;
  isSuccessfulSubmit?: boolean;
  isResetData?: boolean;
};
