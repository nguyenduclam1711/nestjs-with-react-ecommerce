"use client";
import BaseTextField from "@/components/base/base-text-field";
import DynamicForm from "@/components/base/dynamic-form";
import { IconButton } from "@radix-ui/themes";
import { DotsHorizontalIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const TestPage = () => {
  const [formValues, setFormValues] = useState({});

  return (
    <div>
      <DynamicForm
        values={formValues}
        onChange={setFormValues}
        items={[
          [
            {
              required: true,
              label: "Name",
              field: "name",
              Component: BaseTextField,
              validateValue(value) {
                return !!value && value.trim().length > 0;
              },
              validateErrorMessage: "Required",
              componentProps: {
                prefixIcon: {
                  children: (
                    <MagnifyingGlassIcon />
                  ),
                },
                suffixIcon: {
                  children: (
                    <IconButton variant="ghost">
                      <DotsHorizontalIcon />
                    </IconButton>
                  ),
                },
              },
            },
          ],
        ]}
      />
    </div>
  );
};

export default TestPage;
