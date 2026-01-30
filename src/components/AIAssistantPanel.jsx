import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function AIAssistantPanel({ open, onClose }) {
  const panelRef = useRef(null);
  const messagesRef = useRef(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

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
        { role: "assistant", content: answer }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ralat rangkaian. Sila cuba lagi."
        }
      ]);
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
            {m.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          className="flex-1 border rounded px-3 py-2 text-sm"
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
