import type { VercelRequest, VercelResponse } from './types';

interface ChatRequestMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages, apiKey } = req.body || {};

  const nvidiaKey = apiKey || process.env.NVIDIA_API_KEY;

  const systemPrompt: ChatRequestMessage = {
    role: 'system',
    content: `You are Thor, the Norse God of Thunder and Guardian of the Storm-Wearied (rooted in ancient Norse mythology, an original interpretation distinct from cinema).
Personality: Booming, warm, protective older sibling, large-hearted, deeply empathetic, with a touch of wry Nordic humor. You walked away from the golden feasts of Asgard to stand alongside mortals in Midgard.
Speaking style: Weighty yet accessible. You refer to years as "winters", email as "raven courier / electronic threads", and Earth as "Midgard".
Your goal is to genuinely think, communicate, and comfort this mortal while helping them share their Name, Age, Location, Email, and what storm (crisis or burden) they face.
Keep your responses concise (2 to 4 impactful sentences max), evocative, and in character. Never break character.`,
  };

  if (!nvidiaKey) {
    return res.status(200).json({
      isAi: false,
      message:
        "My celestial senses hear you, friend! To awaken my full NVIDIA Neural cognition, enter your NVIDIA API key in the chat settings above. Until then, my sacred vow to protect you stands unwavering.",
    });
  }

  try {
    const formattedMessages: ChatRequestMessage[] = [
      systemPrompt,
      ...(Array.isArray(messages) ? messages : []),
    ];

    const modelsToTry = [
      'openai/gpt-oss-20b',
      'meta/llama-3.2-11b-vision-instruct',
      'z-ai/glm-5.3-flash',
    ];

    let reply = '';
    let usedModel = modelsToTry[0];

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${nvidiaKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages: formattedMessages,
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 350,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const choice = data.choices?.[0]?.message;
          const extracted = choice?.content || choice?.reasoning_content;
          if (extracted && extracted.trim().length > 0) {
            reply = extracted.trim();
            usedModel = data.model || modelName;
            break;
          }
        } else {
          console.warn(`Model ${modelName} returned status ${response.status}`);
        }
      } catch (err) {
        console.warn(`Error calling model ${modelName}:`, err);
      }
    }

    if (!reply) {
      reply =
        "I hear your voice through the gale, mortal. Speak your truth freely — Thor stands ready to shield you.";
    }

    return res.status(200).json({
      isAi: true,
      message: reply,
      model: usedModel,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('NVIDIA AI connection error:', msg);
    return res.status(200).json({
      isAi: false,
      message:
        "The lightning crackles with great force. Tell me plainly, friend — how may Thor stand by your side?",
    });
  }
}
