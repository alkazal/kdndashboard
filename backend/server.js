import express from "express";
import cors from "cors";
//import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const readJson = (relativePath) => {
  const fileUrl = new URL(relativePath, import.meta.url);
  const raw = fs.readFileSync(fileUrl, "utf-8");
  return JSON.parse(raw);
};

const statistik = readJson("./src/data/penguatkuasaan/statistik.json");
const operasi = readJson("./src/data/penguatkuasaan/operasi.json");
const laporan = readJson("./src/data/penguatkuasaan/laporan.json");
const penjawatan = readJson("./src/data/penguatkuasaan/statesPerjawatanInfo.json");
const profile = readJson("./src/data/user-profiles.json");

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

PROFIL PENGGUNA:
${JSON.stringify(profile)}
`;

app.post("/api/ai-chat", async (req, res) => {
  try {
    const { question, context, mode, answer, preferredType } = req.body;
    const resolvedContext = context || DEFAULT_CONTEXT;

    if (mode === "chart") {
      const chartPrompt = `
Anda ialah pembantu analitik. Berdasarkan soalan dan jawapan di bawah, bina data carta yang sesuai.
Pulangkan JSON SAHAJA dengan format:
{
  "type": "bar" | "line" | "pie",
  "title": "...",
  "labels": ["..."],
  "values": [0],
  "unit": "...",
  "note": "..." (pilihan)
}

Jika data tidak mencukupi untuk carta yang munasabah, pulangkan:
{ "error": "INSUFFICIENT_DATA" }

Keutamaan jenis carta (jika sesuai):
${preferredType || ""}

Soalan:
${question}

Jawapan:
${answer}
`;

      // const client = new OpenAI({
      //  baseURL: "http://150.150.216.150:11434/v1",
      //  apiKey: "ollama"
      // });

      // const chartCompletion = await client.chat.completions.create({
      //   model: "gpt-oss:120b",
      //   temperature: 0.2,
      //   response_format: { type: "json_object" },
      //   messages: [
      //     {
      //       role: "system",
      //       content:
      //         "Anda ialah pembantu analitik. Anda hanya membalas JSON yang sah untuk spesifikasi carta."
      //     },
      //     { role: "user", content: chartPrompt }
      //   ]
      // });
      
      const chartCompletion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Anda ialah pembantu analitik. Anda hanya membalas JSON yang sah untuk spesifikasi carta."
          },
          { role: "user", content: chartPrompt }
        ]
      });

      // const chartCompletion = await groq.chat.completions.create({
      //   model: "llama-3.3-70b-versatile",
      //   temperature: 0.2,
      //   response_format: { type: "json_object" },
      //   messages: [
      //     {
      //       role: "system",
      //       content:
      //         "Anda ialah pembantu analitik. Anda hanya membalas JSON yang sah untuk spesifikasi carta."
      //     },
      //     { role: "user", content: chartPrompt }
      //   ]
      // });

      let chart = null;
      try {
        chart = JSON.parse(chartCompletion.choices[0].message.content || "{}");
      } catch (parseError) {
        chart = { error: "INSUFFICIENT_DATA" };
      }

      if (!chart || chart.error) {
        res.json({ chart: { error: "INSUFFICIENT_DATA" } });
        return;
      }

      if (!Array.isArray(chart.labels) || !Array.isArray(chart.values)) {
        res.json({ chart: { error: "INSUFFICIENT_DATA" } });
        return;
      }

      if (preferredType && ["bar", "line", "pie"].includes(preferredType)) {
        chart.type = preferredType;
      }

      res.json({ chart });
      return;
    }

   
    // const client = new OpenAI({
    //    baseURL: "http://150.150.216.150:11434/v1",
    //    apiKey: "ollama"
    // });
    
    // const completion = await client.chat.completions.create({
    //   model: "gpt-oss:120b",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "Anda ialah pembantu analitik sistem dashboard kerajaan."
    //     },
    //     {
    //       role: "user",
    //       content: `${resolvedContext}\n\nSoalan:\n${question || ""}`
    //     }
    //   ]
    // });

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
    // const completion = await groq.chat.completions.create({
    //   model: "llama-3.3-70b-versatile",
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "Anda ialah pembantu analitik sistem dashboard kerajaan."
    //     },
    //     {
    //       role: "user",
    //       content: `${resolvedContext}\n\nSoalan:\n${question}`
    //     }
    //   ]
    // });

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
