"use client";
import DynamicForm from "@/components/atoms/dynamic-form";
import { Button, Heading } from "@radix-ui/themes";
import { formItems } from "./constants";
import useQuery from "@/hooks/use-query";
import { registerService } from "@/services/auth.service";
import { useDynamicForm } from "@/components/atoms/dynamic-form/hooks";

const RegisterPage = () => {
  const form = useDynamicForm();

  const { loading } = useQuery({
    fetchFn: () => {
      const { values } = form;
      return registerService({
        name: values.name,
        email: values.email,
        password: values.password,
      });
    },
    initialData: {},
  });

  return (
    <>
      <Heading mb="5" align="center">
        Register
      </Heading>
      <DynamicForm
        form={form}
        items={formItems}
        onSubmit={async (values) => {
          await new Promise<void>((res) => {
            setTimeout(() => {
              console.log("values", values);
              res();
            }, 500);
          });
        }}
      />
      <Button loading={loading} size="3" className="w-full" mt="3" onClick={form.submit}>
        Submit
      </Button>
    </>
  );
};

export default RegisterPage;
