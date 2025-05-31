import { FlatsServices } from "@/services/flats/flatsServices";
import { UserService } from "@/services/user/userServices";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
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
import { MessagesServices } from "@/services/messages/messagesServices";
import { useUser } from "@/context/UserContext";
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
  id: string;
  userid: string;
  city: string;
  streetname: string;
  streetnumber: string;
  areasize: number;
  hasac: boolean;
  lat: number;
  lng: number;
  yearbuilt: number;
  rentprice: number;
  dateavailable: string;
  images: string;
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
  const [comments, setComments] = useState([]);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  const { userProfile } = useUser();

  const { idFlat } = useParams<{ id: string }>();
  const form = useRef<HTMLFormElement>(null);
  const responseForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchFlat = async () => {
      const flatService = new FlatsServices();
      const response = await flatService.getFlatById(idFlat);
      setFlat(response.flat);
    };
    fetchFlat();
  }, [idFlat]);

  useEffect(() => {
    if (!flat || !flat.userid) return;

    const fetchOwner = async () => {
      const userService = new UserService();
      const response = await userService.getUserById(flat.userid);

      if (response && response.user) {
        setOwner(response.user);
      }
    };

    fetchOwner();
  }, [flat]);

  useEffect(() => {
    if (!idFlat || !flat) return;

    const fetchComments = async () => {
      const messagesService = new MessagesServices();
      const response = await messagesService.getMessagesByFlatId(flat.id);

      if (response.success && Array.isArray(response.comments)) {
        setComments(response.comments);
      }
    };

    fetchComments();
  }, [idFlat, flat]);

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newComment = form.current?.comment.value;
    if (!newComment) return;

    const messagesService = new MessagesServices();
    const response = await messagesService.createComment({
      flatId: flat.id,
      userId: userProfile?.id,
      comment: newComment,
      username: `${userProfile?.firstname} ${userProfile?.lastname}`,
    });
    if (response.success) {
      console.log(response);
      setComments([...comments, response.data[0]]);
      form.current?.reset();
    } else {
      console.error("Error al enviar el comentario:", response.error);
    }
  };

  const handleResponseChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    commentId: string
  ) => {
    setResponses((prev) => ({
      ...prev,
      [commentId]: e.target.value,
    }));
  };

  const handleResponse = async (
    e: React.FormEvent<HTMLFormElement>,
    commentId: string
  ) => {
    e.preventDefault();

    const newResponse = responses[commentId];
    console.log("Nueva respuesta para el comentario:", newResponse);

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
        setResponses((prev) => ({ ...prev, [commentId]: "" })); // Limpiar el campo después de enviar
        console.log("Respuesta enviada correctamente");
      } else {
        console.error("Error al enviar la respuesta:", response.error);
      }
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };

  const transformPhone = (phone) => {
    
      const transformedPhone = "593" + phone.slice(1);
      return transformedPhone
    
  }

  console.log(comments);

  if (!flat || !owner || comments === null) {
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

  return (
    <>
      <div className="container mx-auto mt-20 ">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <img
              src={`https://ggdyznkijkikcjuonxzz.supabase.co/storage/v1/object/public/flatsimages/${flat.images}`}
              alt="flat"
              className="rounded-lg shadow-md"
            />
            <div>
              <FlatMap lat={flat.lat} lng={flat.lng} />
            </div>
          </div>
          {userProfile?.id === flat.userid && (
            <Button className="mt-4 w-20 bg-indigo-700 shadow-md shadow-gray-700">
              <Link
                to={`/flat-edit/${flat.id}`}
                className="flex items-center gap-4 "
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
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                  <span>
                    <IconMap2 className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">City</p>
                    <p className="text-sm text-muted-foreground">{flat.city}</p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                  <span>
                    <IconMapPin className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Street Name
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.streetname}
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                  <span>
                    <IconNumber className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Street Number
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.streetnumber}
                    </p>
                  </div>
                </div>
              </div>
              <CardDescription>
                <span className="text-indigo-700 text-2xl">Flat Info</span>
              </CardDescription>
              <div className="grid grid-cols-3">
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                  <span>
                    <IconArrowsMaximize
                      className="text-indigo-700"
                      stroke={2}
                    />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Area Size
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.areasize}m2
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                  <span>
                    <IconAirConditioning
                      className="text-indigo-700"
                      stroke={2}
                    />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Has AC?</p>
                    <p className="text-sm text-muted-foreground">
                      {flat.hasac ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                  <span>
                    <IconCalendarStats className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Year Built
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.yearbuilt}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                  <span>
                    <IconCash className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Rent Price
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${flat.rentprice}
                    </p>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                  <span>
                    <IconCalendarWeek className="text-indigo-700" stroke={2} />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Date Available
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flat.dateavailable}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <CardDescription>
                  <span className="text-indigo-700 text-2xl">Owner Info</span>
                </CardDescription>
                <div>
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
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
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
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
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
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
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-center pb-4 last:mb-0 last:pb-0 gap-4">
                    <span>
                      <IconBrandWhatsapp className="text-indigo-700" stroke={2} />
                    </span>
                    <div className="space-y-1">
                      <Link to={`https://wa.me/${transformPhone(owner.phone)}?text=¡Hola!%20Estoy%20visitando%20su%20sitio%20web%20y%20deseo%20más%20información"`} target="_blanks">
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
      {userProfile?.id !== flat.userid && (
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
              key={comment.id}
              className="rounded-lg p-4 shadow-md mb-4 container mx-auto"
            >
              <div className="flex justify-between flex-col">
                <div className="text-left">
                  <p className="font-bold">{comment.username}</p>
                  <p>{comment.comment}</p>

                  <span className="text-sm text-gray-400">
                    {comment.created_at}
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
              {userProfile?.id === flat.userid && (
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
