import { prismaclient } from "@repo/db/prismaClient";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

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
                const accessToken = jwt.sign({
                    userId: user.id
                }, JWT_SECRET);
                return {
                    id: user.id,
                    username: user.email,
                    token: accessToken
                };
            },
          }),
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
          })
      ],
      callbacks: {  //callback are bascicallhy hook after sigin and before letting the user know that they are sigin , we do something with the credentials
        async signIn({user, account, profile}:any)  //signIN callback to control if a user is allowed to sigin in.
        {
            // Handle Google OAuth sign in
            if (account?.provider === "google" && user.email) {
                try {
                    // Check if user already exists
                    const existingUser = await prismaclient.user.findUnique({
                        where: { email: user.email }
                    });

                    if (!existingUser) {
                        // Generate a random secure password for Google users (they'll never use it)
                        const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
                        const hashedPassword = await bcrypt.hash(randomPassword, 10);

                        // Create new user with Google-provided data
                        const newUser = await prismaclient.user.create({
                            data: {
                                email: user.email,
                                password: hashedPassword,
                                name: user.name || user.email.split('@')[0], // Use name or fallback to email prefix
                                photo: user.image || null,
                            }
                        });

                        // Update the user object with the database ID
                        user.id = newUser.id;
                    } else {
                        // User exists, use their database ID
                        user.id = existingUser.id;
                    }
                } catch (error) {
                    console.error("Error saving Google user to database:", error);
                    return false; // Prevent sign in if database operation fails
                }
            }

            // Existing username check
            if(user.username=="rishi123")
            {
                return false;
            }
            else{
            return true;

            }
        },//request to useSession , getServerSession, getSession() will invoke this function , but only if you are using JWT session.
        async jwt({ token, user ,account}:any) {   //called when json webtoken is created(i.e at signin) or updated .The return value is encrypted and it is stored in the cookie  
            if (user) {     // the argument user are onlhy passed the first time this callback is called on a new session.aftet the user sign ins. In subsequent call . only token will be available
                console.log(JSON.stringify(user))
                
                // For Google OAuth, ensure we have the database user ID
                if (account?.provider === "google" && user.email && !user.id) {
                    const dbUser = await prismaclient.user.findUnique({
                        where: { email: user.email }
                    });
                    if (dbUser) {
                        user.id = dbUser.id;
                    }
                }
                
                token.id = user.id ?? token.id;
                token.username = user.username ?? token.username ?? user.email ?? user.name;
                if (user.token) {
                    token.accessToken = user.token;
                } else if (token.id) {
                    token.accessToken = jwt.sign({
                        userId: token.id
                    }, JWT_SECRET);
                }
                
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
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    pages: {
        signIn: '/api/signin',
    },
      secret: process.env.NEXTAUTH_SECRET
}

