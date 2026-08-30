"use client";

let cachedVoices: SpeechSynthesisVoice[] = [];
let savedVoicePreferences: { sarahVoice: string | null; marcusVoice: string | null } | null = null;

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };

  // Load saved voice preferences from localStorage
  try {
    const saved = localStorage.getItem("english-lab-voice-preferences");
    if (saved) {
      savedVoicePreferences = JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not load voice preferences:", e);
  }
}

// Web Speech API Text-to-Speech (TTS)
export function playPronunciation(text: string, rate: number = 0.95, lang: string = "en-US", persona: "sarah" | "marcus" = "sarah") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel(); // Stop any previous speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();

  // Try to use saved voice preference for the persona
  let selectedVoice: SpeechSynthesisVoice | null = null;

  if (savedVoicePreferences) {
    const voiceName = persona === "sarah" ? savedVoicePreferences.sarahVoice : savedVoicePreferences.marcusVoice;
    if (voiceName) {
      selectedVoice = voices.find(v => v.name === voiceName) ?? null;
    }
  }

  // Fallback to automatic voice selection if no preference saved or voice not found
  if (!selectedVoice) {
    selectedVoice = (voices.find(
      (v) => (v.lang.startsWith(lang.substring(0, 2)) && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Alex") || v.name.includes("UK") || v.name.includes("US")))
    ) ?? voices.find((v) => v.lang.startsWith("en"))) ?? null;
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

// Get available voices for a specific language
export function getAvailableVoices(lang: string = "en"): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  return voices.filter(v => v.lang.startsWith(lang));
}

// Save voice preferences
export function saveVoicePreferences(sarahVoice: string | null, marcusVoice: string | null): void {
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
export function loadVoicePreferences(): { sarahVoice: string | null; marcusVoice: string | null } | null {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem("english-lab-voice-preferences");
    return saved ? JSON.parse(saved) : null;
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

