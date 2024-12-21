import { TextField } from "@radix-ui/themes";
import { ChangeEventHandler } from "react";

type AppTextFieldProps = {
  onChange?: (value: string) => void;
  prefixIcon?: TextField.SlotProps;
  suffixIcon?: TextField.SlotProps;
} & TextField.RootProps;
const AppTextField = (props: AppTextFieldProps) => {
  const { onChange: onChangeProp, children, prefixIcon, suffixIcon, ...restProps } = props;

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (onChangeProp) {
      onChangeProp(e.target.value);
    }
  };

  return (
    <TextField.Root
      {...restProps}
      onChange={onChange}
    >
      {prefixIcon && (
        <TextField.Slot {...prefixIcon} side="left" color={restProps.color} />
      )}
      {suffixIcon && (
        <TextField.Slot {...suffixIcon} side="right" color={restProps.color} />
      )}
    </TextField.Root>
  );
};

export default AppTextField;
