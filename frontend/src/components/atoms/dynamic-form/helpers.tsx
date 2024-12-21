import { set } from "lodash";
import { DynamicForm, DynamicFormProps, DynamicFormValidateValueFunction, DynamicFormValidateValueFunctions } from "./types";
import { ReactNode } from "react";
import { Flex, FlexProps } from "@radix-ui/themes";
import DynamicFormItem from "./dynamic-form-item";

export const getValidateFunctions = (items: DynamicFormProps["items"]) => {
  const validateValueFunctions: DynamicForm["validateValueFunctionsRef"]["current"] = {};
  const validateValueFunctionArr: DynamicForm["validateValueFunctionArrRef"]["current"] = [];

  items.forEach((item) => {
    const { field, rules } = item.formItemProps;
    if (!rules || rules.length === 0) {
      return;
    }
    const validateValueFunc = async (value: any, values: Record<string, any>) => {
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
      return errorResult;
    };
    set(validateValueFunctions, field, validateValueFunc);
    validateValueFunctionArr.push({
      validateFunction: validateValueFunc,
      field,
    });
  });

  return {
    validateValueFunctions,
    validateValueFunctionArr,
  };
};

export const generateFormItems = (items: DynamicFormProps["items"], defaultRowFlexProps: DynamicFormProps["defaultRowFlexProps"]) => {
  const result: ReactNode[] = [];
  let row: ReactNode[] = [];
  let rowIndex = 0;
  let lastRowFlexProps: FlexProps = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.newRow) {
      row.push(
        <DynamicFormItem
          key={`dynamic-form-item-${i}`}
          {...item.formItemProps}
        />,
      );
    }
    else {
      result.push(
        <Flex
          key={`dynamic-form-row-${rowIndex}`}
          {...defaultRowFlexProps}
          {...lastRowFlexProps}
        >
          {row}
        </Flex>,
      );
      if (item.rowFlexProps) {
        lastRowFlexProps = item.rowFlexProps;
      }
      else {
        lastRowFlexProps = {};
      }
      row = [
        <DynamicFormItem
          key={`dynamic-form-item-number-${i}`}
          {...item.formItemProps}
        />,
      ];
      rowIndex++;
    }
  }
  if (row.length > 0) {
    result.push(
      <Flex
        key={`dynamic-form-row-${rowIndex}`}
        {...defaultRowFlexProps}
        {...lastRowFlexProps}
      >
        {row}
      </Flex>,
    );
  }
  return result;
};
