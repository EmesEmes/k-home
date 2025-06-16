import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconMap2,
  IconMapPin,
  IconCash,
  IconCalendarWeek,
  IconEye,
  IconTrash,
  IconPlus,
  IconEdit,
  IconAdjustmentsAlt,
  IconEraser,
  IconTable,
  IconLayoutDashboard,
  IconSortDescending,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
// import { FlatsServices } from "@/services/flats/flatsServices";

interface Flat {
  _id: string;
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  yearBuilt: number;
  hasAC: boolean;
  rentPrice: number;
  dateAvailable: string;
  images: string;
}

interface FlatTableProps {
  flats: Flat[];
  favorites?: string[];
  onToggleFavorite?: (flatId: string) => void;
  onDelete?: (flatId: string) => void;
  onEdit?: any;
}

const FlatTable: React.FC<FlatTableProps> = ({
  flats,
  favorites = [],
  onToggleFavorite,
  onDelete,
  onEdit,
}) => {
  const [search, setSearch] = useState(flats);
  const [view, setView] = useState<"table" | "cards">("table");
  const [sortCriteria, setSortCriteria] = useState<
    "price" | "city" | "area" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const inputCity = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const formArea = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setSearch(flats);
  }, [flats]);

  const handleChangeCity = () => {
    const query = inputCity.current?.value.trim().toLowerCase() || "";

    if (query.length === 0) {
      setSearch(flats);
      return;
    }

    const filtered = flats.filter((flat) =>
      flat.city.toLowerCase().includes(query)
    );

    setSearch(filtered);
  };

  const handleFilterPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const min = parseInt(form.current?.elements[0].value) || 0;
    const max = parseInt(form.current?.elements[1].value) || Infinity;

    const filtered = flats.filter(
      (flat) => flat.rentPrice >= min && flat.rentPrice <= max
    );

    setSearch(filtered);
  };

  const handleFilterArea = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const min = parseInt(formArea.current?.elements[0].value) || 0;
    const max = parseInt(formArea.current?.elements[1].value) || Infinity;
    const filtered = search.filter(
      (flat) => flat.areaSize >= min && flat.areaSize <= max
    );
    setSearch(filtered);
  };

  const handleClean = () => {
    setSearch(flats);
    form.current?.reset();
    formArea.current?.reset();
  };

  const handleSort = (criteria: "price" | "city" | "area") => {
    const direction =
      sortCriteria === criteria && sortDirection === "asc" ? "desc" : "asc";
    setSortCriteria(criteria);
    setSortDirection(direction);

    const sorted = [...search].sort((a, b) => {
      if (criteria === "price") {
        return direction === "asc"
          ? a.rentPrice - b.rentPrice
          : b.rentPrice - a.rentPrice;
      } else if (criteria === "city") {
        return direction === "asc"
          ? a.city.localeCompare(b.city)
          : b.city.localeCompare(a.city);
      } else if (criteria === "area") {
        return direction === "asc"
          ? a.areaSize - b.areaSize
          : b.areaSize - a.areaSize;
      }
      return 0;
    });

    setSearch(sorted);
  };

  return (
    <main className="mt-10 container mx-auto">
      <div className="flex items-end justify-between">
        <div className="flex flex-col items-center gap-4">
          <p>
            Filter by <span className="text-primary">City</span>
          </p>
          <Input
            type="text"
            placeholder="City"
            className="w-60"
            ref={inputCity}
            onChange={handleChangeCity}
          />
        </div>
        <form
          onSubmit={(e) => handleFilterPrice(e)}
          className="flex flex-col items-center gap-4"
          ref={form}
        >
          <p>
            Filter by <span className="text-primary">price</span>
          </p>
          <div className="flex items-center gap-3">
            <Input type="number" placeholder="Min" className="w-20" />
            -
            <Input type="number" placeholder="Max" className="w-20" />
            <div className="flex gap-2">
              <Button type="submit">
                Filter{" "}
                <span>
                  <IconAdjustmentsAlt />
                </span>
              </Button>
            </div>
          </div>
        </form>
        <form
          onSubmit={handleFilterArea}
          className="flex flex-col items-center gap-4"
          ref={formArea}
        >
          <p>
            Filter by <span className="text-primary">Area</span>
          </p>
          <div className="flex gap-3 items-center">
            <Input type="number" placeholder="Min Area" className="w-20" />
            -
            <Input type="number" placeholder="Max Area" className="w-20" />
            <Button type="submit">
              Filter{" "}
              <span>
                <IconAdjustmentsAlt />
              </span>
            </Button>
          </div>
        </form>
        <Button onClick={handleClean}>
          Clean{" "}
          <span>
            <IconEraser />
          </span>
        </Button>
      </div>

      <Button
        onClick={() => setView(view === "table" ? "cards" : "table")}
        className="mt-10"
      >
        {view === "table" ? (
          <span className="flex items-center gap-2">
            View Cards
            <span>
              <IconLayoutDashboard />
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            View Table
            <span>
              <IconTable />
            </span>
          </span>
        )}
      </Button>
      {view === "table" ? (
        <Table className="container mx-auto ">
          <TableCaption>List of Flats</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>
                <IconEye />
              </TableHead>
              <TableHead className="flex items-center gap-2">
                City{" "}
                <Button onClick={() => handleSort("city")} className="size-2">
                  <IconSortDescending />
                </Button>
              </TableHead>
              <TableHead>Street Name</TableHead>
              <TableHead>Street Number</TableHead>
              <TableHead className="flex items-center gap-2">
                Area Size{" "}
                <Button onClick={() => handleSort("area")} className="size-2">
                  <IconSortDescending />
                </Button>
              </TableHead>
              <TableHead>Year Built</TableHead>
              <TableHead>Has AC</TableHead>
              <TableHead className="flex items-center gap-2">
                Rent Price{" "}
                <Button onClick={() => handleSort("price")} className="size-2">
                  <IconSortDescending />
                </Button>
              </TableHead>
              <TableHead>Date Available</TableHead>
              {onToggleFavorite && <TableHead>Favorite</TableHead>}
              {onDelete && <TableHead>Delete</TableHead>}
              {onEdit && <TableHead>Edit</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {search.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-xl text-primary"
                >
                  No flats found
                </TableCell>
              </TableRow>
            ) : (
              search.map((flat) => (
                <TableRow key={flat._id}>
                  <TableCell>
                    <Link
                      to={`/flat/${flat._id}`}
                      className="text-blue-500 dark:text-primary underline"
                    >
                      View
                    </Link>
                  </TableCell>
                  <TableCell>{flat.city}</TableCell>
                  <TableCell>{flat.streetName}</TableCell>
                  <TableCell>{flat.streetNumber}</TableCell>
                  <TableCell>{flat.areaSize}</TableCell>
                  <TableCell>{flat.yearBuilt}</TableCell>
                  <TableCell>{flat.hasAC ? "Yes" : "No"}</TableCell>
                  <TableCell>{flat.rentPrice}</TableCell>
                  <TableCell>
                    {new Date(flat.dateAvailable).toLocaleDateString("en-EN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </TableCell>
                  {onToggleFavorite && (
                    <TableCell className="w-20">
                      <Button
                        onClick={() => onToggleFavorite(flat._id)}
                        className="w-full dark:bg-[#FAF9F6]"
                      >
                        {favorites.includes(flat._id) ? (
                          <span className="flex  items-center gap-4">
                            Remove Favorite
                            <span>
                              <IconTrash />
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-4">
                            Add Favorite
                            <span>
                              <IconPlus />
                            </span>
                          </span>
                        )}
                      </Button>
                    </TableCell>
                  )}
                  {onDelete && (
                    <TableCell>
                      <Button
                        onClick={() => onDelete(flat._id)}
                        className="w-full flex items-center gap-4 bg-red-700 hover:bg-red-900 text-white"
                      >
                        Delete
                        <span>
                          <IconTrash />
                        </span>
                      </Button>
                    </TableCell>
                  )}
                  {onEdit && (
                    <TableCell>
                      <Button>
                        <Link
                          to={`/flat-edit/${flat._id}`}
                          className="flex items-center gap-4"
                        >
                          Edit
                          <span>
                            <IconEdit />
                          </span>
                        </Link>
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      ) : (
        <div>
          <div className="flex gap-4 mt-10 mb-6">
            <Button onClick={() => handleSort("city")}>
              Sort by City <IconSortDescending />
            </Button>
            <Button onClick={() => handleSort("price")}>
              Sort by Price <IconSortDescending />
            </Button>
            <Button onClick={() => handleSort("area")}>
              Sort by Area <IconSortDescending />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
            {search.map((flat) => (
              <Card className="w-[380px]" key={flat._id}>
                <CardHeader>
                  <div>
                    <img
                      src={`${flat.images[0]}`}
                      alt={flat.city}
                      className="rounded-xl"
                    />
                  </div>
                  <CardTitle className="flex gap-2 items-center">
                    <span>
                      <IconMap2 className="text-indigo-700" stroke={2} />
                    </span>
                    {flat.city}
                  </CardTitle>
                  <CardDescription className="flex gap-2 items-center">
                    <span>
                      <IconMapPin className="size-4" stroke={2} />
                    </span>
                    {flat.streetName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between">
                  <p className="flex gap-2">
                    <span>
                      <IconCash stroke={2} className="text-indigo-700" />
                    </span>
                    ${flat.rentPrice}
                  </p>
                  <p className="flex gap-2">
                    <span>
                      <IconCalendarWeek
                        stroke={2}
                        className="text-indigo-700"
                      />
                    </span>
                    Available:{" "}
                    <span>
                      {new Date(flat.dateAvailable).toLocaleDateString(
                        "en-EN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </p>
                </CardContent>
                <CardFooter>
                  {onToggleFavorite && (
                    <div className="flex gap-2 justify- items-center">
                      <Button>
                        <Link
                          to={`/flat/${flat._id}`}
                          className="flex items-center gap-4 "
                        >
                          View{" "}
                          <span>
                            <IconEye />
                          </span>
                        </Link>
                      </Button>
                      <Button
                        onClick={() => onToggleFavorite(flat._id)}
                        className="w-"
                      >
                        {favorites.includes(flat._id) ? (
                          <span className="flex  items-center gap-4">
                            Remove Favorite
                            <span>
                              <IconTrash />
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-4">
                            Add Favorite
                            <span>
                              <IconPlus />
                            </span>
                          </span>
                        )}
                      </Button>
                    </div>
                  )}
                  {onDelete && (
                    <div className="flex gap-2">
                      <Button>
                        <Link
                          to={`/flat/${flat._id}`}
                          className="flex items-center gap-4"
                        >
                          View{" "}
                          <span>
                            <IconEye className=" dark:text-black" />
                          </span>
                        </Link>
                      </Button>
                      <Button
                        onClick={() => onDelete(flat._id)}
                        className="w-full flex items-center gap-4"
                      >
                        Delete
                        <span>
                          <IconTrash className=" dark:text-black" />
                        </span>
                      </Button>
                    </div>
                  )}
                  {onEdit && (
                    <div className="flex gap-2">
                      <Button>
                        <Link
                          to={`/flat/${flat._id}`}
                          className="flex items-center gap-4"
                        >
                          View
                          <span>
                            <IconEye />
                          </span>
                        </Link>
                      </Button>
                      <Button>
                        <Link
                          to={`/flat-edit/${flat._id}`}
                          className="flex items-center gap-4"
                        >
                          Edit
                          <span>
                            <IconEdit />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
          
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default FlatTable;
