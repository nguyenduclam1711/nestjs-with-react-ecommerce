import { BoxProps, FlexProps } from "@radix-ui/themes";
import { FC } from "react";

export type DynamicFormContextType = {
  values: Record<string, any>;
  setValues: (newValues: DynamicFormContextType["values"]) => void;
  errors: Record<string, any>;
  setErrors: (newErrors: DynamicFormContextType["errors"]) => void;
};

export type DynamicFormItemProps = {
  label: string;
  Component: FC<any>;
  field: string[] | string;
  componentProps?: Record<string, any>;
  boxProps?: BoxProps;
  validateValue?: (value: any) => boolean;
  validateErrorMessage?: string;
  required?: boolean;
};

export type DynamicFormItem = {
  newRow?: boolean;
  rowFlexProps?: FlexProps;
  formItemProps: DynamicFormItemProps;
};

export type DynamicFormProps = {
  items: DynamicFormItem[];
  values?: DynamicFormContextType["values"];
  onChange?: DynamicFormContextType["setValues"];
  defaultRowFlexProps?: FlexProps;
};
