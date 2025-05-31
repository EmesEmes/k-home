import { useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserService } from "@/services/user/userServices";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Button } from "../ui/button";

const Register = () => {
  const { userProfile } = useUser();
  const { toast } = useToast();
  const form = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const verifyName = () => {
    const name = form.current?.firstname.value
    if(name.length === 0) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Names and Lastnames must not be empty.",
      })
      
      form.current.firstname.value = ""
      return
    }
    if (!/^[a-zA-Z]+$/.test(name)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Names and Lastnames must contain only letters.",
      })
      form.current.firstname.value = ""; 
      return
    }
    if (name.length < 3 ) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Names and Lastnames must be at least 3 characters long.",
      })
      form.current.firstname.value = ""; 
      return
    } 
    
  }

  const verifyLastame = () => {
    const lastname = form.current?.lastname.value
    if(lastname.length === 0) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Names and Lastnames must not be empty.",
      })
      
      form.current.lastname.value = "";
      return
    }
    if (!/^[a-zA-Z]+$/.test(lastname)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Names and Lastnames must contain only letters.",
      })
      form.current.lastname.value = ""; 
      return
    }
    if (lastname.length < 3 ) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Names and Lastnames must be at least 3 characters long.",
      })
      form.current.lastname.value = ""; 
      return
    } 
    
  }
  const verifyPhone = () => {
    const phone = form.current?.phone.value
    
    if (!/^[0-9]+$/.test(phone)) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Phone must contain only numbers.",
      })
      form.current.phone.value = ''
      return
    }
    if (phone.length < 10) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Phone must be at least 10 characters long.",
      })
      form.current.phone.value = ''
      return
    }
  }

  const verifyAge = () => {
    const birthDate = form.current?.birthdate.value
    const birthYear = new Date(birthDate).getFullYear()
    const currentYear = new Date().getFullYear()
    if (currentYear - birthYear < 18 || currentYear - birthYear > 120) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "You must be between 18 and 120 years",
      })
      form.current.birthdate.value = ""
      return
      
    }
  }

  const verifyPassword = () => {
    const password = form.current?.password.value
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      toast({
      variant: "destructive",
      title: "Invalid password",
      description: "Password must contain at least one letter, one number, and one special character.",
      })
      form.current.password.value = ''
      return
    }
  }

  const verifyConfirmPassword = () => {
    const password = form.current?.password.value
    const confirmPassword = form.current?.confpassword.value
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Passwords must match.",
      })
      form.current.confpassword.value = ""
      return
    }
    
  }

  const verifyEmail = () => {
    const email = form.current?.email.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid email",
        description: "Please enter a valid email address.",
      });
      form.current.email.value = "";
      return;
    }
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;
    
    const newUser = {
      firstname: form.current.firstname.value,
      lastname: form.current.lastname.value,
      phone: form.current.phone.value,
      birthdate: form.current.birthdate.value,
      email: form.current.email.value,
      password: form.current.password.value,
      isadmin: false,
      avatar: form.current.avatar.files[0],
    }


    const createUser = new UserService();
    const example =await createUser.register(newUser);
    if(example?.success){
      toast({
        title: "User created successfully",
        description: "Verify your email to continue",
      });
      navigate("/login");

    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: example?.error,
      });
    }
  };

  if(userProfile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-3xl">you are already logged in</p>
        <Button onClick={() => navigate('/')} className="mt-10">Go to home</Button>
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center ">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-10">
        <h2 className="font-bold text-xl">
          Welcome to <span className="text-indigo-700">FlatFinder</span>
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Sign up and start searching for the home of your dreams
        </p>

        <form className="my-8" onSubmit={handleSubmit} ref={form}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" placeholder="Tyler" type="text" name="firstname" required onBlur={verifyName}/>
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" placeholder="Durden" type="text" name="lastname" required onBlur={verifyLastame} />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="1234567890"
              type="text"
              name="phone"
              required
              onBlur={verifyPhone}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="birthdate">Birthdate</Label>
            <Input
              id="birthdate"
              placeholder="projectmayhem@fc.com"
              type="date"
              name="birthdate"
              required
              onBlur={verifyAge}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              name="email"
              required
              onBlur={verifyEmail}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="avatar">Select an Image</Label>
            <Input
              id="avatar"
              type="file"
              name="avatar"
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
              onBlur={verifyPassword}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="confpassword">Confirm Password</Label>
            <Input
              id="confpassword"
              placeholder="••••••••"
              type="password"
              name="confpassword"
              required
              onBlur={verifyConfirmPassword}
            />
          </LabelInputContainer>

          <button
            className="bg-indigo-700 hover:bg-indigo-900 transition duration-300 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign up &rarr;
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
        <p className="text-center text-neutral-600 text-sm dark:text-neutral-300">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-700 underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
};

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

export default Register;
