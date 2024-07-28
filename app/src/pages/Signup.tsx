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

export const SignupPage = () => {
  const [date, setDate] = useState<Date>();

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
              <Input id="email" type="email" placeholder="johndoe@mail.com" required />
            </div>
            <div className="flex flex-row gap-2">
              <div className="grid gap-2 min-w-52 w-full">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="JohnDoe" required />
              </div>
              <div className="grid gap-2 min-w-52 w-full">
                <Label>Birthday</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
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
