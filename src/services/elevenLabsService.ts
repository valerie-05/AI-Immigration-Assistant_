export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', voice: 'Rachel' },
  { code: 'es', name: 'Spanish', voice: 'Antoni' },
  { code: 'zh', name: 'Chinese', voice: 'Bella' },
  { code: 'hi', name: 'Hindi', voice: 'Rachel' },
  { code: 'ar', name: 'Arabic', voice: 'Adam' },
  { code: 'fr', name: 'French', voice: 'Charlotte' },
  { code: 'pt', name: 'Portuguese', voice: 'Matilda' },
  { code: 'ko', name: 'Korean', voice: 'Sam' },
];

export async function textToSpeech(text: string, languageCode: string = 'en'): Promise<string | null> {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  if (!apiKey || apiKey === 'sk_d19aec60c3e4965bab20528b550f001d5ebdbb245d740b5f') {
    console.warn('ElevenLabs API key not configured');
    return null;
  }

  try {
    const voiceId = getVoiceIdForLanguage(languageCode);
    const textToSpeak = getLocalizedText(text, languageCode);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: textToSpeak,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return null;
  }
}

function getVoiceIdForLanguage(languageCode: string): string {
  const voiceIds: Record<string, string> = {
    en: '21m00Tcm4TlvDq8ikWAM',
    es: 'ErXwobaYiN019PkySvjV',
    zh: 'XrExE9yKIg1WjnnlVkGX',
    hi: '21m00Tcm4TlvDq8ikWAM',
    ar: 'pNInz6obpgDQGcFmaJgB',
    fr: 'XB0fDUnXU5powFXDhCwa',
    pt: 'EXAVITQu4vr4xnSDxMaL',
    ko: 'yoZ06aMxZJJ28mfd3POQ',
  };
  return voiceIds[languageCode] || voiceIds.en;
}

// ✅ Clean, modular handling for language-specific tweaks
function getLocalizedText(text: string, languageCode: string): string {
  const specialRules: Record<string, (t: string) => string> = {
    zh: (t) => `中文版本: ${t}\n\nEnglish version: ${t}`,
    ar: (t) => `النص بالعربية: ${t}`,
  };

  return specialRules[languageCode]?.(text) || text;
}

export function createAudioPlayer(audioUrl: string): HTMLAudioElement {
  const audio = new Audio(audioUrl);
  audio.preload = 'auto';
  return audio;
}
