import AppTextField from "@/components/atoms/app-text-field";
import { DynamicFormProps } from "@/components/atoms/dynamic-form/types";
import { FormValidateUtil } from "@/utils/form-validate.util";

export const getFormItems: (formValues: Record<string, any>) => DynamicFormProps["items"] = (formValues: Record<string, any>) => [
  [
    {
      label: "Email",
      Component: AppTextField,
      field: "email",
      required: true,
      validateValue: FormValidateUtil.require,
      validateErrorMessage: "Email is required",
    },
  ],
  [
    {
      label: "Name",
      Component: AppTextField,
      field: "name",
      required: true,
      validateValue: FormValidateUtil.require,
      validateErrorMessage: "Name is required",
    },
  ],
  [
    {
      label: "Password",
      Component: AppTextField,
      field: "password",
      required: true,
      componentProps: {
        type: "password",
      },
      validateValue: FormValidateUtil.require,
      validateErrorMessage: "Password is required",
    },
  ],
  [
    {
      label: "Repassword",
      Component: AppTextField,
      field: "repassword",
      required: true,
      componentProps: {
        type: "password",
      },
      validateValue: value => FormValidateUtil.matching(value, formValues.password),
      validateErrorMessage: "Repassword is not matching with Password",
    },
  ],
];