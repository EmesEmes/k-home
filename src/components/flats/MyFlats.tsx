import { useUser } from "@/context/UserContext";
import FlatTable from "../tableFlats/FlatTable"
import { useEffect, useState } from "react";
import { FlatsServices } from "@/services/flats/flatsServices";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { IconPlus } from "@tabler/icons-react";


const MyFlats = () => {
  const { userProfile} = useUser();
  const [flats, setFlats] = useState([]);
  
  useEffect(() => {
    const fetchFlats = async() => {
      if(!userProfile) return;
      const flatsService = new FlatsServices();
      const result = await flatsService.getFlatsByUserId(userProfile.id);
      if(result.success){
        setFlats(result.flats)
      } else {
        console.log(result.error)
      }
    }
    fetchFlats()
  },[userProfile])

  console.log(flats)

  const handleEdit = async(flatId) => {
    console.log("Edit")
  }
  return (
    <main className="container mx-auto mt-10">
      <h2 className="text-3xl text-center mb-10">My <span className="text-indigo-700">Flats</span></h2>
      <Button className="bg-indigo-700 shadow-md shadow-gray-700"><Link to={`/new-flat`} className="flex items-center gap-2">New Flat <span><IconPlus /></span></Link></Button>
      <FlatTable flats={flats} onEdit/>
    </main>
  )
}

export default MyFlats