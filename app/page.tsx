'use client'
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    redirect('/dashboard');
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
    </div>
  );
}