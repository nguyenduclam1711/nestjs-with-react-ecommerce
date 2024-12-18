"use client";
import DynamicForm from "@/components/base/dynamic-form";
import { TextField } from "@radix-ui/themes";
import { useState } from "react";

const TestPage = () => {
  const [formValues, setFormValues] = useState({});

  return (
    <DynamicForm
      values={formValues}
      onChange={setFormValues}
      items={[
        [
          {
            required: true,
            label: "Name",
            field: "name",
            Component: ({ value = "", onChange }) => {
              return (
                <TextField.Root onChange={e => onChange(e.target.value)} value={value} />
              );
            },
            validateValue(value) {
              return !!value && value.trim().length > 0;
            },
          },
          {
            label: "Name2",
            field: "name2",
            Component: ({ value = "", onChange }) => {
              return (
                <TextField.Root onChange={e => onChange(e.target.value)} value={value} />
              );
            },
          },
        ],
        [
          {
            label: "Name3",
            field: "name3",
            Component: ({ value = "", onChange }) => {
              return (
                <TextField.Root onChange={e => onChange(e.target.value)} value={value} />
              );
            },
          },
          {
            label: "Name4",
            field: "name4",
            Component: ({ value = "", onChange }) => {
              return (
                <TextField.Root onChange={e => onChange(e.target.value)} value={value} />
              );
            },
          },
        ],
      ]}
    />
  );
};

export default TestPage;
