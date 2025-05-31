// import { useToast } from "@/hooks/use-toast"
import { UserService } from "@/services/user/userServices";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useUser } from "@/context/UserContext";
import { useLogout } from "@/services/logout";

const Profile = () => {
  const { setCurrentUser, setUserProfile } = useUser();
  const { idProfile } = useParams();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { handleLogout } = useLogout();

  // const {toast} = useToast()

  useEffect(() => {
    const fecthUser = async () => {
      const service = new UserService();
      const data = await service.getUserById(idProfile);
      if (data.success) {
        setProfile(data.user);
      } else {
        console.log(data.error);
      }
    };

    fecthUser();
  }, [idProfile]);

  const handleDelete = async () => {
    if (!profile?.id) return;
  
    const service = new UserService();
    const response = await service.deleteUser(profile.id);
  
    if (response.success) {
      console.log("Usuario eliminado exitosamente");
      await handleLogout();
      navigate("/"); // Redirigir al usuario después de eliminar su perfil
    } else {
      console.error("Error al eliminar usuario:", response.error);
    }
  };

  console.log(profile);

  return (
    <main className="container mx-auto mt-10">
      <h1 className="text-3xl text-center">Profile</h1>
      <div>
        {profile && (
          <Card className="w-[350px] mx-auto mt-10">
            <CardHeader>
              <div className="flex justify-center mx-auto w-40 mb-10">
                <img
                  src={`https://ggdyznkijkikcjuonxzz.supabase.co/storage/v1/object/public/avatars/${profile.avatar}`}
                  alt="profile"
                />
              </div>
              <CardTitle className="text-2xl">
                {profile.firstname} {profile.lastname}
              </CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p>Phone: {profile.phone}</p>
              </div>
              <div>
                <p>BirthDate: {profile.birthdate}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button><Link to={`/edit-profile/${profile.id}`} className="flex gap-2">Edit<span><IconEdit /></span></Link></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-red-600 hover:bg-red-900 text-white">Delete Account <span><IconTrash /></span></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-900 text-white">Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Profile;
