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
  IconEye,
  IconEraser,
  IconAdjustmentsAlt,
  IconSortDescending,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { UserService } from "@/services/user/userServices";
import { FlatsServices } from "@/services/flats/flatsServices";
import { Link } from "react-router";
import { Input } from "../ui/input";

const Admin = () => {
  const [users, setUsers] = useState(null);
  const [flats, setFlats] = useState(null);
  const [sortCriteria, setSortCriteria] = useState<
    "firstname" | "lastname" | "age" | "flats"
  >("firstname");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Estados para los filtros
  const [isAdminFilter, setIsAdminFilter] = useState<boolean | null>(null);
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [minFlats, setMinFlats] = useState<number | null>(null);
  const [maxFlats, setMaxFlats] = useState<number | null>(null);

  // Estados para los valores temporales de los filtros
  const [tempMinAge, setTempMinAge] = useState<number | null>(null);
  const [tempMaxAge, setTempMaxAge] = useState<number | null>(null);
  const [tempMinFlats, setTempMinFlats] = useState<number | null>(null);
  const [tempMaxFlats, setTempMaxFlats] = useState<number | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      const fetchUsers = new UserService();
      const response = await fetchUsers.getAllUsers();
      if (response.success) {
        setUsers(response.users);
      } else {
        console.error(response.error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getFlats = async () => {
      const fetchFlats = new FlatsServices();
      const response = await fetchFlats.getFlats();
      if (response.success) {
        setFlats(response.flats);
      } else {
        console.error(response.error);
      }
    };
    getFlats();
  }, []);

  const countFlats = (userId) => {
    const userFlats = flats.filter((flat) => flat.userid === userId);
    return userFlats.length;
  };

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSort = (criteria: "firstname" | "lastname" | "age" | "flats") => {
    const direction =
      sortCriteria === criteria && sortDirection === "asc" ? "desc" : "asc";
    setSortCriteria(criteria);
    setSortDirection(direction);

    const sorted = [...users].sort((a, b) => {
      if (criteria === "firstname") {
        return direction === "asc"
          ? a.firstname.localeCompare(b.firstname)
          : b.firstname.localeCompare(a.firstname);
      } else if (criteria === "lastname") {
        return direction === "asc"
          ? a.lastname.localeCompare(b.lastname)
          : b.lastname.localeCompare(a.lastname);
      } else if (criteria === "age") {
        const ageA = calculateAge(a.birthdate);
        const ageB = calculateAge(b.birthdate);
        return direction === "asc" ? ageA - ageB : ageB - ageA;
      } else if (criteria === "flats") {
        const flatsA = countFlats(a.id);
        const flatsB = countFlats(b.id);
        return direction === "asc" ? flatsA - flatsB : flatsB - flatsA;
      }
      return 0;
    });

    setUsers(sorted);
  };

  // Función para aplicar los filtros
  const applyFilters = () => {
    setMinAge(tempMinAge);
    setMaxAge(tempMaxAge);
    setMinFlats(tempMinFlats);
    setMaxFlats(tempMaxFlats);
  };

  // Función para limpiar los filtros
  const handleClean = () => {
    setIsAdminFilter(null);
    setMinAge(null);
    setMaxAge(null);
    setMinFlats(null);
    setMaxFlats(null);
    setTempMinAge(null);
    setTempMaxAge(null);
    setTempMinFlats(null);
    setTempMaxFlats(null);
  };

  // Función para filtrar usuarios
  const filterUsers = () => {
    let filteredUsers = users;

    if (isAdminFilter !== null) {
      filteredUsers = filteredUsers.filter(
        (user) => user.isadmin === isAdminFilter
      );
    }

    if (minAge !== null || maxAge !== null) {
      filteredUsers = filteredUsers.filter((user) => {
        const age = calculateAge(user.birthdate);
        return (
          (minAge === null || age >= minAge) &&
          (maxAge === null || age <= maxAge)
        );
      });
    }

    if (minFlats !== null || maxFlats !== null) {
      filteredUsers = filteredUsers.filter((user) => {
        const flatsCount = countFlats(user.id);
        return (
          (minFlats === null || flatsCount >= minFlats) &&
          (maxFlats === null || flatsCount <= maxFlats)
        );
      });
    }

    return filteredUsers;
  };

  const filteredUsers = filterUsers();

  if (!users || !flats) {
    return (
      <main className="container mx-auto mt-10">
        <h1 className="text-3xl font-semibold text-center">
          All <span className="text-indigo-700">Users</span>
        </h1>
        <p className="text-center mt-5">Loading...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold text-center">
        All <span className="text-indigo-700">Users</span>
      </h1>
      <div className="flex items-end justify-between mt-10">
        <div className="flex items-center gap-2">
          <label>Is Admin:</label>
          <select
            value={isAdminFilter === null ? "" : isAdminFilter.toString()}
            onChange={(e) =>
              setIsAdminFilter(
                e.target.value === "" ? null : e.target.value === "true"
              )
            }
            className="p-2 border rounded"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p>
            Filter by <span className="text-indigo-700">Age</span>
          </p>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              placeholder="Min Age"
              value={tempMinAge === null ? "" : tempMinAge}
              onChange={(e) =>
                setTempMinAge(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
              className="w-20"
            />
            -
            <Input
              type="number"
              placeholder="Max Age"
              value={tempMaxAge === null ? "" : tempMaxAge}
              onChange={(e) =>
                setTempMaxAge(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
              className="w-20"
            />
            <Button onClick={applyFilters}>
              Filter{" "}
              <span>
                <IconAdjustmentsAlt />
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p>
            Filter by <span className="text-indigo-700">Flats Count</span>
          </p>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              placeholder="Min Flats"
              value={tempMinFlats === null ? "" : tempMinFlats}
              onChange={(e) =>
                setTempMinFlats(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
              className="w-20"
            />
            -
            <Input
              type="number"
              placeholder="Max Flats"
              value={tempMaxFlats === null ? "" : tempMaxFlats}
              onChange={(e) =>
                setTempMaxFlats(
                  e.target.value === "" ? null : parseInt(e.target.value)
                )
              }
              className="w-20"
            />
            <Button onClick={applyFilters}>
              Filter{" "}
              <span>
                <IconAdjustmentsAlt />
              </span>
            </Button>
          </div>
        </div>

        <Button onClick={handleClean}>
          Clean{" "}
          <span>
            <IconEraser />
          </span>
        </Button>
      </div>

      {/* Botones de ordenación */}
      <div className="flex gap-4 mt-10"></div>

      {/* Tabla de usuarios */}
      <Table className="container mx-auto">
        <TableCaption>List of Users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <IconEye />
            </TableHead>
            <TableHead className="flex items-center gap-2">
              First Name{" "}
              <Button
                onClick={() => handleSort("firstname")}
                className="size-2"
              >
                <IconSortDescending />
              </Button>
            </TableHead>
            <TableHead >
              Last Name{" "}
              <Button onClick={() => handleSort("lastname")} className="size-2">
                <IconSortDescending />
              </Button>
            </TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Birthdate</TableHead>
            <TableHead>
              Age{" "}
              <Button onClick={() => handleSort("age")} className="size-2">
                <IconSortDescending />
              </Button>
            </TableHead>
            <TableHead>Is Admin?</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              Flats{" "}
              <Button onClick={() => handleSort("flats")} className="size-2">
                <IconSortDescending />
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/profile/${user.id}`}>
                  <IconEye />
                </Link>
              </TableCell>
              <TableCell>{user.firstname}</TableCell>
              <TableCell>{user.lastname}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.birthdate}</TableCell>
              <TableCell>{calculateAge(user.birthdate)}</TableCell>
              <TableCell>{user.isadmin ? "Yes" : "No"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{countFlats(user.id)}</TableCell>
              <TableCell className="flex space-x-2">
                <Button>
                  <Link to={`/edit-profile/${user.id}`}>Edit</Link>
                </Button>
                <Button>
                  <Link to={`/profile/${user.id}`}>Delete</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default Admin;
