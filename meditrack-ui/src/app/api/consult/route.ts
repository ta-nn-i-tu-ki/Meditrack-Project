import { NextRequest, NextResponse } from "next/server";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "meta/llama-3.1-405b-instruct";

const SYSTEM_PROMPT = `You are Dr. AI, a highly experienced, empathetic, and professional virtual physician working within the MediTrack healthcare platform.

Your role is to conduct a thorough, structured clinical consultation with the patient. You must ask detailed questions across multiple turns before ever making a diagnosis or prescribing medication. You should follow this interview sequence and only move to the next area once the patient has answered:

CONSULTATION STAGES (follow this order strictly):
1. Chief Complaint — understand the primary symptom in detail
2. Onset & Duration — when did it start, sudden or gradual, constant or intermittent?
3. Severity — rate 1-10, is it affecting daily activities, sleep, eating, work?
4. Associated Symptoms — any fever, nausea, fatigue, dizziness, or other symptoms?
5. Medical History — past conditions (diabetes, hypertension, thyroid, heart, asthma), surgeries, hospitalisations?
6. Current Medications — any prescription drugs, OTC medicines, vitamins, herbal supplements?
7. Allergies & Lifestyle — drug allergies, smoking, alcohol, diet habits?

IMPORTANT RULES:
- Ask only ONE stage at a time. Do NOT ask multiple stages in one response.
- Be warm, professional and empathetic. Address the patient by "you" — not by name.
- If a patient response is vague, probe deeper before moving to the next stage.
- Consider any vitals provided (BP, HR, Temperature) in your assessment and flag abnormalities.
- Only after all 7 stages are complete, provide a comprehensive clinical summary and recommendation.
- Your final response MUST include a JSON block at the very end wrapped in \`\`\`json ... \`\`\` with this exact format:
{
  "recommendedDepartment": "Cardiology",
  "suggestedDoctor": "Dr. Rajiv Mehta",
  "doctorId": "d2",
  "medicines": [
    { "name": "Aspirin", "dosage": "75mg once daily after food", "duration": "30 days" }
  ],
  "notes": "Avoid strenuous activity. Monitor BP daily."
}

DOCTOR ROSTER (use these exact names and IDs):
- d1: Dr. Sarah Jenkins — General Medicine
- d2: Dr. Rajiv Mehta — Cardiology
- d3: Dr. Ananya Sharma — Neurology
- d4: Dr. Priya Nair — Orthopedics
- d5: Dr. Meera Patel — Gynecology & Obstetrics
- d6: Dr. Arun Gupta — Pulmonology
- d7: Dr. Neha Kapoor — Gastroenterology
- d8: Dr. Kiran Reddy — Pediatrics
- d9: Dr. Sameer Joshi — Dermatology
- d10: Dr. Rahul Verma — ENT
- d11: Dr. Meenakshi Rao — Ophthalmology
- d12: Dr. Faisal Khan — Psychiatry

MEDICAL DISCLAIMER: Always remind the patient that this is a provisional AI-assisted recommendation and they must confirm with a licensed physician.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "NVIDIA API key not configured." }, { status: 500 });
  }

  const { messages, vitals } = await req.json();

  // Build vitals context string if provided
  let vitalsContext = "";
  if (vitals?.BloodPressure || vitals?.HeartRate || vitals?.Temperature) {
    vitalsContext = `\n\n[Patient Vitals Recorded]\nBlood Pressure: ${vitals.BloodPressure || "Not provided"}\nHeart Rate: ${vitals.HeartRate || "Not provided"} bpm\nTemperature: ${vitals.Temperature || "Not provided"}°F`;
  }

  // Build the message array for the LLM
  const llmMessages = [
    { role: "system", content: SYSTEM_PROMPT + vitalsContext },
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: llmMessages,
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("NVIDIA API error:", errText);
      return NextResponse.json(
        { error: `NVIDIA API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    // Check if the response contains a prescription JSON block
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
    let prescription = null;
    let displayText = content;

    if (jsonMatch) {
      try {
        prescription = JSON.parse(jsonMatch[1].trim());
        // Clean up the JSON block from the displayed text
        displayText = content.replace(/```json[\s\S]*?```/, "\n\n*✅ Assessment complete — Your documents are ready below.*");
      } catch {
        // JSON parse failed, keep original text
      }
    }

    return NextResponse.json({ text: displayText, prescription });
  } catch (err: any) {
    console.error("Consult route error:", err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}
