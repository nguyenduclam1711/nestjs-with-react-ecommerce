import { Flex } from "@radix-ui/themes";
import { DynamicFormProps } from "./types";
import DynamicFormItem from "./dynamic-form-item";
import DynamicFormContext from "./dynamic-form-context";
import { useState } from "react";

const DynamicForm = (props: DynamicFormProps) => {
  const { items, values: valuesProp, onChange, direction = "vertical" } = props;
  const [localValues, setLocalValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});

  const values = valuesProp ?? localValues;
  const setValues = onChange ?? setLocalValues;

  const flexDirection = direction === "vertical" ? "column" : "row";

  if (items.length === 0) {
    return null;
  }
  return (
    <DynamicFormContext.Provider
      value={{
        values,
        setValues,
        errors,
        setErrors,
      }}
    >
      {items.map((row, rowIndex) => {
        return (
          <Flex key={`dynamic-form-row-${rowIndex}`} gap="2" direction={flexDirection}>
            {row.map((itemConfig, colIndex) => {
              return (
                <DynamicFormItem
                  key={`dynamic-form-col-${rowIndex}-${colIndex}`}
                  {...itemConfig}
                />
              );
            })}
          </Flex>
        );
      })}
    </DynamicFormContext.Provider>
  );
};

export default DynamicForm;
