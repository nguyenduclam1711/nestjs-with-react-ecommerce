import { useContext } from "react";
import DynamicFormContext from "./dynamic-form-context";
import { DynamicFormItemProps } from "./types";
import { set } from "lodash";

export const useDynamicFormContext = () => {
  return useContext(DynamicFormContext);
};

export const useOnChangeDynamicFormValue = () => {
  const { values, setValues, errors, setErrors } = useDynamicFormContext();

  return (args: {
    field: DynamicFormItemProps["field"];
    value: any;
    validateValue: DynamicFormItemProps["validateValue"];
    errorMesage: string;
  }) => {
    const { field, value, validateValue, errorMesage } = args;
    const newValues = { ...values };
    set(newValues, field, value);
    if (validateValue) {
      const validate = validateValue(value);
      const newErrors = { ...errors };
      const error = !validate;

      set(newErrors, field, {
        error,
        message: error ? errorMesage : "",
      });
      setErrors(newErrors);
    }
    setValues(newValues);
  };
};
