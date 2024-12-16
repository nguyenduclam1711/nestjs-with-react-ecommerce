import { Box, Container } from "@radix-ui/themes";
import { ReactNode } from "react"

type AuthLayoutProps = {
  children: ReactNode,
}
const AuthLayout = (props: AuthLayoutProps) => {
  const { children } = props;
  return (
    <Container size="1" mt="9">
      <Box>
        {children}
      </Box>
    </Container>
  );
}

export default AuthLayout;
