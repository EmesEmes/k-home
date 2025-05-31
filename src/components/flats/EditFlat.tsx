import { FlatsServices } from "@/services/flats/flatsServices";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useToast } from "@/hooks/use-toast";
import FlatForm from "../flatForm/FlatForm";

const EditFlat = () => {
  const { idFlat } = useParams();
  const [flat, setFlat] = useState(null);
  const { toast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    async function getFlat() {
      const flatService = new FlatsServices();
      const response = await flatService.getFlatById(idFlat);
      if (response.success) {
        setFlat(response.flat);
      } else {
        console.error(response.error);
      }
    }
    getFlat();
  }, [idFlat]);

  const handleSubmit = async (updatedFlat: any) => {
    const flatService = new FlatsServices();
    const result = await flatService.updateFlat(idFlat, updatedFlat);

    if (result.success) {
      toast({
        title: "Flat Updated",
        description: "Your flat has been updated successfully",
      });
      navigate(`/my-flats`);
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: result.error,
      });
    }
  };

  if (!flat) {
    return <p>Loading...</p>;
  }

  return (
    <main className="container mx-auto mt-10">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-10">
        <h2 className="font-bold text-xl">
          Edit <span className="text-indigo-700">Flat</span>
        </h2>
        <FlatForm onSubmit={handleSubmit} initialData={flat} disableImageUpload={true}/>
      </div>
    </main>
  );
};

export default EditFlat;