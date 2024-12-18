import { Box, Text } from "@radix-ui/themes";
import { DynamicFormItemProps } from "./types";
import { useDynamicFormContext, useOnChangeDynamicFormValue } from "./hooks";
import { get } from "lodash";

const DynamicFormItem = (props: DynamicFormItemProps) => {
  const { label, Component, boxProps, field, componentProps, validateValue, validateErrorMessage = "Error" } = props;
  const { values, errors } = useDynamicFormContext();
  const value = get(values, field);
  const fieldErrorConfig: undefined | {
    error: boolean;
    message: string;
  } = get(errors, field);
  const onChangeDynamicFormValue = useOnChangeDynamicFormValue();

  const onChange = (value: any) => {
    onChangeDynamicFormValue({
      field,
      value,
      validateValue,
      errorMesage: validateErrorMessage,
    });
  };

  return (
    <Box {...boxProps}>
      <Box mb="2">
        <Text>
          {label}
        </Text>
      </Box>
      <Component
        {...{
          ...componentProps,
          value,
          onChange,
        }}
      />
      <Box mt="2">
        {fieldErrorConfig?.error && (
          <Text color="red">
            {fieldErrorConfig?.message}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default DynamicFormItem;
