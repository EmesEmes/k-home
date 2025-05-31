import { useRef, useState } from "react"
import { Link, useNavigate } from 'react-router';
import { UserService } from "@/services/user/userServices"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";



const Login = () => {
  const { userProfile, fetchAndSetUser } = useUser();
  const [error, seterror] = useState(null)
  const formRef = useRef<HTMLElement | null>(null)
  const navigate = useNavigate()


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const email = formRef.current.email.value
    const password = formRef.current.password.value

    const userService = new UserService()
    const userLoged = await userService.login(email, password)
    if (!userLoged.success) {
      formRef.current.password.value = ''
      seterror(userLoged.error)
    } else {
      await fetchAndSetUser()
      navigate('/')
    }
  }
  if(userProfile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-3xl">you are already logged in</p>
        <Button onClick={() => navigate('/')} className="mt-10">Go to home</Button>
      </div>
    )
  }
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-10">
        <h2 className="font-bold text-xl">
          Welcome to <span className="text-indigo-700">FlatFinder</span>
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Sign up and start searching for the home of your dreams
        </p>

        <form className="my-8" onSubmit={handleSubmit} ref={formRef}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              name="email"
              required
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              name="password"
              required
            />
          </LabelInputContainer>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            className="bg-indigo-700 hover:bg-indigo-900 transition duration-300 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign up &rarr;
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
        <p className="text-center text-neutral-600 text-sm dark:text-neutral-300">
        Don't have an account?{" "}
          <Link to="/register" className="text-indigo-700 underline">
          Register here
          </Link>
        </p>
      </div>
    </main>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Login