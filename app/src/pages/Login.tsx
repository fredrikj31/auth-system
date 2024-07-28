import { Button } from "@shadcn-ui/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shadcn-ui/components/ui/card";
import { Input } from "@shadcn-ui/components/ui/input";
import { Label } from "@shadcn-ui/components/ui/label";

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="johndoe@mail.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Sign in</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
