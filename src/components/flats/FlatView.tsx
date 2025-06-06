// src/components/flats/FlatView.tsx

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { FlatsServices } from "@/services/flats/flatsServices";
import { UserService } from "@/services/user/userServices";
import { MessagesServices } from "@/services/messages/messagesServices";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import FlatMap from "../map/Map";
import {
  IconAirConditioning,
  IconArrowsMaximize,
  IconBrandWhatsapp,
  IconCalendarStats,
  IconCalendarWeek,
  IconCash,
  IconEdit,
  IconMail,
  IconMap2,
  IconMapPin,
  IconNumber,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";

interface Flat {
  _id: string;
  ownerId: string;
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  latitude: number;
  longitude: number;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  images: string[]; // asumimos que el backend devuelve un arreglo de rutas o un string con arreglo
}

interface Owner {
  firstname: string;
  lastname: string;
  email: string | null;
  phone: string;
}

const FlatView = () => {
  const [flat, setFlat] = useState<Flat | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const { currentUser } = useUser();
  const { idFlat } = useParams<{ idFlat: string }>();
  const form = useRef<HTMLFormElement>(null);
  const responseForm = useRef<HTMLFormElement>(null);

  // Paso 1: Obtener el flat desde el backend
  useEffect(() => {
    const fetchFlat = async () => {
      if (!idFlat) return;
      const flatService = new FlatsServices();
      const response = await flatService.getFlatById(idFlat);
      if (response.success && response.flat) {
        // Adaptamos el objeto para que coincida con nuestra interfaz Flat
        const f = response.flat;
        setFlat({
          _id: f._id,
          ownerId: f.ownerId,
          city: f.city,
          streetName: f.streetName,
          streetNumber: f.streetNumber,
          areaSize: f.areaSize,
          hasAC: f.hasAC,
          latitude: f.latitude,
          longitude: f.longitude,
          yearBuilt: f.yearBuilt,
          rentPrice: f.rentPrice,
          dateAvailable: new Date(f.dateAvailable).toLocaleDateString(),
          images: Array.isArray(f.images) ? f.images : [f.images],
        });
      } else {
        setFlat(null);
      }
    };
    fetchFlat();
  }, [idFlat]);

  // Paso 2: Obtener la información del dueño
  useEffect(() => {
    if (!flat || !flat.ownerId) return;
    const fetchOwner = async () => {
      const userService = new UserService();
      const response = await userService.getUserById(flat.ownerId);
      if (response.success && response.user) {
        setOwner({
          firstname: response.user.firstName,
          lastname: response.user.lastName,
          email: response.user.email,
          phone: response.user.phone,
        });
      } else {
        setOwner(null);
      }
    };
    fetchOwner();
  }, [flat]);

  // Paso 3: Obtener los comentarios para este flat
  useEffect(() => {
    if (!idFlat || !flat) return;
    const fetchComments = async () => {
      const messagesService = new MessagesServices();
      const response = await messagesService.getMessagesByFlatId(flat._id);
      if (response.success && Array.isArray(response.comments)) {
        setComments(response.comments);
      } else {
        setComments([]);
      }
    };
    fetchComments();
  }, [idFlat, flat]);

  // Paso 4: Función para enviar un nuevo comentario
  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current || !flat || !currentUser) return;
    const newComment = form.current.comment.value;
    if (!newComment) return;

    const messagesService = new MessagesServices();
    const response = await messagesService.createComment({
      flatId: flat._id,
      userId: currentUser._id,
      comment: newComment,
      username: `${currentUser.firstName} ${currentUser.lastName}`,
    });
    if (response.success) {
      setComments([...comments, response.data]);
      form.current.reset();
    } else {
      console.error("Error al enviar el comentario:", response.error);
    }
  };

  // Paso 5: Función para manejar el cambio de texto en respuestas
  const handleResponseChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    commentId: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [commentId]: e.target.value,
    }));
  };

  // Paso 6: Función para enviar respuesta a un comentario
  const handleResponse = async (
    e: React.FormEvent<HTMLFormElement>,
    commentId: string
  ) => {
    e.preventDefault();
    const newResponse = responses[commentId];
    if (!newResponse) {
      console.error("No se encontró una respuesta válida.");
      return;
    }

    try {
      const messagesService = new MessagesServices();
      const response = await messagesService.updateResponse({
        commentId,
        response: newResponse,
      });

      if (response.success) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, response: newResponse }
              : comment
          )
        );
        setResponses((prev) => ({ ...prev, [commentId]: "" }));
      } else {
        console.error("Error al enviar la respuesta:", response.error);
      }
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };

  // Paso 7: Transformar número de teléfono para WhatsApp
  const transformPhone = (phone: string) => {
    return "593" + phone.slice(1);
  };

  console.log(comments)

  // Mostrar skeleton mientras cargan los datos
  if (!flat || !owner) {
    return (
      <div className="container mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Skeleton className="w-full h-60" />
          </div>
          <div>
            <Skeleton className="w-full h-60" />
          </div>
        </div>
      </div>
    );
  }

  // Paso 8: Renderizado final
  return (
    <>
      <div className="container mx-auto mt-20 ">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <img
              src={`${flat.images[0]}`}
              alt="flat"
              className="rounded-lg shadow-md"
            />
            <div>
              <FlatMap lat={flat.latitude} lng={flat.longitude} />
            </div>
          </div>

          {currentUser?._id === flat.ownerId && (
            <Button className="mt-4 w-20 bg-indigo-700 shadow-md shadow-gray-700">
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
          )}

          <Card className="">
            <CardHeader>
              <CardTitle>Flat Information</CardTitle>
              <CardDescription>
                This could be the flat of your dreams
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              <CardDescription>
                <span className="text-indigo-700 text-2xl">Ubication Info</span>
              </CardDescription>
              <div className="grid grid-cols-3">
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                  <span>
                    <IconMap2 className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">City</p>
                    <p className="text-sm text-muted-foreground">
                      {flat.city}
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                  <span>
                    <IconMapPin className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Street Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.streetName}
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                  <span>
                    <IconNumber className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Street Number
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.streetNumber}
                    </p>
                  </div>
                </div>
              </div>

              <CardDescription>
                <span className="text-indigo-700 text-2xl">Flat Info</span>
              </CardDescription>
              <div className="grid grid-cols-3">
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                  <span>
                    <IconArrowsMaximize
                      className="text-indigo-700" stroke={2}
                    />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Area Size
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.areaSize} m²
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                  <span>
                    <IconAirConditioning className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Has AC?</p>
                    <p className="text-sm text-muted-foreground">
                      {flat.hasAC ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                  <span>
                    <IconCalendarStats className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Year Built
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.yearBuilt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3">
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                  <span>
                    <IconCash className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Rent Price
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${flat.rentPrice}
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                  <span>
                    <IconCalendarWeek className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Date Available
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.dateAvailable}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <CardDescription>
                  <span className="text-indigo-700 text-2xl">Owner Info</span>
                </CardDescription>
                <div>
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                    <span>
                      <IconUser className="text-indigo-700" stroke={2} />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Owner Name
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {owner.firstname} {owner.lastname}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 mt-10">
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                    <span>
                      <IconPhone className="text-indigo-700" stroke={2} />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        {owner.phone}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                    <span>
                      <IconMail className="text-indigo-700" stroke={2} />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {owner.email}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 gap-4">
                    <span>
                      <IconBrandWhatsapp className="text-indigo-700" stroke={2} />
                    </span>
                    <div className="space-y-1">
                      <Link
                        to={`https://wa.me/${transformPhone(owner.phone)}?text=¡Hola!%20Estoy%20visitando%20su%20sitio%20web%20y%20deseo%20más%20información`}
                        target="_blank"
                      >
                        <Button>Chat Owner</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      </div>

      {currentUser?._id !== flat.ownerId && (
        <form
          onSubmit={handleComment}
          className="container mx-auto mt-20"
          ref={form}
        >
          <Textarea name="comment" className="w-96" required />
          <Button type="submit" className="mt-6">
            Send
          </Button>
        </form>
      )}

      {comments.length > 0 ? (
        <div className="container mx-auto my-10">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-lg p-4 shadow-md mb-4 container mx-auto"
            >
              <div className="flex justify-between flex-col">
                <div className="text-left">
                  <p className="font-bold text-primary">{comment.username}</p>
                  <p>{comment.content}</p>
                  <span className="text-sm text-gray-400">
                    {comment.createAt}
                  </span>
                </div>
                <div className="text-right">
                  {comment.response ? (
                    <div>
                      <p>{comment.response}</p>
                      <span className="text-sm text-gray-400">
                        {comment.responsetime}
                      </span>
                    </div>
                  ) : (
                    "No response yet"
                  )}
                </div>
              </div>
              {currentUser?._id === flat.ownerId && (
                <form onSubmit={(e) => handleResponse(e, comment.id)}>
                  <span>Respond</span>
                  <Textarea
                    name="responseText"
                    value={responses[comment.id] || ""}
                    onChange={(e) => handleResponseChange(e, comment.id)}
                    required
                  />
                  <Button type="submit">Send</Button>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="container mx-auto my-10">
          <p className="text-center">No comments yet</p>
        </div>
      )}
    </>
  );
};

export default FlatView;
