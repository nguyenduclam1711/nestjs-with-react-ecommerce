import { useContext, useRef, useState } from "react";
import DynamicFormContext from "./dynamic-form-context";
import { DynamicForm, DynamicFormItemProps, DynamicFormProps, DynamicFormValidateValueFunction, DynamicFormValidateValueFunctions } from "./types";
import { get, set } from "lodash";

export const useDynamicFormContext = () => {
  return useContext(DynamicFormContext);
};

export const useDynamicForm = (form?: DynamicForm): DynamicForm => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});

  const validateValueFunctionsRef = useRef<DynamicForm["validateValueFunctionsRef"]["current"]>({});
  const validateValueFunctionArrRef = useRef<DynamicForm["validateValueFunctionArrRef"]["current"]>([]);
  const onSubmitRef = useRef<DynamicFormProps["onSubmit"]>(undefined);

  const submit = async () => {
    const validateValueFunctionArr = validateValueFunctionArrRef.current;
    let isFormError = false;
    if (validateValueFunctionArr.length > 0) {
      const newErrors = { ...errors };

      await Promise.all(validateValueFunctionArr.map(async (validateConfig) => {
        const { field, validateFunction } = validateConfig;
        const value = get(values, field);
        const errorResult = await validateFunction(value, values);

        set(newErrors, field, errorResult);
        if (errorResult.error) {
          isFormError = true;
        }
      }));
      setErrors(newErrors);
    }
    if (isFormError) {
      return;
    }
    const onSubmit = onSubmitRef.current;
    if (onSubmit) {
      await Promise.resolve(onSubmit(values));
    }
  };

  if (form) {
    return form;
  }
  return {
    values,
    setValues,
    errors,
    setErrors,
    submit,
    validateValueFunctionsRef,
    validateValueFunctionArrRef,
    onSubmitRef,
  };
};

type UseOnChangeDynamicFormValueArgs = {
  field: DynamicFormItemProps["field"];
  rules: DynamicFormItemProps["rules"];
};
export const useOnChangeDynamicFormValue = (args: UseOnChangeDynamicFormValueArgs) => {
  const { field } = args;
  const { values, setValues, errors, setErrors, validateValueFunctions } = useDynamicFormContext();
  const validateTimeout = useRef<null | NodeJS.Timeout>(null);

  const validateValueFunction = get(validateValueFunctions, field);

  const handleValidateValue = async (value: any, values: Record<string, any>) => {
    if (!validateValueFunction) {
      return;
    }
    const errorResult = await validateValueFunction(value, values);
    const newErrors = { ...errors };
    set(newErrors, field, errorResult);
    setErrors(newErrors);
  };

  return (value: any) => {
    const newValues = { ...values };
    set(newValues, field, value);
    setValues(newValues);

    // validate value asynchronous
    if (validateTimeout.current) {
      clearTimeout(validateTimeout.current);
    }
    validateTimeout.current = setTimeout(() => {
      handleValidateValue(value, newValues);
    }, 200);
  };
};
