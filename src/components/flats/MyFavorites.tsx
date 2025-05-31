import React, { useEffect, useState } from "react";
import { FlatsServices } from "@/services/flats/flatsServices";
import FlatTable from "@/components/tableFlats/FlatTable"; // Tu componente reutilizable
import { useUser } from "@/context/UserContext";
import { useToast, toast } from '@/hooks/use-toast';

const MyFavorites = () => {
  const { userProfile } = useUser();
  const [flats, setFlats] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userProfile) return;

      const flatsService = new FlatsServices();
      const result = await flatsService.getUserFavorites(userProfile.id);

      if (result.success) {
        setFlats(result.flats);
      } else {
        console.log(result.error);
      }
    };
    fetchFavorites();
  }, [userProfile]);

  const handleDelete = async (flatId: string) => {
    const flatsService = new FlatsServices();
    const result = await flatsService.removeFavorite(userProfile.id, flatId);

    if (result.success) {
      setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: result.error,
      });
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Favorite Flats</h1>
      <FlatTable
        flats={flats}
        onDelete={handleDelete} // Pasa la función aquí
      />
    </div>
  );
};

export default MyFavorites;
