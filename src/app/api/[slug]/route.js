import sharp from "sharp";
import fs from "fs/promises"; // Using the promise-based version of 'fs'
import path from "path";
import { roomPaths } from "../roomPaths";

export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("room");
  let mapPath;

  if (!query || query === "null") {
    mapPath = path.join("public", `${params.slug.toLowerCase()}.png`);
  } else if (roomPaths[query.toUpperCase()]) {
    const floor = roomPaths[query.toUpperCase()].floor;
    mapPath = path.join("public", `${floor.toUpperCase()}.png`);
  } else {
    return new Response("Room not found", { status: 404 });
  }

  try {
    const pinPath = path.join("public", "pin.png");
    const [mapBuffer, pinBuffer] = await Promise.all([
      fs.readFile(mapPath),
      fs.readFile(pinPath),
    ]);

    let outputBuffer = mapBuffer;

    if (query && roomPaths[query.toUpperCase()]) {
      const pinPosition = { left: roomPaths[query].l, top: roomPaths[query].t };
      const pinSize = { width: 150, height: 150 };

      const resizedPinBuffer = await sharp(pinBuffer)
        .resize(pinSize.width, pinSize.height)
        .toBuffer();

      outputBuffer = await sharp(mapBuffer)
        .composite([
          {
            input: resizedPinBuffer,
            left: pinPosition.left,
            top: pinPosition.top,
          },
        ])
        .toBuffer();
    }

    return new Response(outputBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
