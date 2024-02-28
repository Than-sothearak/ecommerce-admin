import { useSession, signIn } from "next-auth/react";
import { Nav } from "./Nav";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Footer } from "./Footer";
import Logo from "./Logo";
import Login from "./Login";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  
  const handleToggle = () => {
    setShowNav((current) => !current);
  };

  if (!session) {
    return (
      <div className="bg-gray-200">
        <Login />
       
      </div>
    );
  }
  return (
    <div className="min-h-screen ml-2">
   

      <div className="bg-gray-200 flex min-h-screen">
        <Nav show={showNav} />

        <div className="bg-white flex-grow p-4">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
