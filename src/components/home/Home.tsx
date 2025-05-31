import { useEffect, useState } from "react";
import { FlatsServices } from "@/services/flats/flatsServices";

import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import FlatTable from "../tableFlats/FlatTable";

const Home = () => {
  const [flats, setFlats] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { userProfile } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const getFlats = async () => {
      const flats = new FlatsServices();
      const example = await flats.getFlats();
      console.log(example.flats)
      if (example.success) {
        setFlats(example.flats);
      } else {
        setFlats([]);
      }
    };
    getFlats();
  }, []);

  useEffect(() => {
    const getFavorites = async () => {
      const user = userProfile;
      if (user) {
        const flatsService = new FlatsServices();
        const result = await flatsService.getFavorites(user.id);
        if (result.success) {
          console.log(result.favorites);
          setFavorites(result.favorites);
        } else {
          console.log(result.error);
        }
      }
    };
    getFavorites();
  }, [userProfile]);

  const toggleFavorite = async (flatId: string) => {
    const user = userProfile;
    if (userProfile === null) {
          toast({
            title: "Error",
            variant: "destructive",
            description: "You must be logged in to add a favorite",
          });
          return;
        }
    const flatsService = new FlatsServices();
    if (favorites.includes(flatId)) {
      const result = await flatsService.removeFavorite(user.id, flatId);
      if (result.success) {
        setFavorites(favorites.filter((id) => id !== flatId));
      } else {
        console.log(result.error);
      }
    } else {
      const result = await flatsService.addFavorite(flatId, user.id, );
      if (result.success) {
        setFavorites([...favorites, flatId]);
      } else {
        console.log(result.error);
      }
    }
  };
  return (
    <>
      <FlatTable flats={flats} favorites={favorites} onToggleFavorite={toggleFavorite} />
    </>
  );
};

export default Home;
