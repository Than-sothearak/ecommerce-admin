import Dashboard from "@/components/Dashboard";
import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import React from "react";
export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
    <div className="px-6 py-6 border rounded-md text-sm">
    <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>
        </h2>
        <div className="flex bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
          <img
            src={session?.user?.image}
            alt={session?.user?.name}
            className="w-8 h-8"
          />
          <span className="py-1 px-2">{session?.user?.name}</span>
        </div>
      </div>
      <Dashboard />
    </div>

     
    </Layout>
  );
}
