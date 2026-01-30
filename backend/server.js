import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const readJson = (relativePath) => {
  const fileUrl = new URL(relativePath, import.meta.url);
  const raw = fs.readFileSync(fileUrl, "utf-8");
  return JSON.parse(raw);
};

const statistik = readJson("./src/data/penguatkuasaan/statistik.json");
const operasi = readJson("./src/data/penguatkuasaan/operasi.json");
const laporan = readJson("./src/data/penguatkuasaan/laporan.json");
const penjawatan = readJson(
  "./src/data/penguatkuasaan/statesPerjawatanInfo.json"
);

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

app.post("/api/ai-chat", async (req, res) => {
  try {
    const { question, context } = req.body;
    const resolvedContext = context || DEFAULT_CONTEXT;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Anda ialah pembantu analitik sistem dashboard kerajaan."
        },
        {
          role: "user",
          content: `${resolvedContext}\n\nSoalan:\n${question}`
        }
      ]
    });

    res.json({
      answer: completion.choices[0].message.content
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(port, () => {
  console.log(`✅ AI backend running on http://localhost:${port}`);
});
