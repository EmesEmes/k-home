// src/components/flats/MyFavorites.tsx

import React, { useEffect, useState } from "react";
import { FlatsServices } from "@/services/flats/flatsServices";
import FlatTable from "@/components/tableFlats/FlatTable";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";


const MyFavorites: React.FC = () => {
  const { currentUser, token } = useUser();
  const [flats, setFlats] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser || !token) {
        setFlats([]);
        return;
      }

      const flatsService = new FlatsServices();
      const result = await flatsService.getUserFavorites(currentUser._id, token);

      if (result.success && result.flats) {
        setFlats(result.flats);
      } else {
        console.error(result.error);
      }
    };

    fetchFavorites();
  }, [currentUser, token]);

  const handleDelete = async (flatId: string) => {
    if (!currentUser || !token) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Debes iniciar sesión para quitar favoritos.",
      });
      return;
    }
    console.log(flatId)

    const flatsService = new FlatsServices();
    const result = await flatsService.toggleFavorite(currentUser._id, flatId, token);

    if (result.success) {
      setFlats((prevFlats) => prevFlats.filter((flat) => flat._id !== flatId));
      toast({ title: "Favorito eliminado" });
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: result.message || "No se pudo quitar de favoritos.",
      });
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Favorite Flats</h1>
      <FlatTable
        flats={flats}
        favorites={flats.map((f) => f._id)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MyFavorites;
