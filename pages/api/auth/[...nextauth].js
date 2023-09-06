import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

const adminEmails = [process.env.EMAIL_1];
export const options = {
  providers: [
    //Add more providers

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter: MongoDBAdapter(clientPromise),
  callbacks:{
    session:({session,token,user}) => {
      if(adminEmails.includes(session?.user?.email)){
        return session;
      }
      else{
        console.log("Not an Admin Email");
        return false;
      }
    }
  }
};

export default NextAuth(options);

export async function isAdminRequest(request,response){
  const session = await getServerSession(request,response,options);

  if(!adminEmails.includes(session?.user?.email))
  {
    response.status(401);
    response.end();
    throw "Not Admin Request";
  }
}