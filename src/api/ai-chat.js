import OpenAI from "openai";
import operasi from "../data/penguatkuasaan/operasi.json";
import statistik from "../data/penguatkuasaan/statistik.json";
import laporan from "../data/penguatkuasaan/laporan.json";
import penjawatan from "../data/penguatkuasaan/penjawatan.json";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { question } = req.body;

  const context = `
DATA PENGUATKUASAAN:
${JSON.stringify(statistik)}

CONTOH OPERASI:
${JSON.stringify(operasi.slice(0, 10))}

LAPORAN PENGUATKUASAAN:
${JSON.stringify(laporan.slice(0, 10))}

DATA PENJAWATAN:
${JSON.stringify(penjawatan)}
`;

  const res = await fetch("/api/ai-chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    question: input,
    context: context
  })
});

  res.json({
    answer: completion.choices[0].message.content
  });
}
