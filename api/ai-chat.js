import fs from "fs";
import path from "path";
import OpenAI from "openai";
import Groq from "groq-sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY
// });

const readJson = (relativePath) => {
  const filePath = path.join(process.cwd(), relativePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
};

const normalizeAll = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    const values = Object.values(data);
    return values.flatMap((value) =>
      Array.isArray(value) ? value : [value]
    );
  }

  return [];
};


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
    if (!process.env.OPENAI_API_KEY) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "GROQ_API_KEY is not set" }));
      return;
    }

    const statistik = readJson("src/data/penguatkuasaan/statistik.json");
    const operasi = readJson("src/data/penguatkuasaan/operasi.json");
    const laporan = readJson("src/data/penguatkuasaan/laporan.json");
    const penjawatan = readJson(
      "src/data/penguatkuasaan/statesPerjawatanInfo.json"
    );

    const DEFAULT_CONTEXT = `
DATA PENGUATKUASAAN:
${JSON.stringify(statistik)}

CONTOH OPERASI:
${JSON.stringify(normalizeAll(operasi))}

LAPORAN PENGUATKUASAAN:
${JSON.stringify(normalizeAll(laporan))}

DATA PENJAWATAN:
${JSON.stringify(penjawatan)}
`;

    const body = await readBody(req);
    const { question, context, mode, answer, preferredType } =
      typeof body === "string" ? JSON.parse(body) : body || {};
    const resolvedContext = context || DEFAULT_CONTEXT;

    if (mode === "chart") {
      const chartPrompt = `
Anda perlu menjana spesifikasi carta daripada jawapan AI dan konteks data.
Balas HANYA dalam JSON yang sah, tiada teks tambahan.

Skema:
{
  "type": "bar" | "line" | "pie",
  "title": "string",
  "labels": ["string"],
  "values": [number],
  "unit": "string" | "",
  "note": "string" | ""
}

Jika data tidak mencukupi untuk carta, balas:
{"error":"NOT_ENOUGH_DATA"}

Keutamaan jenis carta (jika sesuai):
${preferredType || ""}

Soalan pengguna:
${question || ""}

Jawapan AI:
${answer || ""}

Konteks data:
${resolvedContext}
`;

    // const client = new OpenAI({
    //    baseURL: "http://150.150.216.150:11434/v1",
    //    apiKey: "ollama"
    // });
    
    // const chartCompletion = await client.chat.completions.create({
    //   model: "gpt-oss:120b",
    //     messages: [
    //       {
    //         role: "system",
    //         content:
    //           "Anda ialah pembantu analitik. Anda hanya membalas JSON yang sah untuk spesifikasi carta."
    //       },
    //       {
    //         role: "user",
    //         content: chartPrompt
    //       }
    //     ]
    //   });

    const chartCompletion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Anda ialah pembantu analitik. Anda hanya membalas JSON yang sah untuk spesifikasi carta."
        },
        {
          role: "user",
          content: chartPrompt
        }
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
    //     {
    //       role: "user",
    //       content: chartPrompt
    //     }
    //   ]
    // });

      let chart = null;
      try {
        chart = JSON.parse(chartCompletion.choices[0].message.content || "{}");
      } catch (parseError) {
        chart = { error: "NOT_ENOUGH_DATA" };
      }

      if (preferredType && ["bar", "line", "pie"].includes(preferredType)) {
        if (chart && !chart.error) {
          chart.type = preferredType;
        }
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          chart
        })
      );
      return;
    }

    // const client = new OpenAI({
    //        baseURL: "http://150.150.216.150:11434/",
    //        apiKey: "ollama"
    //     });
    
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
          content: "Anda ialah pembantu analitik sistem dashboard kerajaan."
        },
        {
          role: "user",
          content: `${resolvedContext}\n\nSoalan:\n${question || ""}`
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
