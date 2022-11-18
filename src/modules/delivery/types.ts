import { FormSchemaType } from './CreateDeliveryForm';

export type HandleChangeStepParams = {
  step: number;
  data?: FormSchemaType & { amount: number };
  isSuccessfulSubmit?: boolean;
  isResetData?: boolean;
};
