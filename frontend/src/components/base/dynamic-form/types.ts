import { BoxProps } from "@radix-ui/themes";
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

export type DynamicFormProps = {
  items: DynamicFormItemProps[][];
  values?: DynamicFormContextType["values"];
  onChange?: DynamicFormContextType["setValues"];
  direction?: "horizontal" | "vertical";
};
