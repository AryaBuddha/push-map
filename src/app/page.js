"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const room = searchParams.get("room");
  const paramFloor = searchParams.get("floor");

  const floors = ["basement", "ground", "first", "second", "third"];

  return (
    <div className="w-screen h-screen flex justify-center bg-[#101010] min-w-0 overflow-visible">
      <Image
        layout="fill"
        alt="Map of PUSH"
        objectFit="contain"
        src={`/api/${paramFloor || "first"}?room=${room}`}
      />
      <div className="flex flex-col items-center fixed bottom-24 gap-y-5">
        <h1 className="text-black text-3xl font-bold">Purdue PUSH</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/?room=${e.target[0].value}`);
          }}
        >
          <div className="flex gap-x-3">
            <input
              className="bg-white p-2 rounded-lg"
              placeholder="Room Code"
            />
            <button className="bg-white hover:bg-slate-200 p-2 rounded-lg text-2xl">
              {"->"}
            </button>
          </div>
        </form>
      </div>
      <div className="flex flex-row items-center gap-x-3 fixed bottom-10 gap-y-5">
        {floors.map((floor) => (
          <button
            key={floor}
            className={`bg-white p-2 rounded-lg ${
              paramFloor == floor && "bg-slate-400"
            }`}
            onClick={() => {
              router.push(`/?floor=${floor}`);
            }}
          >
            {floor.split("")[0].toUpperCase() + floor.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
