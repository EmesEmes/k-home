import { cn } from "@/lib/utils";
import { UserService } from "@/services/user/userServices";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useUser } from "@/context/UserContext";

const EditProfile = () => {
  const { idProfile } = useParams();
  const { userProfile } = useUser();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const form = useRef(null);

  useEffect(() => {
    const getProfile = async () => {
      const fetchProfile = new UserService();
      const response = await fetchProfile.getUserById(idProfile);
      if (response.success) {
        setProfile(response.user);
      } else {
        console.error(response.error);
      }
    };
    getProfile();
  }, [idProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const firstname = form.current?.firstname.value;
    const lastname = form.current?.lastname.value;
    const phone = form.current?.phone.value;
    const birthdate = form.current?.birthdate.value;
    const isadmin = profile.isadmin ? form.current?.isadmin.checked : profile.isadmin;

    console.log(firstname, lastname, phone, birthdate, isadmin);

    const updateUser = new UserService();
    const response = await updateUser.updateUser(
      idProfile,
      firstname,
      lastname,
      phone,
      birthdate,
      isadmin
    );
    if (response.success) {
      navigate(`/profile/${idProfile}`);
    } else {
      console.error(response.error);
    }

    // const data = new FormData(form.current);
    // const updateUser = new UserService();
    // const response = await updateUser.updateUser(idProfile, data);
    // if (response.success) {
    //   navigate(`/profile/${idProfile}`);
    // } else {
    //   console.error(response.error);
    // }
  };

  if(!profile) {
    return (
      <main className="container mx-auto mt-10">
        <h1 className="text-3xl font-semibold text-center">Loading...</h1>
      </main>
    )
  } 
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-10">
        <h2 className="font-bold text-xl">
          Update your <span className="text-indigo-700">Profile</span>
        </h2>

        <form className="my-8" ref={form} onSubmit={handleUpdateProfile}>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="email">email</Label>
              <Input id="email" type="email" name="email" required disabled defaultValue={profile.email}/>
            </LabelInputContainer>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" type="text" name="firstname" required defaultValue={profile.firstname}/>
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" type="text" name="lastname" required defaultValue={profile.lastname}/>
            </LabelInputContainer>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="text" name="phone" required defaultValue={profile.phone}/>
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="birthdate">Birthdate</Label>
              <Input id="birthdate" type="date" name="birthdate" required defaultValue={profile.birthdate}/>
            </LabelInputContainer>
          </div>
          {
            userProfile.isadmin && (
              <div className="flex items-center space-x-2 mb-4">
                <Label htmlFor="isadmin">Is Admin?</Label>
                <input type="checkbox" name="isadmin" id="isadmin" defaultChecked={profile.isadmin} />
              </div>

            )
          }
          {/* {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )} */}

          <button
            className="bg-indigo-700 hover:bg-indigo-900 transition duration-300 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Update &rarr;
          </button>
        </form>
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

export default EditProfile;
