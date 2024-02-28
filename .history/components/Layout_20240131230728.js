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
      <div className="lg:hidden flex items-center">
        <button onClick={() => handleToggle()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center p-4 mr-6">
        <Logo />
        </div>
       
      </div>

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
