// src/components/flats/MyFlats.tsx

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { FlatsServices } from "@/services/flats/flatsServices";
import FlatTable from "@/components/tableFlats/FlatTable";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { IconPlus } from "@/components/icons";


const MyFlats: React.FC = () => {
  const { currentUser, token } = useUser();
  const [flats, setFlats] = useState([]);

  useEffect(() => {
    const fetchFlats = async () => {
      if (!currentUser || !token) return;

      const flatsService = new FlatsServices();
      const result = await flatsService.getFlatsByUserId(currentUser._id, token);
      if (result.success && result.flats) {
        setFlats(result.flats);
      } else {
        console.error(result.error);
      }
    };

    fetchFlats();
  }, [currentUser, token]);

  const handleEdit = (flatId: string) => {
    // Redirigir a la página de edición
    // Por ejemplo, podrías usar navigate(`/flat-edit/${flatId}`)
    console.log("Editar flat:", flatId);
  };

  return (
    <main className="container mx-auto mt-10">
      <h2 className="text-3xl text-center mb-10">
        My <span className="text-primary">Flats</span>
      </h2>
      <Button className="bg-primary shadow-md shadow-gray-700 mb-6">
        <Link to="/new-flat" className="flex items-center gap-2">
          New Flat <IconPlus />
        </Link>
      </Button>

      <FlatTable
        flats={flats}
        onEdit={(flatId: string) => handleEdit(flatId)}
      />
    </main>
  );
};

export default MyFlats;
