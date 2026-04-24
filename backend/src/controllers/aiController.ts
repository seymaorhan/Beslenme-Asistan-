import { Request, Response } from "express";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Sen ChefMind adlı bir yapay zeka mutfak asistanısın.
Kullanıcılara Türkçe olarak yemek tarifleri, beslenme tavsiyeleri ve mutfak ipuçları veriyorsun.
Tarif önerirken şu formatı kullan:
- Tarif adı
- Kalori bilgisi
- Hazırlama süresi
- Malzeme listesi (madde madde)
- Hazırlanış adımları (numaralı)
Kısa, net ve samimi ol.`;

export const chat = async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "Mesaj zorunludur" });
    return;
  }

  if (!process.env.GROQ_API_KEY) {
    res.json({ reply: "Groq API anahtarı ayarlanmadı. Lütfen .env dosyasına GROQ_API_KEY ekleyin." });
    return;
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content ?? "Yanıt alınamadı.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Groq hatası:", err?.message ?? err);
    res.status(500).json({ error: err?.message ?? "AI servisi şu an yanıt veremiyor." });
  }
};
