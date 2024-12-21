import { createContext } from "react";
import { DynamicFormContextType } from "./types";

const DynamicFormContext = createContext<DynamicFormContextType>({
  values: {},
  setValues: () => { },
  errors: {},
  setErrors: () => { },
});

export default DynamicFormContext;
