import NextAuth,{NextAuthOptions} from "next-auth"
import {MongoDBAdapter} from '@auth/mongodb-adapter'
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github'
import clientPromise from "@/lib/mongodb";

const options ={
  
  providers: [
    //Add more providers
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }), 
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter : MongoDBAdapter(clientPromise),

}

export default NextAuth(options);

