import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export async function writeTextToFile(text: string) {
  try {
    await writeFile(path.resolve(process.cwd(), "npm-debug.log"), text, "utf-8");
  } catch (err) {
    console.error("Failed to write debug file:", err);
  }
}
