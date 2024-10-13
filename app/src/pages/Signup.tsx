import { Label } from "@radix-ui/react-label";
import { Button } from "@shadcn-ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shadcn-ui/components/ui/card";
import { Input } from "@shadcn-ui/components/ui/input";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn-ui/components/ui/popover";
import { cn } from "@shadcn-ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@shadcn-ui/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@shadcn-ui/components/ui/use-toast";
import { useAuth } from "../providers/auth";

export const SignupPage = () => {
  const { toast } = useToast();
  const auth = useAuth();

  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date>();

  const signup = () => {
    if (!email || !username || !password || !birthDate) {
      toast({
        title: "Fields Empty!",
        description: "Please fill out all the input fields",
      });
      return;
    }

    auth.signup({
      email,
      username,
      password,
      birthDate: format(birthDate, "yyyy-MM-dd"),
    });
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
                    <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} />
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
