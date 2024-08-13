import { Label } from "@radix-ui/react-label";
import { Button } from "@shadcn-ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn-ui/components/ui/card";
import { Input } from "@shadcn-ui/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn-ui/components/ui/popover";
import { cn } from "@shadcn-ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@shadcn-ui/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { useSignupUser } from "../api/signupUser/useSignupUser";
import { useToast } from "@shadcn-ui/components/ui/use-toast";

export const SignupPage = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date>();

  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: signupUser } = useSignupUser();

  const signup = () => {
    signupUser(
      { email, username, password, birthDate: format(birthDate ?? new Date(), "yyyy-MM-dd") },
      {
        onSuccess: () => {
          toast({
            title: "Signup successfully!",
            duration: 2000,
          });
          navigate("/login");
        },
        onError: (error) => {
          switch (error.statusCode) {
            case 404:
              toast({
                title: "User not found.",
                description: "A user with that username was not found.",
                duration: 5000,
              });
              break;
            case 409:
              toast({
                title: "Username is taken.",
                description: "That username is already taken by another user.",
                duration: 5000,
              });
              break;
            default:
              toast({
                variant: "destructive",
                title: "Unknown Error",
                description: "Unknown error while trying to sign up, please contact an admin.",
                duration: 5000,
              });
              break;
          }
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@mail.com"
                required
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-row gap-2">
              <div className="grid gap-2 min-w-52 w-full">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="JohnDoe"
                  required
                  onChange={(e) => setUsername(e.currentTarget.value)}
                />
              </div>
              <div className="grid gap-2 min-w-52 w-full">
                <Label>Birth Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("justify-start text-left font-normal", !birthDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" onChange={(e) => setPassword(e.currentTarget.value)} />
            </div>
            <Button type="submit" className="w-full" onClick={signup}>
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to={"/login"} className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
