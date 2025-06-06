// src/components/flats/NewFlat.tsx
import { FlatsServices } from "@/services/flats/flatsServices";
import { useToast } from "@/hooks/use-toast";
import FlatForm from "../flatForm/FlatForm";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";

const NewFlat = () => {
  const { toast } = useToast();
  const { token, currentUser } = useUser(); // extraemos token y currentUser
  const navigate = useNavigate();

  // Creamos una instancia de FlatsServices
  const flatService = new FlatsServices();

  const handleSubmit = async (newFlat: any) => {
    // 1) Construir el FormData
    const formData = new FormData();
    formData.append("city", newFlat.city);
    formData.append("streetName", newFlat.streetName);
    formData.append("streetNumber", newFlat.streetNumber.toString());
    formData.append("areaSize", newFlat.areaSize.toString());
    formData.append("yearBuilt", newFlat.yearBuilt.toString());
    formData.append("hasAC", newFlat.hasAC ? "true" : "false");
    formData.append("latitude", newFlat.latitude);
    formData.append("longitude", newFlat.longitude);
    formData.append("rentPrice", newFlat.rentPrice.toString());
    formData.append("dateAvailable", newFlat.dateAvailable);
    // El ownerId proviene de currentUser._id
    formData.append("ownerId", currentUser?._id);

    // 2) Adjuntar las imágenes (arreglo de File)
    newFlat.images.forEach((file: File) => {
      formData.append("images", file);
    });

    // 3) Llamar al servicio en lugar de usar fetch directo
    const result = await flatService.createFlat(formData, token);

    if (result.success) {
      toast({
        title: "Flat Created",
        description: "Your flat has been created successfully",
      });
      navigate("/my-flats"); // o a la ruta que prefieras
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: result.error || "Error creating flat",
      });
    }
  };

  return (
    <main>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-10">
        <h2 className="font-bold text-xl">
          Let's Create a <span className="text-primary">New Flat</span>
        </h2>
        <FlatForm onSubmit={handleSubmit} disableImageUpload={false} />
      </div>
    </main>
  );
};

export default NewFlat;
