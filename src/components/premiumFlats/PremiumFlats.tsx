// src/components/FlatsPremium.jsx
import { Link } from "react-router";
import FlatGallery from "../flatGallery/FlatGallery";
import { Button } from "../ui/button";

const FlatsPremium = ({ flats }) => {
  const premiumFlats = flats.filter((flat) => flat.isPremium).slice(0, 3);

  if (premiumFlats.length === 0) return null;

  return (
    <section className="mt-10 container mx-auto my-16 p-4">
      <h2 className="text-4xl font-bold mb-6 text-[#fff] text-center">
        Premium Flats
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {premiumFlats.map((flat) => (
          <div
            key={flat._id}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition-transform relative"
          >
            {/* <span className="bg-[#FFB600] text-white p-1  rounded-lg absolute top-3 left-3 z-10">Premium </span> */}
            <span className="absolute top-3 left-3 z-10 bg-[#006BE3] flex items-center gap-2 p-2 rounded-lg shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFF"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-star"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
              </svg>
              <span className="text-white">Premium</span>
            </span>
            <div className="">
              <FlatGallery images={flat.images} />
            </div>

            <div className="p-4 w-full flex justify-between items-center absolute bottom-0 left-0 bg-black/50 rounded-lg">
              <div className="w-[50%]">
                <h3 className="text-lg font-semibold text-white">
                  {flat.city}
                </h3>
                <p className="text-sm text-gray-300 truncate">
                  {flat.streetName} #{flat.streetNumber}
                </p>
                <p className="text-sm mt-2 text-gray-300">
                  {flat.areaSize} m² ·{" "}
                  <span className="font-semibold text-white">
                    ${flat.rentPrice}
                  </span>
                </p>
              </div>

              <div className="w-[50%]">
                <Button className="w-[200px] mx-auto bg-[#006BE3]">
                <Link to={`/flat/${flat._id}`}>View</Link>
              </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlatsPremium;
