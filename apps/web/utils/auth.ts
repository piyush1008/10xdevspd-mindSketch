import { prismaclient } from "@repo/db/prismaClient";
import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions={
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
              username: { label: 'email', type: 'text', placeholder: '' },
              password: { label: 'password', type: 'password', placeholder: '' },
            },
            async authorize(credentials: any) {
                const username=credentials.username;
                const password=credentials.password;
                 console.log(`username is ${username} and password is ${password}`)
                const user=await prismaclient.user.findFirst({
                    where:{
                        email:username
                    }
                })
                if(!user)
                {
                    return null;
                }
                const hashpassword=await bcrypt.compare(password, user.password);
                if(!hashpassword)
                {
                    return null;
                }
                return {
                    id: user.id
                };
            },
          }),
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
          })
      ],
      callbacks: {  //callback are bascicallhy hook after sigin and before letting the user know that they are sigin , we do something with the credentials
        async signIn({user}:any)  //signIN callback to control if a user is allowed to sigin in.
        {
            if(user.username=="rishi123")
            {
                return false;
            }
            else{
            return true;

            }
        },//request to useSession , getServerSession, getSession() will invoke this function , but only if you are using JWT session.
        async jwt({ token, user }:any) {   //called when json webtoken is created(i.e at signin) or updated .The return value is encrypted and it is stored in the cookie  
            if (user) {     // the argument user are onlhy passed the first time this callback is called on a new session.aftet the user sign ins. In subsequent call . only token will be available
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }:any) { //this is important this is what helps you access session data in the client component.
            console.log(session)
            console.log(token)
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
            }
            return session;
        },
    },
      secret: process.env.NEXTAUTH_SECRET
}

