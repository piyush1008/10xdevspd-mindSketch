import { RoomCanvas } from "../../../components/RoomCanvas"






export default async function canvas({params}: any){
    const roomId=(await params).roomId

    console.log(`The room id is ${roomId}`)

    return(
      <RoomCanvas roomId={roomId} />
    )
   


 
}