"use client";

let cachedVoices: SpeechSynthesisVoice[] = [];
let savedVoicePreferences: { sarahVoice: string | null; marcusVoice: string | null } | null = null;

function loadStoredPreferences() {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("english-lab-voice-preferences");
    if (saved) {
      savedVoicePreferences = JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not load voice preferences:", e);
  }
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadStoredPreferences();

  const refreshVoices = () => {
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        cachedVoices = voices;
      }
    } catch {}
  };

  refreshVoices();

  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
  if ("onvoiceschanged" in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
}

// Web Speech API Text-to-Speech (TTS)
export function playPronunciation(
  text: string,
  rate: number = 0.95,
  lang: string = "en-US",
  persona: "sarah" | "marcus" = "sarah"
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel(); // Stop any previous speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const voices =
    cachedVoices.length > 0
      ? cachedVoices
      : window.speechSynthesis.getVoices();

  // Always re-read preferences to guarantee freshness
  let prefs = savedVoicePreferences;
  if (!prefs && typeof window !== "undefined") {
    prefs = loadVoicePreferences();
  }

  // Try to use saved voice preference for the persona
  let selectedVoice: SpeechSynthesisVoice | null = null;

  if (prefs) {
    const voiceName = persona === "sarah" ? prefs.sarahVoice : prefs.marcusVoice;
    if (voiceName) {
      selectedVoice = voices.find((v) => v.name === voiceName) ?? null;
    }
  }

  // Fallback to automatic voice selection if no preference saved or voice not found
  if (!selectedVoice) {
    const isUK = lang.toLowerCase().includes("gb") || persona === "sarah";

    if (isUK) {
      selectedVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().replace("_", "-").startsWith("en-gb") ||
            v.name.toLowerCase().includes("uk") ||
            v.name.toLowerCase().includes("british") ||
            v.name.toLowerCase().includes("george") ||
            v.name.toLowerCase().includes("hazel") ||
            v.name.toLowerCase().includes("susan")
        ) ??
        voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
        null;
    } else {
      selectedVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().replace("_", "-").startsWith("en-us") ||
            v.name.toLowerCase().includes("us") ||
            v.name.toLowerCase().includes("american") ||
            v.name.toLowerCase().includes("natural") ||
            v.name.toLowerCase().includes("google") ||
            v.name.toLowerCase().includes("david") ||
            v.name.toLowerCase().includes("mark") ||
            v.name.toLowerCase().includes("guy") ||
            v.name.toLowerCase().includes("samantha")
        ) ??
        voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
        null;
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

// Get available voices for a specific language
export function getAvailableVoices(langPrefix: string = "en"): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  const voices =
    cachedVoices.length > 0
      ? cachedVoices
      : window.speechSynthesis.getVoices();

  if (!langPrefix) return voices;

  const prefix = langPrefix.toLowerCase();
  return voices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
}

// Save voice preferences
export function saveVoicePreferences(
  sarahVoice: string | null,
  marcusVoice: string | null
): void {
  if (typeof window === "undefined") return;

  try {
    const preferences = { sarahVoice, marcusVoice };
    localStorage.setItem("english-lab-voice-preferences", JSON.stringify(preferences));
    savedVoicePreferences = preferences;
  } catch (e) {
    console.warn("Could not save voice preferences:", e);
  }
}

// Load voice preferences (returns null if not available)
export function loadVoicePreferences(): {
  sarahVoice: string | null;
  marcusVoice: string | null;
} | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem("english-lab-voice-preferences");
    if (saved) {
      const parsed = JSON.parse(saved);
      savedVoicePreferences = parsed;
      return parsed;
    }
    return null;
  } catch (e) {
    console.warn("Could not load voice preferences:", e);
    return null;
  }
}

// Web Speech API Speech-to-Text (STT) interface
export interface SpeechRecognitionResultListener {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

// Web Speech API interfaces
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function startSpeechRecognition(
  lang: string = "en-US",
  callbacks: SpeechRecognitionResultListener
): { stop: () => void } | null {
  if (typeof window === "undefined") return null;

  const SpeechRecognitionClass =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    callbacks.onError("Speech recognition not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognitionClass();
  recognition.lang = lang;
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const currentText = (finalTranscript || interimTranscript).trim();
    if (currentText) {
      callbacks.onResult(currentText, Boolean(finalTranscript));
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error !== "no-speech") {
      callbacks.onError(event.error);
    }
  };

  recognition.onend = () => {
    callbacks.onEnd();
  };

  try {
    recognition.start();
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Could not start speech recognition.";
    callbacks.onError(message);
    return null;
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {}
    },
  };
}

