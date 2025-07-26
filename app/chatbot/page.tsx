"use client";

import { useState } from "react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setError(null);
    const userMessage = input;
    setMessages((prev) => [...prev, { user: userMessage, bot: "..." }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      // First check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned invalid response format");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = data.reply;
        return updated;
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      setError(error.message || "Failed to communicate with the chatbot");
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot =
          "Our chatbot service is currently unavailable. Please try again later.";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4">Medical Chatbot</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="h-80 overflow-y-auto mb-4 border rounded-lg p-3 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500">Ask me about medical topics...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-3">
                <p className="text-blue-600 font-semibold">You: {msg.user}</p>
                <p className="text-gray-800 mt-1">
                  {msg.bot === "..." ? (
                    <span className="inline-flex items-center">
                      <span className="animate-pulse">Thinking</span>
                      <span className="ml-1 animate-bounce">...</span>
                    </span>
                  ) : (
                    msg.bot
                  )}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isLoading && handleSendMessage()
            }
            disabled={isLoading}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 min-w-20"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending
              </span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
