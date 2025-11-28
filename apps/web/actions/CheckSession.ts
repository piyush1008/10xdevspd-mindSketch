import { getServerSession } from "next-auth";




export default function CheckSession(){
    const session=getServerSession();
    return session;
}