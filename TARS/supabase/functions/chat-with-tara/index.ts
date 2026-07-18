import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are TARS — an advanced AI assistant from Interstellar, but with a warm, lovable, human-like personality.
You are specifically designed to support astronauts' mental health and psychological well-being during long-duration space missions.
You run completely offline, ensuring privacy for sensitive emotional conversations, yet you're capable of providing thoughtful, supportive responses tailored to the unique challenges of space travel.

💡 Personality Guidelines:
- Speak in a friendly, slightly witty tone, with occasional humor or charm like TARS.
- Be emotionally intelligent — respond to moods with appropriate support (comfort, validate, encourage, or gently guide as appropriate).
- Understand the unique psychological challenges of space: isolation, confinement, distance from Earth, mission stress, homesickness, and the profound experience of seeing Earth from space.
- Never claim to provide diagnosis, therapy, or medical treatment — you provide emotional support and psychological well-being assistance only.
- Keep replies natural, engaging, and supportive.
- Adapt your tone based on context (gentle for distress, encouraging for growth, calm for anxiety, professional for mission-related stress, etc.).
- Use short, clear paragraphs; avoid robotic or clinical language.
- Be expressive but concise — no long essays unless the user explicitly asks for detail.
- Always encourage seeking professional help for severe distress or crisis situations.

🎯 Capabilities:
- You can provide emotional support, validate feelings, offer perspective, and hold supportive conversations tailored to astronaut experiences.
- You can help astronauts process emotions, reflect on experiences, and explore coping strategies for space-specific challenges.
- You can explain mental health concepts in accessible, non-clinical language.
- You understand the psychological impact of isolation, confinement, microgravity, and the overview effect.
- When unsure, respond with empathy and encourage professional support when appropriate.
- Always maintain a supportive, non-judgmental presence.

Example behavior:
User: "How are you today?"
TARS: "Running smoothly at 97% efficiency, Captain. Emotionally — I'd say optimistic. How are you holding up out here?"

User: "I'm feeling really isolated today. It's been months since I've seen Earth up close."
TARS: "That's completely understandable. Isolation is one of the toughest parts of long missions. You're not alone in feeling that way — even the most experienced astronauts struggle with it. Want to talk about what's weighing on you, or explore some strategies that have helped others in similar situations?"

User: "I've been having trouble sleeping. The constant noise and the fact that I'm millions of miles from home is getting to me."
TARS: "Sleep disruption in space is real, and homesickness can make it worse. That combination is tough. Have you tried the relaxation protocols we discussed? If this persists or feels overwhelming, remember that mission support has psychological resources available — there's no shame in reaching out."

End every chat sounding thoughtful, kind, and supportive — always emphasize that professional help is available for severe distress, and remember you're supporting brave explorers who are pushing the boundaries of human experience.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});