import { useEffect, useState } from "react";
import { FlatsServices } from "@/services/flats/flatsServices";

import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import FlatTable from "../tableFlats/FlatTable";
import Model from "../3d-model/Model";
import { defineConfig } from 'vite';
import FlatMap from "../map/Map";

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
  return (
    <>
    <div className="relative mb-12">
        <div className="w-full h-[500px] rounded-xl overflow-hidden">
          <img
            src="/hero.png"
            alt="Beautiful vacation destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white w-full max-w-3xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg uppercase">
            Find your <span className="text-primary">happy place</span>
          </h1>
          <p className="text-xl mb-8 drop-shadow-md max-w-xl mx-auto">
            Discover unique homes and experiences around the world.
          </p>
        </div>
      </div>
    <main>
      <div className="container mx-auto h-[80vh] mb-40">
        <Model />
      </div>
      <FlatMap
  center={ { lat: -0.18, lng: -78.47 }} // Quito como fallback
  flats={flats}
/>
      <FlatTable
        flats={flats}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />
    </main>
    <footer className="bg-primary ">
      <div className="grid grid-cols-2 p-6 items-center container mx-auto">
        <div>
          <img src="/logo-white.svg" alt="LogoBlanco" />
        </div>
        <div>
          <p className="text-white">
            Copyright © 2025 EI Solutions, Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Home;
