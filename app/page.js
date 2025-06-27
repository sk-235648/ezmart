
"use client";

import Bigcard from "@/components/cards/Bigcard";
import Frontpg from "@/components/home/Frontpg";
import Card from "@/components/cards/Card";
import AdminPanel from "@/components/cards/admin";
 
export default function Home() {
  return (
     
    <>
      <Frontpg />
      <Card />
      <Bigcard />
      <AdminPanel/>
    </>
 
  );
}

