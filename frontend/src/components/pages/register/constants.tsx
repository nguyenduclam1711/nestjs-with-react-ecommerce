import AppTextField from "@/components/atoms/app-text-field";
import { DynamicFormProps } from "@/components/atoms/dynamic-form/types";
import { FormValidateUtil } from "@/utils/form-validate.util";

export const formItems: DynamicFormProps["items"] = [
  {
    formItemProps: {
      label: "Email",
      Component: AppTextField,
      field: "email",
      required: true,
      rules: [
        {
          validator: FormValidateUtil.require,
          message: "Email is required",
        },
        {
          validator: FormValidateUtil.email,
          message: "Email is not in correct format",
        },
      ],
    },
  },
  {
    formItemProps: {
      label: "Name",
      Component: AppTextField,
      field: "name",
      required: true,
      rules: [
        {
          validator: FormValidateUtil.require,
          message: "Name is required",
        },
      ],
    },
  },
  {
    formItemProps: {
      label: "Password",
      Component: AppTextField,
      field: "password",
      required: true,
      componentProps: {
        type: "password",
      },
      rules: [
        {
          validator: FormValidateUtil.require,
          message: "Password is required",
        },
        {
          validator: FormValidateUtil.password,
          message: "Password must have at least 1 number and 1 special character",
        },
      ],
    },
  },
  {
    formItemProps: {
      label: "Repassword",
      Component: AppTextField,
      field: "repassword",
      componentProps: {
        type: "password",
      },
      rules: [
        {
          validator: (value, values) => {
            return FormValidateUtil.matching(value, values.password);
          },
          message: "Repassword is not matching with password",
        },
      ],
    },
  },
];
