import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReactECharts from "echarts-for-react";

export default function AIAssistantPanel({ open, onClose }) {
  const panelRef = useRef(null);
  const messagesRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Selamat datang! Saya AI Assistant. Tanyakan data, statistik, atau ringkasan yang anda perlukan.",
      chart: null,
      chartLoading: false,
      chartError: null
    }
  ]);

  useEffect(() => {
    gsap.to(panelRef.current, {
      x: open ? 0 : -360,
      duration: 0.4,
      ease: "power3.out"
    });
  }, [open]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const submit = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });

      const text = await res.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        data = null;
      }

      if (!res.ok) {
        const errorMessage =
          data?.error ||
          data?.message ||
          text ||
          "Maaf, terdapat ralat pada pelayan.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errorMessage }
        ]);
        return;
      }

      const answer = data?.answer || "Maaf, tiada jawapan diterima.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          chart: null,
          chartLoading: false,
          chartError: null
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ralat rangkaian. Sila cuba lagi.",
          chart: null,
          chartLoading: false,
          chartError: null
        }
      ]);
    }
  };

  const updateMessageAt = (index, updater) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? updater(msg) : msg))
    );
  };

  const buildChartOption = (chart) => {
    if (!chart || !chart.type) return null;

    const title = chart.title || "Carta Analitik";
    const labels = Array.isArray(chart.labels) ? chart.labels : [];
    const values = Array.isArray(chart.values) ? chart.values : [];
    const unit = chart.unit || "";

    if (chart.type === "pie") {
      return {
        title: { text: title, left: "center" },
        tooltip: { trigger: "item" },
        legend: { top: "bottom" },
        series: [
          {
            type: "pie",
            radius: "55%",
            data: labels.map((label, idx) => ({
              name: label,
              value: values[idx] ?? 0
            }))
          }
        ]
      };
    }

    const seriesType = chart.type === "line" ? "line" : "bar";

    return {
      title: { text: title, left: "center" },
      tooltip: { trigger: "axis" },
      grid: { left: 30, right: 20, bottom: 40, top: 60 },
      xAxis: {
        type: "category",
        data: labels
      },
      yAxis: {
        type: "value",
        name: unit
      },
      series: [
        {
          type: seriesType,
          data: values
        }
      ]
    };
  };

  const generateChart = async (index, question, answer) => {
    updateMessageAt(index, (msg) => ({
      ...msg,
      chartLoading: true,
      chartError: null
    }));

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          mode: "chart"
        })
      });

      const text = await res.text();
      let data = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        data = null;
      }

      if (!res.ok || !data) {
        updateMessageAt(index, (msg) => ({
          ...msg,
          chartLoading: false,
          chartError: data?.error || "Gagal menjana carta."
        }));
        return;
      }

      if (data?.chart?.error) {
        updateMessageAt(index, (msg) => ({
          ...msg,
          chartLoading: false,
          chartError: "Tiada data mencukupi untuk carta."
        }));
        return;
      }

      updateMessageAt(index, (msg) => ({
        ...msg,
        chartLoading: false,
        chartError: null,
        chart: data?.chart || null
      }));
    } catch (error) {
      updateMessageAt(index, (msg) => ({
        ...msg,
        chartLoading: false,
        chartError: "Ralat rangkaian. Sila cuba lagi."
      }));
    }
  };

  return (
    <div
      ref={panelRef}
      className="fixed left-0 top-0 h-full w-90 bg-white shadow-xl z-50 flex flex-col"
      style={{ transform: "translateX(-360px)" }}
    >
      {/* Header */}
      <div className="p-4 border-b font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-400 hover:bg-slate-200"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <span className="text-lg">AI Assistant</span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 text-sm"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              m.role === "user"
                ? "bg-slate-900 font-bold self-end"
                : "bg-primary text-black"
            }`}
          >
            {m.role === "assistant" ? (
              <div className="space-y-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      generateChart(i, messages[i - 1]?.content, m.content)
                    }
                    className="text-xs px-3 py-1 rounded bg-white/60 hover:bg-white text-slate-900"
                    disabled={
                      m.chartLoading ||
                      !messages[i - 1] ||
                      messages[i - 1].role !== "user"
                    }
                  >
                    {m.chartLoading ? "Menjana..." : "Jana carta"}
                  </button>
                  {m.chartError ? (
                    <span className="text-xs text-red-600">
                      {m.chartError}
                    </span>
                  ) : null}
                </div>
                {m.chart ? (
                  <div className="bg-white/80 rounded p-2">
                    <ReactECharts
                      option={buildChartOption(m.chart)}
                      style={{ height: 240, width: "100%" }}
                    />
                    {m.chart.note ? (
                      <div className="text-xs text-slate-500 mt-2">
                        {m.chart.note}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : (
              m.content
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={3}
          className="flex-1 border rounded px-3 py-2 text-sm resize-none"
          placeholder="Tanya data atau statistik…"
        />
        {/* <button
          onClick={submit}
          className="bg-primary text-black px-4 rounded"
        >
          Hantar
        </button> */}
      </div>
    </div>
  );
}
