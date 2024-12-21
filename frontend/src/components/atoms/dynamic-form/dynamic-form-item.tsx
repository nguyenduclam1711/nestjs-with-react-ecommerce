import { Box, Flex, Text } from "@radix-ui/themes";
import { DynamicFormItemProps } from "./types";
import { useDynamicFormContext, useOnChangeDynamicFormValue } from "./hooks";
import { get } from "lodash";

const DynamicFormItem = (props: DynamicFormItemProps) => {
  const { label, Component, boxProps, field, componentProps, required, rules } = props;
  const { values, errors } = useDynamicFormContext();
  const value = get(values, field);
  const fieldErrorConfig: undefined | {
    error: boolean;
    message: string;
  } = get(errors, field);
  const onChangeDynamicFormValue = useOnChangeDynamicFormValue({
    field,
    rules,
  });
  const isError = fieldErrorConfig?.error;
  const color = isError ? "red" : undefined;

  return (
    <Box
      {...boxProps}
      flexGrow="1"
    >
      <Flex mb="2" align="center" gap="1">
        <Text>
          {label}
        </Text>
        {required && <Text color="red">*</Text>}
      </Flex>
      <Component
        {...{
          ...componentProps,
          value,
          onChange: onChangeDynamicFormValue,
          color,
        }}
      />
      <Box mt="2">
        {isError && (
          <Text color="red">
            {fieldErrorConfig?.message}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default DynamicFormItem;
