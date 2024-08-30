import fsp from "node:fs/promises";

const d = fsp.readFile("file.txt", "utf8");
