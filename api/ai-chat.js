import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const readJson = (relativePath) => {
  const fileUrl = new URL(relativePath, import.meta.url);
  const raw = fs.readFileSync(fileUrl, "utf-8");
  return JSON.parse(raw);
};

const takeSample = (data, limit = 10) => {
  if (Array.isArray(data)) {
    return data.slice(0, limit);
  }

  if (data && typeof data === "object") {
    const values = Object.values(data);
    const flattened = values.flatMap((value) =>
      Array.isArray(value) ? value : [value]
    );
    return flattened.slice(0, limit);
  }

  return [];
};

const statistik = readJson("../src/data/penguatkuasaan/statistik.json");
const operasi = readJson("../src/data/penguatkuasaan/operasi.json");
const laporan = readJson("../src/data/penguatkuasaan/laporan.json");
const penjawatan = readJson(
  "../src/data/penguatkuasaan/statesPerjawatanInfo.json"
);

const DEFAULT_CONTEXT = `
DATA PENGUATKUASAAN:
${JSON.stringify(statistik)}

CONTOH OPERASI:
${JSON.stringify(takeSample(operasi, 10))}

LAPORAN PENGUATKUASAAN:
${JSON.stringify(takeSample(laporan, 10))}

DATA PENJAWATAN:
${JSON.stringify(penjawatan)}
`;

const readBody = async (req) => {
  if (req.body) return req.body;

  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        resolve({});
      }
    });
    req.on("error", reject);
  });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const body = await readBody(req);
    const { question, context } =
      typeof body === "string" ? JSON.parse(body) : body || {};
    const resolvedContext = context || DEFAULT_CONTEXT;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Anda ialah pembantu analitik sistem dashboard kerajaan."
        },
        {
          role: "user",
          content: `${resolvedContext}\n\nSoalan:\n${question || ""}`
        }
      ]
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        answer: completion.choices[0].message.content
      })
    );
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "AI request failed" }));
  }
}
