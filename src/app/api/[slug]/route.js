import sharp from "sharp";
import fs from "fs";
import path from "path";

import { roomPaths } from "../roomPaths";

export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("room");

  const mapPath = path.resolve(`./public/${params.slug.toLowerCase()}.png`);
  const pinPath = path.resolve("./public/pin.png");

  const mapBuffer = fs.readFileSync(mapPath);
  const pinBuffer = fs.readFileSync(pinPath);

  if (!roomPaths[query] || !query) {
    return new Response(mapBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  }

  const pinPosition = { left: roomPaths[query].l, top: roomPaths[query].t };
  const pinSize = { width: 150, height: 150 };

  const resizedPinBuffer = await sharp(pinBuffer)
    .resize(pinSize.width, pinSize.height)
    .toBuffer();

  const outputBuffer = await sharp(mapBuffer)
    .composite([
      {
        input: resizedPinBuffer,
        left: pinPosition.left,
        top: pinPosition.top,
      },
    ])
    .toBuffer();

  return new Response(outputBuffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
