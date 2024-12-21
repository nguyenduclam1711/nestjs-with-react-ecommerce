"use client";
import DynamicForm from "@/components/atoms/dynamic-form";
import { Button, Heading } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { getFormItems } from "./constants";
import useQuery from "@/hooks/use-query";
import { registerService } from "@/services/auth.service";

const RegisterPage = () => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const formItems = getFormItems(formValues);

  const { data, loading, handleFetch } = useQuery({
    fetchFn: () => {
      return registerService({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
      });
    },
    initialData: {},
  });

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  return (
    <>
      <Heading mb="5" align="center">
        Register
      </Heading>
      <DynamicForm
        values={formValues}
        onChange={setFormValues}
        items={formItems}
      />
      <Button loading={loading} size="3" className="w-full" mt="3" onClick={handleFetch}>
        Submit
      </Button>
    </>
  );
};

export default RegisterPage;
