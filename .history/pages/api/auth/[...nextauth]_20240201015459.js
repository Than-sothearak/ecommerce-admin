import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from "@/lib/mongodb";
import { Admin } from '@/models/Admin';
import { mongooseConnect } from '@/lib/mongoose';
import Google from "next-auth/providers/google";

async function isAdminEmail (role) {
  await mongooseConnect();
  if ((await Admin.findOne({role}))) {
    return true;
  } else {
    return false;
  }
}
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: async ({session,token,user}) => {
      if (await isAdminEmail(session?.user?.role)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req,res) {
  const session = await getServerSession(req,res,authOptions);
  if (!(await isAdminEmail(session?.user?.role))) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}

// export default NextAuth({
//   providers: [
//     Google({
//       profile(profile) {
//         return { 
//         profile,
//         id: profile.sub,
//         role: userRole,}
//       },
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET
//     })
//   ],
//   callbacks: {
//     jwt({ token, user }) {
//       if(user) token.role = user.role
//       return token
//     },
//     session({ session, token }) {
//       session.user.role = token.role
//       return session
//     }
//   }
// })