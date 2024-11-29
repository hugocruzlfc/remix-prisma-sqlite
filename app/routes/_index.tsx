import type { MetaFunction } from "@remix-run/node";
import { prisma } from "@/lib/prisma-client";
import { Button } from "@/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  const allUsers = await prisma.user.findMany();
  await prisma.$disconnect();
  return allUsers;
}

export default function Index() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
