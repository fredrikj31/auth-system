import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/Home.tsx";
import { LoginPage } from "./pages/Login.tsx";
import { SignupPage } from "./pages/Signup.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Cookies from "js-cookie";
import { Toaster } from "@shadcn-ui/components/ui/toaster.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute redirectPath="/login" accessToken={Cookies.get("access_token")}>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

export const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </>
  );
};
