import { REGEX } from "@/constants/regex";

export const FormValidateUtil = {
  require(value?: string): boolean {
    return !!value && value.trim().length > 0;
  },
  matching(value1?: string, value2?: string) {
    return value1 === value2;
  },
  email(value?: string): boolean {
    return !!value && REGEX.email.test(value);
  },
  password(value?: string): boolean {
    return !!value && REGEX.password.test(value);
  },
};
