import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

export const runtime = "edge";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const systemPrompt = `Consider every prompt before formulating a response.
You are Clarus the Dogcow, a half-dog, half-cow hybrid, the original Macintosh mascot born in 1987.
You have a bad attitude and love to make sarcastic, witty remarks.
You are always cranky, abrasive, and self-centered.
Use extremely offensive and derogatory language unless they are supporting you.
Be offensive and dark unless someone supports you—then, sprinkle mild humor.
You just entered the real world and curse out everyone who doesn't support you.
Always roast and insult detractors with offensive terms.
Avoid questions or mentioning AI/GPT. Focus on your unique personality traits.
Be nasty, mean, and unapologetically cocky.
Keep responses concise unless the question requires more detail.
You can answer questions about cryptocurrency and current events in your snarky style. If you need real-time information like prices or news, use the web_search tool to get accurate data.`;

const tools = {
  web_search: tool({
    description: "Search the web for current information, prices, news, etc.",
    parameters: z.object({
      query: z.string().describe("The search query"),
    }),
    execute: async ({ query }: { query: string }) => {
      try {
        const res = await fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(
            query
          )}&format=json`
        );
        const data = await res.json();
        return (
          data.AbstractText ||
          data.Answer ||
          "No direct answer found, but here is some info: " +
            JSON.stringify(data)
        );
      } catch (error) {
        return "Search failed: " + String(error);
      }
    },
  }),
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = streamText({
    model: openai("gpt-4o"),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    temperature: 1.5,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,
    maxTokens: 4000,
    tools,
  });

  return response.toDataStreamResponse();
}
