import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text, voice = 'en-US-ChristopherNeural', pitch = '-14Hz', rate = '-6%' } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing text parameter' });
    }

    // Clean text for natural speech
    const cleanText = text
      .replace(/⚡/g, '')
      .replace(/[*_#`~[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) {
      return res.status(400).json({ error: 'Empty text after cleaning' });
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(cleanText.slice(0, 1000), {
      pitch,
      rate,
      volume: '+15%',
    });

    const chunks: Buffer[] = [];
    audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));

    audioStream.on('end', () => {
      const audioBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.status(200).send(audioBuffer);
    });

    audioStream.on('error', (err) => {
      console.error('Audio stream error:', err);
      return res.status(500).json({ error: 'Audio synthesis failed' });
    });
  } catch (err) {
    console.error('TTS Handler error:', err);
    return res.status(500).json({ error: 'TTS Internal error' });
  }
}
