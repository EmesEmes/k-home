import { FlatsServices } from "@/services/flats/flatsServices";
import { useToast } from "@/hooks/use-toast";
import FlatForm from "../flatForm/FlatForm";

const NewFlat = () => {
  const { toast } = useToast();

  const handleSubmit = async (newFlat: any) => {
    const createFlat = new FlatsServices();
    const result = await createFlat.createFlat(newFlat);

    if (result.success) {
      toast({
        title: "Flat Created",
        description: "Your flat has been created successfully",
      });
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: result.error,
      });
    }
  };

  return (
    <main>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black mt-10">
        <h2 className="font-bold text-xl">
          Let's Create a <span className="text-indigo-700">New Flat</span>
        </h2>
        <FlatForm onSubmit={handleSubmit} disableImageUpload={false}/>
      </div>
    </main>
  );
};

export default NewFlat;