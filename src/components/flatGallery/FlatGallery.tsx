import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react"; // usa íconos bonitos

interface Props {
  images: string[];
}

const FlatGallery = ({ images }: Props) => {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 10,
    },
  });

  return (
    <div className="relative">
      {/* Botón Izquierda */}
      <button
        onClick={() => slider.current?.prev()}
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Botón Derecha */}
      <button
        onClick={() => slider.current?.next()}
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-gray-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Carrusel */}
      <div
        ref={sliderRef}
        className="keen-slider rounded-xl shadow-md overflow-hidden"
      >
        {images.map((src, index) => (
          <div className="keen-slider__slide" key={index}>
            <img
              src={src}
              alt={`Flat image ${index + 1}`}
              className="w-full h-96 object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlatGallery;