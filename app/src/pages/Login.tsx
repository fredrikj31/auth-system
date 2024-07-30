import { Button } from "@shadcn-ui/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn-ui/components/ui/card";
import { Input } from "@shadcn-ui/components/ui/input";
import { Label } from "@shadcn-ui/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUser } from "../api/loginUser/useLoginUser";
import { useState } from "react";
import { useToast } from "@shadcn-ui/components/ui/use-toast";

export const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: loginUser } = useLoginUser();

  const login = () => {
    loginUser(
      { username, password },
      {
        onSuccess: () => {
          toast({
            title: "Login successfully!",
            duration: 2000,
          });
          navigate("/");
        },
        onError: (error) => {
          if (error.statusCode === 404) {
            toast({
              title: "User not found.",
              description: "A user with that username was not found.",
              duration: 5000,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Unknown Error",
              description: "Unknown error while trying to login in, please contact an admin.",
              duration: 5000,
            });
          }
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your username and password below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" onClick={() => login()}>
            Sign in
          </Button>
          <div className="mt-4 text-center text-sm">
            Doesn't have an account?{" "}
            <Link to={"/signup"} className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
