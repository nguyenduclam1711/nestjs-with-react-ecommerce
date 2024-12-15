import { Button, Flex, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex direction="column" gap="9">
      <Text>Hello from Radix Themes :)</Text>
      <Button>Let's go</Button>
    </Flex>
  );
}
