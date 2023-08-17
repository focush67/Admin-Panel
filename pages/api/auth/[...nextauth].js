import NextAuth,{NextAuthOptions} from "next-auth"
import {MongoDBAdapter} from '@auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from "@/lib/mongodb";

const options ={
  
  providers: [
    //Add more providers
    
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter : MongoDBAdapter(clientPromise),

}

export default NextAuth(options);

