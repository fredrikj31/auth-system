import { Button } from "@shadcn-ui/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn-ui/components/ui/card";

export const HomePage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome JohnDoe</CardTitle>
          <CardDescription>Here is a list of all your information.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between">
              <span className="text-zinc-500 font-semibold">Id:</span>
              <span className="text-zinc-700">29421b51-3960-4ba0-bfa0-d51020a108be</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-zinc-500 font-semibold">Email:</span>
              <span className="text-zinc-700">johndoe@mail.com</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-zinc-500 font-semibold">Username:</span>
              <span className="text-zinc-700">JohnDoe</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-zinc-500 font-semibold">Birthday:</span>
              <span className="text-zinc-700">17/05/2001</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Logout</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
