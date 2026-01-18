import { Button } from "@shadcn-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/components/ui/card";
import { Skeleton } from "@shadcn-ui/components/ui/skeleton";
import { useGetProfile } from "../api/getProfile/useGetProfile";
import { useAuth } from "../providers/auth";

export const HomePage = () => {
  const auth = useAuth();
  const { data, isFetching, isError } = useGetProfile();

  const logout = () => {
    auth.logout();
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="w-full h-14" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="w-full h-10" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!data || isError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Profile not found</CardTitle>
          </CardHeader>
          <CardContent>
            Your profile information was not found. Please contact an admin.
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={logout}>
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome {data.username}</CardTitle>
          <CardDescription>
            Here is a list of all your information.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <span className="text-zinc-500 font-semibold">Id:</span>
            <span className="text-zinc-700">{data.userId}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-zinc-500 font-semibold">Username:</span>
            <span className="text-zinc-700">{data.username}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-zinc-500 font-semibold">First Name:</span>
            <span className="text-zinc-700">{data.firstName}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-zinc-500 font-semibold">Last Name:</span>
            <span className="text-zinc-700">{data.lastName}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-zinc-500 font-semibold">Birthday:</span>
            <span className="text-zinc-700">{data.birthDate}</span>
          </div>
          <div className="flex flex-row justify-between">
            <span className="text-zinc-500 font-semibold">Gender:</span>
            <span className="text-zinc-700">{data.gender}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full cursor-pointer" onClick={logout}>
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
