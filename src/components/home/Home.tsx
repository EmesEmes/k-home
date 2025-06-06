import { useEffect, useState } from "react";
import { FlatsServices } from "@/services/flats/flatsServices";

import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import FlatTable from "../tableFlats/FlatTable";

const Home = () => {
  const [flats, setFlats] = useState([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { currentUser, token } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const getFlats = async () => {
      const flats = new FlatsServices();
      const example = await flats.getFlats();
      console.log(example.flats);
      if (example.success) {
        setFlats(example.flats);
      } else {
        setFlats([]);
      }
    };
    getFlats();
  }, []);

  useEffect(() => {
  const fetchFavorites = async () => {
    if (!currentUser || !token) {
      setFavorites([]);
      return;
    }

    const flatsService = new FlatsServices();
    const result = await flatsService.getFavorites(currentUser._id, token);

    if (result.success && result.data) {
      // result.data es arreglo de Flat
      const ids = (result.data as Flat[]).map((f) => f._id);
      setFavorites(ids);
    } else {
      setFavorites([]);
      if (!result.success) {
        toast({
          title: "Error",
          variant: "destructive",
          description: result.message || "No se pudieron cargar favoritos.",
        });
      }
    }
  };

  fetchFavorites();
}, [currentUser, token, toast]);

  const toggleFavorite = async (flatId: string) => {
    console.log(flatId)
    // 4.a) Verificamos que esté autenticado
    if (!currentUser || !token) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Debes iniciar sesión para marcar como favorito.",
      });
      return;
    }

    // 4.b) Llamamos al servicio que alterna el favorito
    const flatsService = new FlatsServices();
    const result = await flatsService.toggleFavorite(
      currentUser._id,
      flatId,
      token
    );

    if (result.success) {
      // 4.c) Si ya estaba en favoritos, lo quitamos; si no, lo agregamos
      setFavorites((prev) =>
        prev.includes(flatId)
          ? prev.filter((id) => id !== flatId)
          : [...prev, flatId]
      );
      toast({
        title: prev.includes(flatId)
          ? "Flat eliminado de favoritos"
          : "Flat agregado a favoritos",
      });
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: result.message || "Error al alternar favorito.",
      });
    }
  };
  console.log(flats);
  return (
    <main>
      <FlatTable
        flats={flats}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
};

export default Home;
