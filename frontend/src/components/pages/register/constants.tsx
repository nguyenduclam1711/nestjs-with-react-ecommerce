import AppTextField from "@/components/atoms/app-text-field";
import { DynamicFormProps } from "@/components/atoms/dynamic-form/types";
import { FormValidateUtil } from "@/utils/form-validate.util";

export const getFormItems: (formValues: Record<string, any>) => DynamicFormProps["items"] = (formValues: Record<string, any>) => [
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
    },
  },
  {
    formItemProps: {
      label: "Repassword",
      Component: AppTextField,
      field: "repassword",
      required: true,
      componentProps: {
        type: "password",
      },
    },
  },
];
