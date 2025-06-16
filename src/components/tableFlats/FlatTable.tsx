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
} from "@/components/icons";

import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

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
  images: string[];
}

interface FlatTableProps {
  favorites?: string[];
  onToggleFavorite?: (flatId: string) => void;
  onDelete?: (flatId: string) => void;
  onEdit?: any;
}

interface Filters {
  city: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  hasAC: string;
  sortBy: string;
  order: string;
}

const FlatTable: React.FC<FlatTableProps> = ({
  favorites = [],
  onToggleFavorite,
  onDelete,
  onEdit,
}) => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [view, setView] = useState<"table" | "cards">("table");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  // Estados para filtros
  const [filters, setFilters] = useState<Filters>({
    city: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    hasAC: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const inputCity = useRef<HTMLInputElement>(null);
  const formPrice = useRef<HTMLFormElement>(null);
  const formArea = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchFlats();
  }, []);

  const buildQueryParams = (customFilters?: Partial<Filters>) => {
    const activeFilters = { ...filters, ...customFilters };
    const params = new URLSearchParams();

    // Solo agregar parámetros que tengan valores
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== "") {
        params.append(key, value.toString());
      }
    });

    // Agregar paginación
    params.append("page", pagination.page.toString());
    params.append("limit", pagination.limit.toString());

    return params.toString();
  };

  const fetchFlats = async (customFilters?: Partial<Filters>) => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams(customFilters);
      const url = `http://localhost:8080/flats${queryParams ? `?${queryParams}` : ""}`;
      
      const res = await axios.get(url);
      setFlats(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Error fetching flats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityFilter = () => {
    const city = inputCity.current?.value.trim() || "";
    const newFilters = { ...filters, city };
    setFilters(newFilters);
    fetchFlats(newFilters);
  };

  const handleFilterPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minPrice = formData.get("minPrice")?.toString() || "";
    const maxPrice = formData.get("maxPrice")?.toString() || "";
    
    const newFilters = { ...filters, minPrice, maxPrice };
    setFilters(newFilters);
    fetchFlats(newFilters);
  };

  const handleFilterArea = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minArea = formData.get("minArea")?.toString() || "";
    const maxArea = formData.get("maxArea")?.toString() || "";
    
    const newFilters = { ...filters, minArea, maxArea };
    setFilters(newFilters);
    fetchFlats(newFilters);
  };

  const handleClean = () => {
    const cleanFilters: Filters = {
      city: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      hasAC: "",
      sortBy: "createdAt",
      order: "desc",
    };
    
    setFilters(cleanFilters);
    
    // Limpiar los formularios
    if (inputCity.current) inputCity.current.value = "";
    formPrice.current?.reset();
    formArea.current?.reset();
    
    fetchFlats(cleanFilters);
  };

  const handleSort = (criteria: "rentPrice" | "city" | "areaSize") => {
    const newOrder = filters.sortBy === criteria && filters.order === "asc" ? "desc" : "asc";
    const newFilters = { ...filters, sortBy: criteria, order: newOrder };
    setFilters(newFilters);
    fetchFlats(newFilters);
  };

  const handleACFilter = (hasAC: boolean | null) => {
    const newFilters = { ...filters, hasAC: hasAC === null ? "" : hasAC.toString() };
    setFilters(newFilters);
    fetchFlats(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchFlats({ ...filters });
  };

  return (
    <main className="mt-10 container mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div className="flex flex-col items-center gap-4">
          <p>
            Filter by <span className="text-primary">City</span>
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="City"
              className="w-60"
              ref={inputCity}
            />
            <Button onClick={handleCityFilter}>
              Filter <IconAdjustmentsAlt />
            </Button>
          </div>
        </div>

        <form
          onSubmit={handleFilterPrice}
          className="flex flex-col items-center gap-4"
          ref={formPrice}
        >
          <p>
            Filter by <span className="text-primary">Price</span>
          </p>
          <div className="flex items-center gap-3">
            <Input type="number" name="minPrice" placeholder="Min" className="w-20" />
            -
            <Input type="number" name="maxPrice" placeholder="Max" className="w-20" />
            <Button type="submit">
              Filter <IconAdjustmentsAlt />
            </Button>
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
            <Input type="number" name="minArea" placeholder="Min Area" className="w-20" />
            -
            <Input type="number" name="maxArea" placeholder="Max Area" className="w-20" />
            <Button type="submit">
              Filter <IconAdjustmentsAlt />
            </Button>
          </div>
        </form>

        <div className="flex flex-col items-center gap-4">
          <p>
            Filter by <span className="text-primary">AC</span>
          </p>
          <div className="flex gap-2">
            <Button 
              variant={filters.hasAC === "true" ? "default" : "outline"}
              onClick={() => handleACFilter(true)}
            >
              With AC
            </Button>
            <Button 
              variant={filters.hasAC === "false" ? "default" : "outline"}
              onClick={() => handleACFilter(false)}
            >
              No AC
            </Button>
            <Button 
              variant={filters.hasAC === "" ? "default" : "outline"}
              onClick={() => handleACFilter(null)}
            >
              All
            </Button>
          </div>
        </div>

        <Button onClick={handleClean}>
          Clean <IconEraser />
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => setView(view === "table" ? "cards" : "table")}
        >
          {view === "table" ? (
            <span className="flex items-center gap-2">
              View Cards <IconLayoutDashboard />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              View Table <IconTable />
            </span>
          )}
        </Button>

        <div className="text-sm text-gray-600">
          Showing {flats.length} of {pagination.total} flats
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading flats...</p>
        </div>
      )}

      {!loading && flats.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xl text-primary">No flats found</p>
        </div>
      )}

      {!loading && view === "table" && flats.length > 0 && (
        <Table className="container mx-auto">
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
                <Button onClick={() => handleSort("areaSize")} className="size-2">
                  <IconSortDescending />
                </Button>
              </TableHead>
              <TableHead>Year Built</TableHead>
              <TableHead>Has AC</TableHead>
              <TableHead className="flex items-center gap-2">
                Rent Price{" "}
                <Button onClick={() => handleSort("rentPrice")} className="size-2">
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
            {flats.map((flat) => (
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
                        <span className="flex items-center gap-4">
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
            ))}
          </TableBody>
        </Table>
      )}

      {!loading && view === "cards" && flats.length > 0 && (
        <div>
          <div className="flex gap-4 mt-10 mb-6">
            <Button onClick={() => handleSort("city")}>
              Sort by City <IconSortDescending />
            </Button>
            <Button onClick={() => handleSort("rentPrice")}>
              Sort by Price <IconSortDescending />
            </Button>
            <Button onClick={() => handleSort("areaSize")}>
              Sort by Area <IconSortDescending />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {flats.map((flat) => (
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
                      <IconCalendarWeek stroke={2} className="text-indigo-700" />
                    </span>
                    Available:{" "}
                    <span>
                      {new Date(flat.dateAvailable).toLocaleDateString("en-EN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </CardContent>
                <CardFooter>
                  {onToggleFavorite && (
                    <div className="flex gap-2 justify-center items-center">
                      <Button>
                        <Link
                          to={`/flat/${flat._id}`}
                          className="flex items-center gap-4"
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
                          <span className="flex items-center gap-4">
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
                            <IconEye className="dark:text-black" />
                          </span>
                        </Link>
                      </Button>
                      <Button
                        onClick={() => onDelete(flat._id)}
                        className="w-full flex items-center gap-4"
                      >
                        Delete
                        <span>
                          <IconTrash className="dark:text-black" />
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

      {/* Paginación */}
      {flats.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8 p-4 border-t">
          <Button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <div className="flex items-center gap-4 text-sm">
            <span>
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <span className="text-gray-500">
              ({pagination.total} total results)
            </span>
          </div>
          <Button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasMore || pagination.page >= pagination.totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {/* Debug info - puedes eliminar esto después */}
      <div className="mt-4 p-2 bg-gray-100 text-xs rounded">
        <p>Debug: Total pages: {pagination.totalPages}, Current page: {pagination.page}, Total items: {pagination.total}</p>
      </div>
    </main>
  );
};

export default FlatTable;