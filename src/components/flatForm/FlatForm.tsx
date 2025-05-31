import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface FlatFormProps {
  onSubmit: (newFlat: any) => Promise<void>;
  initialData?: any;
  disableImageUpload?: boolean;
}

const FlatForm = ({ onSubmit, initialData,disableImageUpload }: FlatFormProps) => {
  const { userProfile } = useUser();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { toast } = useToast();
  const form = useRef<HTMLFormElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;
    const imagesInput = form.current.images; 
    const imageFile = imagesInput ? imagesInput.files[0] : null;

    const updatedFlat = {
      city: form.current.city.value,
      streetname: form.current.streetname.value,
      streetnumber: form.current.streetnumber.value,
      areasize: form.current.areasize.value,
      yearbuilt: form.current.yearbuilt.value,
      hasac: form.current.hasac.checked,
      lat: form.current.lat.value,
      lng: form.current.lng.value,
      rentprice: form.current.rentprice.value,
      dateavailable: form.current.dateavailable.value,
      userid: userProfile.id,
      images: imageFile || initialData?.images || null,
    };

    try {
      await onSubmit(updatedFlat);
      form.current.reset();
      setImagePreviews([]);
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    }
  };

  return (
    <form className="my-8" onSubmit={handleSubmit} ref={form}>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Quito"
          type="text"
          name="city"
          defaultValue={initialData?.city}
          required
        />
      </LabelInputContainer>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="streetname">Street Name</Label>
          <Input
            id="streetname"
            placeholder="Av. Amazonas"
            type="text"
            name="streetname"
            defaultValue={initialData?.streetname}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="streetnumber">Street Number</Label>
          <Input
            id="streetnumber"
            placeholder="1351"
            type="number"
            name="streetnumber"
            defaultValue={initialData?.streetnumber}
            required
          />
        </LabelInputContainer>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="areasize">Area Size</Label>
          <Input
            id="areasize"
            placeholder="120"
            type="text"
            name="areasize"
            defaultValue={initialData?.areasize}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="yearbuilt">Year Built</Label>
          <Input
            id="yearbuilt"
            placeholder="2021"
            type="number"
            name="yearbuilt"
            defaultValue={initialData?.yearbuilt}
            required
          />
        </LabelInputContainer>
      </div>
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      <LabelInputContainer className="flex flex-row space-x-2 items-center space-y-0 mb-6">
        <Label htmlFor="hasac">Has AC?</Label>
        <Input
          id="hasac"
          type="checkbox"
          name="hasac"
          defaultChecked={initialData?.hasac}
        />
      </LabelInputContainer>
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            placeholder="-0.13656401685736502"
            type="string"
            name="lat"
            defaultValue={initialData?.lat}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            placeholder="-78.46626533735454"
            type="string"
            name="lng"
            defaultValue={initialData?.lng}
            required
          />
        </LabelInputContainer>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="rentprice">Rent Price</Label>
          <Input
            id="rentprice"
            placeholder="1350"
            type="text"
            name="rentprice"
            defaultValue={initialData?.rentprice}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="dataavailable">Date Available</Label>
          <Input
            id="dateavailable"
            type="date"
            name="dateavailable"
            defaultValue={initialData?.dateavailable}
            required
          />
        </LabelInputContainer>
      </div>
      {!disableImageUpload && (
        <LabelInputContainer>
          <Label htmlFor="images">Images</Label>
          <Input
            id="images"
            type="file"
            name="images"
            accept="image/*"
            onChange={handleImageChange}
          />
        </LabelInputContainer>
      )}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {imagePreviews.map((src, index) => (
          <div key={index} className="relative">
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              className="object-cover w-full h-24 rounded-md"
            />
          </div>
        ))}
      </div>

      <button
        className="bg-indigo-700 hover:bg-indigo-900 transition duration-300 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        type="submit"
      >
        {initialData ? "Update Flat 🏠" : "Create Flat 🏠"}
      </button>
    </form>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default FlatForm;
