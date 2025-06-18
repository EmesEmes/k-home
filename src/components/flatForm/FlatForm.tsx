// src/components/flatForm/FlatForm.tsx
import React, { useRef, useState, useEffect } from "react";
import FlatMap from "@/components/map/Map"; // Ajusta la ruta según tu estructura
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface FlatFormProps {
  onSubmit: (newFlat: any) => Promise<void>;
  initialData?: any;
  disableImageUpload?: boolean;
}

const FlatForm: React.FC<FlatFormProps> = ({
  onSubmit,
  initialData,
  disableImageUpload,
}) => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const form = useRef<HTMLFormElement>(null);

  // Estados para coordenadas
  const [lat, setLat] = useState<number>(
    initialData?.lat !== undefined ? initialData.lat : 0
  );
  const [lng, setLng] = useState<number>(
    initialData?.lng !== undefined ? initialData.lng : 0
  );
  const [latText, setLatText] = useState<string>(
    initialData?.lat !== undefined ? String(initialData.lat) : ""
  );
  const [lngText, setLngText] = useState<string>(
    initialData?.lng !== undefined ? String(initialData.lng) : ""
  );

  // Sincronizar si viene initialData (modo edición)
  useEffect(() => {
    if (initialData?.lat !== undefined) {
      setLat(initialData.lat);
      setLatText(String(initialData.lat));
    }
    if (initialData?.lng !== undefined) {
      setLng(initialData.lng);
      setLngText(String(initialData.lng));
    }
  }, [initialData]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    const imagesInput = form.current.images as HTMLInputElement;
    const files = imagesInput ? Array.from(imagesInput.files || []) : [];

    const flatData: any = {
      city: form.current.city.value,
      streetName: form.current.streetname.value,
      streetNumber: form.current.streetnumber.value,
      areaSize: form.current.areasize.value,
      yearBuilt: form.current.yearbuilt.value,
      hasAC: form.current.hasac.checked,
      latitude: lat,
      longitude: lng,
      rentPrice: form.current.rentprice.value,
      dateAvailable: form.current.dateavailable.value,
      ownerId: currentUser?._id,
      images: files,
    };

    try {
      await onSubmit(flatData);
      form.current.reset();
      setImagePreviews([]);
      setLat(0);
      setLng(0);
      setLatText("");
      setLngText("");
    } catch (error: any) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message || "Something went wrong",
      });
    }
  };
  return (
    <form
      className="my-8"
      onSubmit={handleSubmit}
      ref={form}
      encType="multipart/form-data"
    >
      {/* Campos de texto normales */}
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
            defaultValue={initialData?.streetName}
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
            defaultValue={initialData?.streetNumber}
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
            defaultValue={initialData?.areaSize}
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
            defaultValue={initialData?.yearBuilt}
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
          defaultChecked={initialData?.hasAC}
        />
      </LabelInputContainer>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        
          <LabelInputContainer>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              placeholder="-0.136564"
              type="text"
              name="lat"  
              value={latText}
              onChange={(e) => {
                setLatText(e.target.value);
                const parsed = parseFloat(e.target.value);
                if (!isNaN(parsed)) setLat(parsed);
              }}
              required
            />
          </LabelInputContainer>
        
        
          <LabelInputContainer>
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              placeholder="-78.466265"
              type="text"
              name="lng"
              value={lngText}
              onChange={(e) => {
                setLngText(e.target.value);
                const parsed = parseFloat(e.target.value);
                if (!isNaN(parsed)) setLng(parsed);
              }}
              required
            />
          </LabelInputContainer>
        
      </div>

      {!disableImageUpload && (
        <div className="mb-6">
          <LabelInputContainer>
            <Label>Selecciona la ubicación en el mapa</Label>
            <FlatMap
              center={{ lat: lat || -0.18, lng: lng || -78.47 }}
              singleMarker={true}
              zoom={6}
              onClick={(coords) => {
                setLat(coords.lat);
                setLng(coords.lng);
                setLatText(coords.lat.toFixed(6));
                setLngText(coords.lng.toFixed(6));
              }}
            />
          </LabelInputContainer>
        </div>
      )}

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <LabelInputContainer>
          <Label htmlFor="rentprice">Rent Price</Label>
          <Input
            id="rentprice"
            placeholder="1350"
            type="text"
            name="rentprice"
            defaultValue={initialData?.rentPrice}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="dateavailable">Date Available</Label>
          <Input
            id="dateavailable"
            type="date"
            name="dateavailable"
            defaultValue={initialData?.dateAvailable}
            required
          />
        </LabelInputContainer>
      </div>

      {!disableImageUpload && (
        <LabelInputContainer>
          <Label htmlFor="images">Images (máx. 5)</Label>
          <Input
            id="images"
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <p className="text-sm text-muted-foreground">
            Selecciona hasta 5 fotos.
          </p>
        </LabelInputContainer>
      )}

      {/* Previsualizaciones de imágenes */}
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
        className="bg-primary hover:bg-primary/70 transition duration-300 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
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
