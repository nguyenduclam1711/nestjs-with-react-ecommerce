import { DynamicFormProps } from "./types";
import DynamicFormContext from "./dynamic-form-context";
import { useDynamicForm } from "./hooks";
import { generateFormItems, getValidateFunctions } from "./helpers";

const DynamicForm = (props: DynamicFormProps) => {
  const {
    items,
    onChange,
    defaultRowFlexProps = { gap: "2", direction: "column" },
    form,
    onSubmit,
  } = props;
  const wrapForm = useDynamicForm(form);

  if (items.length === 0) {
    return null;
  }

  const { validateValueFunctionArr, validateValueFunctions } = getValidateFunctions(items);

  wrapForm.onSubmitRef.current = onSubmit;
  wrapForm.validateValueFunctionsRef.current = validateValueFunctions;
  wrapForm.validateValueFunctionArrRef.current = validateValueFunctionArr;

  const setValues = (newValues: Record<string, any>) => {
    wrapForm.setValues(newValues);
    if (onChange) {
      onChange(newValues);
    }
  };

  return (
    <DynamicFormContext.Provider
      value={{
        values: wrapForm.values,
        setValues,
        errors: wrapForm.errors,
        setErrors: wrapForm.setErrors,
        validateValueFunctions: wrapForm.validateValueFunctionsRef.current,
      }}
    >
      {generateFormItems(items, defaultRowFlexProps)}
    </DynamicFormContext.Provider>
  );
};

export default DynamicForm;
