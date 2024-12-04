import { Button } from "@/components/ui/button";
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { prisma } from "@/lib/prisma-client";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export async function loader({ params }: LoaderFunctionArgs) {
  // get the user by id

  const user = await prisma.user.findUnique({
    where: {
      id: params.id ? parseInt(params.id) : 0,
    },
  });

  // get the bookmarks for the user

  const userBookmarks = await prisma.bookMark.findMany({
    where: {
      userId: params.id ? parseInt(params.id) : 0,
    },
  });

  await prisma.$disconnect();

  return {
    user,
    userBookmarks,
  };
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  if (request.method === "DELETE") {
    await prisma.bookMark.delete({
      where: {
        id: parseInt(values.id as string),
      },
    });
  } else {
    await prisma.bookMark.create({
      data: {
        title: values.title as string,
        url: values.url as string,
        userId: parseInt(values.userId as string),
      },
    });
  }

  await prisma.$disconnect();
  return true;
}

export default function BookmarksById() {
  const { userBookmarks, user } = useLoaderData<typeof loader>();
  const { id } = useParams();
  const { state } = useNavigation();

  console.log(id);
  return (
    <div className="p-5 flex flex-col items-center  space-y-5">
      <Button
        variant="link"
        asChild
      >
        <Link to="/">Go Home</Link>
      </Button>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Manage Book Marks for {user?.username}
      </h2>

      <Form
        method="post"
        className="w-96 p-5 space-y-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Add a Bookmark</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              type="text"
              name="title"
              placeholder="Title"
            />
            <Input
              type="text"
              name="url"
              placeholder="URL"
            />
            <input
              type="hidden"
              name="userId"
              value={id}
            />
            <Button
              type="submit"
              disabled={state === "submitting"}
            >
              {state === "submitting" ? "Saving..." : "Save"}
            </Button>
          </CardContent>
        </Card>
      </Form>

      {userBookmarks.map((bookMark) => (
        <Card key={bookMark.id}>
          <CardHeader>
            <CardTitle>{bookMark.title}</CardTitle>
            <CardDescription>
              {" "}
              {bookMark.createdAt.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="leading-7">{bookMark.url}</p>

            <Form method="delete">
              <input
                type="hidden"
                name="id"
                value={bookMark.id}
              />
              <Button
                type="submit"
                disabled={state === "submitting"}
              >
                {state === "submitting" ? "Deleting..." : "Delete"}
              </Button>
            </Form>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
