import NextAuth, {getServerSession} from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from "@/lib/mongodb";
import { Admin } from '@/models/Admin';
import { mongooseConnect } from '@/lib/mongoose';
import Google from "next-auth/providers/google";

async function isAdminEmail (email) {
  await mongooseConnect();
  if ((await Admin.findOne({email}))) {
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
      if (await isAdminEmail(session?.user?.email)) {
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
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}

export const authorizeRoles = (roles) => async (req, res, next) => {
  const userRoles = req?.session?.user?.roles || [];

  if (roles.some((role) => userRoles.includes(role))) {
    return next();
  } else {
    return res.status(403).json({ message: 'Access forbidden' });
  }
};

