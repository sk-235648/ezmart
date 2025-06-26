//app/page.js
"use client";

import Bigcard from "@/components/cards/Bigcard";
import Frontpg from "@/components/home/Frontpg";
import Card from "@/components/cards/Card";
 
export default function Home() {
  return (
     
    <>
      <Frontpg />
      <Card />
      <Bigcard />
     
    </>
 
  );
}

