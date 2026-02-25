import { useState, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import {
  ChevronLeftIcon,
  ChartBarIcon,
  ChartPieIcon,
  MagnifyingGlassPlusIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ReactECharts from "echarts-for-react";
import { useDashboardStore } from "../store/dashboardStore";
import states from "../maps/states.json";
import statesPerjawatanInfo from "../data/penguatkuasaan/statesPerjawatanInfo.json";
import userProfiles from "../data/user-profiles.json";
import laporanData from "../data/penguatkuasaan/laporan.json";
import UserKPIDashboard from "./UserKPIDashboard";

const normalizeText = (value) =>
  (value || "")
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeCompact = (value) => normalizeText(value).replace(/\s/g, "");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildNamePattern = (name) => {
  const tokens = normalizeText(name).split(" ").filter(Boolean);
  if (tokens.length === 0) return null;
  const joined = tokens.map(escapeRegex).join("[^A-Z0-9]+?");
  return new RegExp(`(^|[^A-Z0-9])(${joined})(?=$|[^A-Z0-9])`, "gi");
};

const buildLocationPattern = (location) => {
  const tokens = normalizeText(location).split(" ").filter(Boolean);
  if (tokens.length < 2) return null;
  const joined = tokens.map(escapeRegex).join("[^A-Z0-9]+?");
  return new RegExp(`(^|[^A-Z0-9])(${joined})(?=$|[^A-Z0-9])`, "gi");
};

const linkifyUserNames = (content, users) => {
  if (!content || !users?.length) return content;
  const sortedUsers = [...users].sort(
    (a, b) => b.name.length - a.name.length
  );

  return sortedUsers.reduce((output, user) => {
    if (!user?.name) return output;
    const regex = buildNamePattern(user.name);
    if (!regex) return output;
    return output.replace(regex, (full, lead, match) => {
      const encoded = encodeURIComponent(user.name);
      return `${lead}[${match}](user:${encoded})`;
    });
  }, content);
};

const linkifyLaporan = (content, laporan) => {
  if (!content || !laporan?.length) return content;
  const sorted = [...laporan].sort((a, b) => {
    const aLen = (a?.LOKASI || "").length;
    const bLen = (b?.LOKASI || "").length;
    return bLen - aLen;
  });

  let output = content;

  sorted.forEach((record) => {
    if (!record) return;
    if (record.ID !== undefined && record.ID !== null) {
      const idPattern = new RegExp(`\\bID\\s*[:#]?\\s*${record.ID}\\b`, "gi");
      output = output.replace(idPattern, (match) => {
        return `[${match}](laporan:${record.ID})`;
      });
    }

    if (record.LOKASI) {
      const locationPattern = buildLocationPattern(record.LOKASI);
      if (!locationPattern) return;
      output = output.replace(locationPattern, (full, lead, match) => {
        return `${lead}[${match}](laporan:${record.ID})`;
      });
    }
  });

  return output;
};

const getUserFromHref = (href) => {
  if (!href) return null;
  const trimmed = href.trim().replace(/^([/#]+)/, "");
  const decoded = decodeURIComponent(trimmed);
  if (decoded.toLowerCase().startsWith("user:")) {
    return decoded.slice(5).trim();
  }
  return null;
};

const getLaporanIdFromHref = (href) => {
  if (!href) return null;
  const trimmed = href.trim().replace(/^([/#]+)/, "");
  const decoded = decodeURIComponent(trimmed);
  if (decoded.toLowerCase().startsWith("laporan:")) {
    const idValue = decoded.slice(8).trim();
    const id = Number(idValue);
    return Number.isNaN(id) ? null : id;
  }
  return null;
};

const negeriAliasMap = {
  "N. SEMBILAN": ["NEGERI SEMBILAN", "N SEMBILAN"],
  "KUALA LUMPUR": ["WILAYAH PERSEKUTUAN KUALA LUMPUR", "WP KUALA LUMPUR"],
  "HQ PUTRAJAYA": ["PUTRAJAYA", "WILAYAH PERSEKUTUAN PUTRAJAYA", "WP PUTRAJAYA"]
};

const negeriCandidates = states.flatMap((state) => {
  const aliases = negeriAliasMap[state.name] || [];
  return [state.name, ...aliases].map((alias) => ({
    label: state.name,
    alias,
    score: normalizeText(alias).length
  }));
});

const perjawatanStateOptions = [
  ...new Set(statesPerjawatanInfo.map((item) => item.state))
];

const jenisCandidates = ["AMCP 1984", "APTQ 1986", "APF 2002", "AAP 1971"].flatMap(
  (jenis) => [
    { label: jenis, alias: jenis },
    { label: jenis, alias: jenis.replace(/\s+/g, "") }
  ]
);

const extractNegeriFromAnswer = (answer) => {
  const normalized = normalizeText(answer);
  const sorted = [...negeriCandidates].sort((a, b) => b.score - a.score);
  const match = sorted.find((item) =>
    normalized.includes(normalizeText(item.alias))
  );
  return match?.label || null;
};

const extractJenisFromAnswer = (answer) => {
  const normalized = normalizeText(answer);
  const compact = normalizeCompact(answer);
  const match = jenisCandidates.find((item) =>
    normalized.includes(normalizeText(item.alias)) ||
    compact.includes(normalizeCompact(item.alias))
  );
  return match?.label || null;
};

const resolvePerjawatanState = (value) => {
  if (!value) return null;
  const normalized = normalizeText(value);
  const match = perjawatanStateOptions.find(
    (state) => normalizeText(state) === normalized
  );
  if (match) return match;

  const containsMatch = perjawatanStateOptions.find((state) =>
    normalized.includes(normalizeText(state))
  );
  return containsMatch || null;
};

export default function AIAssistantPanel({ open, onClose }) {
  const panelRef = useRef(null);
  const messagesRef = useRef(null);
  const [input, setInput] = useState("");
  const [modalChart, setModalChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const setChartFilter = useDashboardStore((s) => s.setChartFilter);
  const openLaporanDetail = useDashboardStore((s) => s.openLaporanDetail);
  const setMapViewOpen = useDashboardStore((s) => s.setMapViewOpen);
  const setShowPenjawatanMarkers = useDashboardStore(
    (s) => s.setShowPenjawatanMarkers
  );
  const setPenjawatanStateFilter = useDashboardStore(
    (s) => s.setPenjawatanStateFilter
  );
  const setPenjawatanFocusState = useDashboardStore(
    (s) => s.setPenjawatanFocusState
  );
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

  const users = useMemo(() => userProfiles?.users || [], []);
  const laporan = useMemo(() => (Array.isArray(laporanData) ? laporanData : []), []);

  const handleUserLink = (userName) => {
    const matchedUser = users.find(
      (user) => normalizeText(user.name) === normalizeText(userName)
    );
    if (matchedUser) {
      setSelectedUser(matchedUser);
    }
  };

  const handleLaporanLink = (laporanId) => {
    const matched = laporan.find((record) => Number(record.ID) === Number(laporanId));
    if (matched) {
      openLaporanDetail(matched);
    }
  };

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

    const normalizedInput = normalizeText(input);
    const wantsPenjawatan = normalizedInput.includes("PENJAWATAN");

    if (wantsPenjawatan) {
      const detectedNegeri = extractNegeriFromAnswer(input);
      const resolvedPenjawatanState =
        resolvePerjawatanState(detectedNegeri) ||
        resolvePerjawatanState(input);

      setMapViewOpen(true);
      setShowPenjawatanMarkers(true);
      setPenjawatanStateFilter(resolvedPenjawatanState || "");
      setPenjawatanFocusState(detectedNegeri || resolvedPenjawatanState || null);
    }

    setIsLoading(true);

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

      const detectedNegeri = extractNegeriFromAnswer(answer);
      const detectedJenis = extractJenisFromAnswer(answer);

      if (detectedNegeri || detectedJenis) {
        setChartFilter({
          negeri: detectedNegeri,
          jenis: detectedJenis
        });
      }

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
    } finally {
      setIsLoading(false);
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

  const generateChart = async (index, question, answer, preferredType) => {
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
          mode: "chart",
          preferredType
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  urlTransform={(url) => url}
                  components={{
                    a: ({ href, children }) => {
                      const userName = getUserFromHref(href);
                      if (userName) {
                        return (
                          <a
                            href={href}
                            onClick={(event) => {
                              event.preventDefault();
                              handleUserLink(userName);
                            }}
                            className="text-blue-700 underline hover:text-blue-900"
                          >
                            <span>{children}</span>
                          </a>
                        );
                      }

                      const laporanId = getLaporanIdFromHref(href);
                      if (laporanId !== null) {
                        return (
                          <a
                            href={href}
                            onClick={(event) => {
                              event.preventDefault();
                              handleLaporanLink(laporanId);
                            }}
                            className="text-blue-700 underline hover:text-blue-900"
                          >
                            <span>{children}</span>
                          </a>
                        );
                      }

                      return (
                        <a
                          href={href}
                          className="text-blue-700 underline hover:text-blue-900"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {children}
                        </a>
                      );
                    }
                  }}
                >
                  {linkifyUserNames(linkifyLaporan(m.content, laporan), users)}
                </ReactMarkdown>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    aria-label="Jana carta bar"
                    title="Jana carta bar"
                    onClick={() =>
                      generateChart(
                        i,
                        messages[i - 1]?.content,
                        m.content,
                        "bar"
                      )
                    }
                    className="p-2 rounded bg-white/60 hover:bg-white text-slate-400 disabled:opacity-50"
                    disabled={
                      m.chartLoading ||
                      !messages[i - 1] ||
                      messages[i - 1].role !== "user"
                    }
                  >
                    <ChartBarIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Jana carta pai"
                    title="Jana carta pai"
                    onClick={() =>
                      generateChart(
                        i,
                        messages[i - 1]?.content,
                        m.content,
                        "pie"
                      )
                    }
                    className="p-2 rounded bg-white/60 hover:bg-white text-slate-400 disabled:opacity-50"
                    disabled={
                      m.chartLoading ||
                      !messages[i - 1] ||
                      messages[i - 1].role !== "user"
                    }
                  >
                    <ChartPieIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Jana carta garis"
                    title="Jana carta garis"
                    onClick={() =>
                      generateChart(
                        i,
                        messages[i - 1]?.content,
                        m.content,
                        "line"
                      )
                    }
                    className="p-2 rounded bg-white/60 hover:bg-white text-slate-400 disabled:opacity-50"
                    disabled={
                      m.chartLoading ||
                      !messages[i - 1] ||
                      messages[i - 1].role !== "user"
                    }
                  >
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Besarkan carta"
                    title="Besarkan carta"
                    onClick={() => setModalChart(m.chart)}
                    className="p-2 rounded bg-white/60 hover:bg-white text-slate-400 disabled:opacity-50"
                    disabled={!m.chart}
                  >
                    <MagnifyingGlassPlusIcon className="w-4 h-4" />
                  </button>
                  {m.chartError ? (
                    <span className="text-xs text-red-600">
                      {m.chartError}
                    </span>
                  ) : null}
                  {m.chartLoading ? (
                    <span className="inline-flex items-center gap-2 text-xs text-slate-600">
                      <span className="inline-flex h-3 w-3 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
                      Menjana carta…
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

        {isLoading ? (
          <div className="p-3 rounded bg-primary text-black">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-3 w-3 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
              <span className="text-xs text-slate-300">
                Menjana jawapan…
              </span>
            </div>
          </div>
        ) : null}
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
          disabled={isLoading}
        />
        {/* <button
          onClick={submit}
          className="bg-primary text-black px-4 rounded"
        >
          Hantar
        </button> */}
      </div>

      {modalChart ? (
        <div className="fixed top-4 left-92.5 z-50">
          <div className="bg-white rounded-lg shadow-xl w-[70vw] max-w-3xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-semibold">
                {modalChart.title || "Carta Analitik"}
              </span>
              <button
                type="button"
                onClick={() => setModalChart(null)}
                className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                Tutup
              </button>
            </div>
            <div className="p-4">
              <ReactECharts
                option={buildChartOption(modalChart)}
                style={{ height: 420, width: "100%" }}
              />
              {modalChart.note ? (
                <div className="text-xs text-slate-500 mt-2">
                  {modalChart.note}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <UserKPIDashboard
        user={selectedUser}
        laporan={laporanData}
        onClose={() => setSelectedUser(null)}
        positionClass="top-4 left-92.5"
      />
    </div>
  );
}
