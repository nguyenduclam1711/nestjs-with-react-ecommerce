import { useContext, useRef } from "react";
import DynamicFormContext from "./dynamic-form-context";
import { DynamicFormItemProps } from "./types";
import { set } from "lodash";

export const useDynamicFormContext = () => {
  return useContext(DynamicFormContext);
};

type UseOnChangeDynamicFormValueArgs = {
  field: DynamicFormItemProps["field"];
  rules: DynamicFormItemProps["rules"];
};
export const useOnChangeDynamicFormValue = (args: UseOnChangeDynamicFormValueArgs) => {
  const { field, rules } = args;
  const { values, setValues, errors, setErrors } = useDynamicFormContext();
  const validateTimeout = useRef<null | NodeJS.Timeout>(null);

  const handleValidateValue = async (value: any) => {
    if (Array.isArray(rules) && rules.length > 0) {
      const validatePromises: Array<Promise<{
        error: boolean;
        message: string;
      }>> = rules.map((ruleConfig) => {
        const { validator, message } = ruleConfig;
        return new Promise((resolve) => {
          const error = !validator(value, values);
          resolve({
            error,
            message,
          });
        });
      });
      const validateResults = await Promise.all(validatePromises);
      const errorResult = {
        error: false,
        message: "",
      };
      for (const validateResult of validateResults) {
        const { message, error } = validateResult;
        if (error) {
          errorResult.error = error;
          errorResult.message = message;
          break;
        }
      }
      const newErrors = { ...errors };
      set(newErrors, field, errorResult);
      setErrors(newErrors);
    }
    // reset timeout
    clearTimeout(validateTimeout.current!);
    validateTimeout.current = null;
  };

  return (value: any) => {
    const newValues = { ...values };
    set(newValues, field, value);
    setValues(newValues);

    if (validateTimeout.current) {
      clearTimeout(validateTimeout.current);
    }
    // validate value asynchronous
    validateTimeout.current = setTimeout(() => {
      handleValidateValue(value);
    }, 200);
  };
};
