import { Flex, FlexProps } from "@radix-ui/themes";
import { DynamicFormProps } from "./types";
import DynamicFormItem from "./dynamic-form-item";
import DynamicFormContext from "./dynamic-form-context";
import { ReactNode, useState } from "react";

const DynamicForm = (props: DynamicFormProps) => {
  const {
    items,
    values: valuesProp,
    onChange,
    defaultRowFlexProps = { gap: "2", direction: "column" },
  } = props;
  const [localValues, setLocalValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});

  if (items.length === 0) {
    return null;
  }

  const values = valuesProp ?? localValues;
  const setValues = onChange ?? setLocalValues;

  const generateFormItems = () => {
    const result: ReactNode[] = [];
    let row: ReactNode[] = [];
    let rowIndex = 0;
    let lastRowFlexProps: FlexProps = {};

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.newRow) {
        row.push(
          <DynamicFormItem
            key={`dynamic-form-item-number-${i}`}
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

  return (
    <DynamicFormContext.Provider
      value={{
        values,
        setValues,
        errors,
        setErrors,
      }}
    >
      {generateFormItems()}
    </DynamicFormContext.Provider>
  );
};

export default DynamicForm;
