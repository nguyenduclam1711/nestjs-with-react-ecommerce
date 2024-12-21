import apiClient from "@/utils/axios";

type RegisterServiceArgs = {
  name: string;
  email: string;
  password: string;
};

export const registerService = async (args: RegisterServiceArgs) => {
  const { name, email, password } = args;
  return apiClient.post("/auth/register", {
    name,
    email,
    password,
  });
};
