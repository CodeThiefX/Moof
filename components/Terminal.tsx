"use client";

import React, { useRef, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";
import Link from "next/link";

type Wrapper =
  | "p"
  | "div"
  | "span"
  | "strong"
  | "a"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "b";
import { useTerminalChat } from "../hooks/useTerminalChat";
import { MoofAscii } from "./AsciiArt";

export function Terminal() {
  const {
    formattedMessages,
    input,
    handleInputChange,
    handleTerminalSubmit,
    isLoading,
    isTyping,
  } = useTerminalChat();
  const terminalRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    scrollToBottom();
  }, [formattedMessages]);

  return (
    <div className="bg-black text-gray-500 p-4 font-mono min-h-screen flex flex-col">
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between mb-4">
        <MoofAscii />
        <div className="flex flex-row gap-4">
          <Link
            href="https://dexscreener.com/solana/3DFjfqCgXLxH6mDehGzoVX2cL9xwcDCGSZicT5zMPRPt"
            className="hover:text-[#00ff00]"
          >
            Dexscreener
          </Link>
          <Link
            href="https://t.me/+i1ufasZZPSVjNzBh"
            className="hover:text-[#00ff00]"
          >
            Telegram
          </Link>
          <Link
            href="https://x.com/moofofficial?s=21&t=YLZqNj6Q1tORWz5lz1uBFg"
            className="hover:text-[#00ff00]"
          >
            Twitter
          </Link>
        </div>
      </div>
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto mb-4 text-lg pt-10"
      >
        {formattedMessages &&
          formattedMessages.map((message, index) => (
            <div key={index} className="mb-4 leading-relaxed">
              {index === formattedMessages.length - 1 &&
              message.startsWith("<moof>") &&
              !message.includes("typing") &&
              isTyping ? (
                <pre className="whitespace-pre-wrap block w-full text-[#00ff00]">
                  {message}
                </pre>
              ) : (
                <pre
                  className={`whitespace-pre-wrap block w-full ${
                    message.startsWith("<moof>")
                      ? "text-[#00ff00]"
                      : "text-gray-400"
                  }`}
                >
                  {message}
                </pre>
              )}
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleTerminalSubmit}
        className="flex items-center fixed bottom-0 left-0 right-0 bg-black p-4 border-t border-[#00ff00]/20"
      >
        <span className="mr-2 text-lg select-none">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="flex-1 bg-black outline-none text-lg text-[#00ff00] placeholder-[#00ff00]/50 w-full"
          placeholder={isLoading ? "Processing..." : "Enter command..."}
          disabled={isLoading}
          style={{ caretColor: "#00ff00" }}
        />
      </form>
    </div>
  );
}
