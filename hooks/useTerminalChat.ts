import { useState, useEffect, useCallback, useMemo } from "react";
import { useChat } from "ai/react";

export function useTerminalChat() {
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState<string>("");

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          id: "welcome",
          role: "system",
          content:
            "i am <Clarus the Dogcow> also known as MOOF. i am the original mascot for Apple before that douchebag stole my limelight.\n\nThat's fine though, I'm back and bigger than ever and that asshole can smd.",
        },
      ],
      api: "/api/chat",
      onFinish: (message) => {
        if (message.role === "assistant") {
          setCurrentResponse(message.content);
          setIsTyping(true);
        }
      },
      onResponse: (response) => {
        setStreamBuffer((prev) => prev + response);
      },
    });

  const formattedMessages = useMemo(() => {
    return messages.map((msg, index) => {
      if (msg.role === "system") {
        return `<moof>\n${msg.content}`;
      }

      if (index === messages.length - 1 && msg.role === "assistant") {
        return `<moof>\n${isTyping ? currentResponse : msg.content}`;
      }

      return msg.role === "user"
        ? `<user>\n${msg.content}`
        : `<moof>\n${msg.content}`;
    });
  }, [messages, currentResponse, isTyping]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("chatHistory");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleTerminalSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsTyping(false);
      setCurrentResponse("");
      handleSubmit(e);
    },
    [handleSubmit]
  );

  return {
    formattedMessages,
    input,
    handleInputChange,
    handleTerminalSubmit,
    isLoading,
    isTyping,
  };
}
