import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";
import GithubProvider from 'next-auth/providers/github';
const adminEmails = [process.env.EMAIL_2];
export const options = {
  providers: [
    GoogleProvider({
      callbackURL:process.env.NEXTAUTH_REDIRECT_URL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    GithubProvider({
      clientId:process.env.GITHUB_ID,
      clientSecret:process.env.GITHUB_SECRET,
    })
  ],

  authorization:{
    url:process.env.NEXTAUTH_URL,

    params:{
      redirect_uri:process.env.NEXTAUTH_REDIRECT_URL
    }
  },

  secret: process.env.NEXTAUTH_SECRET,

  adapter: MongoDBAdapter(clientPromise),

  session: {
    jwt: true,
  },

};

export default NextAuth(options);

export async function isAdminRequest(request, response) {
  const session = await getServerSession(request, response, options);

  if (!adminEmails.includes(session?.user?.email)) {
    response.status(401);
    response.end();
    throw "Not Admin Request";
  }
}
