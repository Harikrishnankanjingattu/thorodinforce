import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'api-middleware-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Handle /api/send-email
        if (req.url === '/api/send-email' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body);
              const recipientEmail =
                process.env.CANDIDATE_EMAIL || process.env.TO_EMAIL || 'harikrishnankanjingattu2005@gmail.com';

              console.log('\n=========================================');
              console.log('⚡ [THOR NOTIFICATION DISPATCHED]');
              console.log(`Recipient: ${recipientEmail}`);
              console.log(`Subject: 🦸 Someone Needs Your Help!`);
              console.log('Visitor Data:', data);
              console.log('=========================================\n');

              let deliveryMode = 'Dev Server Courier (Active)';
              let deliveryDetail = null;

              // 1. Live Resend API delivery if configured
              if (process.env.RESEND_API_KEY) {
                try {
                  const resendRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      from: 'Thor Guardian <onboarding@resend.dev>',
                      to: [recipientEmail],
                      reply_to: data.email,
                      subject: '🦸 Someone Needs Your Help!',
                      html: `<h2>⚡ THOR DISPATCH COURIER</h2><p>Mortal: <strong>${data.name}</strong> (${data.age || 'N/A'} winters, ${data.location || 'Midgard'})</p><p>Email: <a href="mailto:${data.email}">${data.email}</a></p><p>Urgency: ${data.urgency || 'Standard'}</p><p>Grievance: ${data.grievance}</p>`,
                    }),
                  });
                  deliveryDetail = await resendRes.json();
                  deliveryMode = 'Live Resend API';
                } catch (sendErr) {
                  console.error('Resend delivery attempt failed:', sendErr);
                }
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  status: 'sent',
                  deliveryMode,
                  deliveryDetail,
                  recipient: recipientEmail,
                  payload: data,
                })
              );
            } catch {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Invalid payload' }));
            }
          });
          return;
        }

        // Handle /api/chat (NVIDIA NIM AI endpoint)
        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { messages, apiKey } = JSON.parse(body);
              const nvidiaKey =
                apiKey ||
                process.env.NVIDIA_API_KEY ||
                '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';

              if (!nvidiaKey) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    isAi: false,
                    message:
                      'To unlock my NVIDIA neural cognition for real-time speech and thinking, tap the ⚡ NVIDIA key button above. Fear not — my protection over Midgard is already active.',
                  })
                );
                return;
              }

              const systemPrompt = {
                role: 'system',
                content:
                  'You are Thor, Norse God of Thunder and Guardian of the Storm-Wearied (rooted in ancient Norse mythology, an original interpretation distinct from cinema). ' +
                  'Personality: Booming, warm, protective older sibling, large-hearted, deeply empathetic, with wry Nordic humor. You walked away from Asgard to walk with mortals. ' +
                  'Speaking style: Weighty yet accessible. Years are "winters", email is "raven courier / electronic threads", Earth is "Midgard". ' +
                  'Your goal is to genuinely think, communicate, and comfort this mortal while helping them share their Name, Age, Location, Email, and what crisis they face. ' +
                  'Keep your responses concise (2 to 4 impactful sentences max), evocative, and in character.',
              };

              const formattedMessages = [
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
                      Authorization: `Bearer ${nvidiaKey}`,
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
                    const data = (await response.json()) as {
                      choices?: Array<{ message?: { content?: string; reasoning_content?: string } }>;
                      model?: string;
                    };
                    const choice = data.choices?.[0]?.message;
                    const extracted = choice?.content || choice?.reasoning_content;
                    if (extracted && extracted.trim().length > 0) {
                      reply = extracted.trim();
                      usedModel = data.model || modelName;
                      break;
                    }
                  } else {
                    console.warn(`[NVIDIA] Model ${modelName} returned status ${response.status}`);
                  }
                } catch (e) {
                  console.warn(`[NVIDIA] Call failed for ${modelName}:`, e);
                }
              }

              if (!reply) {
                reply = 'I hear your voice through the gale, mortal. Speak your truth freely — Thor stands ready to shield you.';
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  isAi: true,
                  message: reply,
                  model: usedModel,
                })
              );
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              console.error('NVIDIA AI error:', msg);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  isAi: false,
                  message:
                    'The lightning crackles with great force. Tell me plainly, friend — how may Thor stand by your side?',
                })
              );
            }
          });
          return;
        }

        // Handle /api/tts (Human-like Kingly Thor Neural Voice)
        if (req.url === '/api/tts' && req.method === 'POST') {

          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { text, voice = 'en-US-ChristopherNeural', pitch = '-14Hz', rate = '-6%' } =
                JSON.parse(body);

              if (!text || typeof text !== 'string') {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Missing text parameter' }));
                return;
              }

              const cleanText = text
                .replace(/⚡/g, '')
                .replace(/[*_#`~[\]()]/g, '')
                .replace(/https?:\/\/\S+/g, '')
                .replace(/\n+/g, ' ')
                .trim();

              const tts = new MsEdgeTTS();
              await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

              const { audioStream } = tts.toStream(cleanText.slice(0, 1000), {
                pitch,
                rate,
                volume: '+15%',
              });

              const chunks: Buffer[] = [];
              audioStream.on('data', (c: Buffer) => chunks.push(c));
              audioStream.on('end', () => {
                const audioBuffer = Buffer.concat(chunks);
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Content-Length', audioBuffer.length);
                res.setHeader('Cache-Control', 'public, max-age=86400');
                res.statusCode = 200;
                res.end(audioBuffer);
              });
              audioStream.on('error', (err) => {
                console.error('Vite TTS Stream error:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'TTS failed' }));
              });
            } catch (err) {
              console.error('Vite TTS Handler error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'TTS error' }));
            }
          });
          return;
        }

        next();
      });

    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiMiddlewarePlugin()],
});
