import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { prisma } from "@/lib/prisma-client";
import { Button } from "@/components/ui/button";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  await prisma.user.create({
    data: {
      username: values.username as string,
      email: values.email as string,
    },
  });

  await prisma.$disconnect();
  return true;
};

export async function loader() {
  const allUsers = await prisma.user.findMany();
  await prisma.$disconnect();

  return allUsers;
}

export default function Index() {
  const users = useLoaderData<typeof loader>();
  const { state } = useNavigation();

  return (
    <div className="p-5 flex flex-col items-center  space-y-5">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Users and Bookmarks: Sample App with Remix and Prisma
      </h2>
      <Form
        method="post"
        className="w-96 p-5 space-y-2"
      >
        <Input
          type="text"
          name="username"
          placeholder="User name"
        />

        <Input
          type="email"
          name="email"
          placeholder="Email"
        />
        <Button
          type="submit"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "Adding User..." : "Add User"}
        </Button>
      </Form>
      {users.map((user) => (
        <Card
          key={user.id}
          className="w-96 flex flex-row items-center justify-between"
        >
          <CardHeader>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>

          <CardContent className="text-right">
            <Link to={`/bookmarks/${user.id}`}>
              <Button variant="link">View Details</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
