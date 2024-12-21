import { BoxProps, FlexProps } from "@radix-ui/themes";
import { FC, RefObject } from "react";

export type DynamicFormValidateValueFunction = (value: any, values: DynamicFormContextType["values"]) => Promise<{ error: boolean; message: string }>;

export type DynamicFormValidateValueFunctions = {
  [key: string]: DynamicFormValidateValueFunction | DynamicFormValidateValueFunctions;
};

export type DynamicFormContextType = {
  values: Record<string, any>;
  setValues: (newValues: DynamicFormContextType["values"]) => void;
  errors: Record<string, any>;
  setErrors: (newErrors: DynamicFormContextType["errors"]) => void;
  validateValueFunctions: DynamicFormValidateValueFunctions;
};

export type DynamicFormItemProps = {
  label: string;
  Component: FC<any>;
  field: string[] | string;
  componentProps?: Record<string, any>;
  boxProps?: BoxProps;
  rules?: Array<{
    validator: {
      validator: (value: any, values: DynamicFormContextType["values"]) => boolean;
    }["validator"];
    message: string;
  }>;
  required?: boolean;
};

export type DynamicFormItem = {
  newRow?: boolean;
  rowFlexProps?: FlexProps;
  formItemProps: DynamicFormItemProps;
};

export type DynamicForm = {
  submit: () => Promise<void>;
  validateValueFunctionsRef: RefObject<DynamicFormValidateValueFunctions>;
  validateValueFunctionArrRef: RefObject<Array<{
    validateFunction: DynamicFormValidateValueFunction;
    field: DynamicFormItemProps["field"];
  }>>;
  onSubmitRef: RefObject<DynamicFormProps["onSubmit"]>;
} & Omit<DynamicFormContextType, "validateValueFunctions">;

export type DynamicFormProps = {
  items: DynamicFormItem[];
  onChange?: DynamicFormContextType["setValues"];
  defaultRowFlexProps?: FlexProps;
  form?: DynamicForm;
  onSubmit?: (values: DynamicFormContextType["values"]) => (void | Promise<void>);
};
