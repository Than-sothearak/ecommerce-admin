import { useSession, signIn } from "next-auth/react";
import { Nav } from "./Nav";
import React from "react";
import {FcGoogle} from "react-icons/fc";

export default function Layout({ children }) {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full flex justify-center">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg flex"
          >
           <FcGoogle className="w-6 h-6 mr-2"/>
            Continute with Google
            
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mb-2 mr-2 rounded-lg p-4">
        {children}
      </div>
    </div>
  );
}
