import { createContext, useContext, useState, type ReactNode } from "react";

interface OnboardingMediaValue {
  photoUrl: string | null;
  voiceUrl: string | null;
  displayName: string | null;
  voiceScript: string | null;
  setPhoto: (url: string) => void;
  setVoice: (url: string) => void;
  setDisplayName: (name: string) => void;
  setVoiceScript: (script: string) => void;
}

const OnboardingMediaContext = createContext<OnboardingMediaValue | null>(null);

export function OnboardingMediaProvider({ children }: { children: ReactNode }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [voiceScript, setVoiceScript] = useState<string | null>(null);

  return (
    <OnboardingMediaContext.Provider
      value={{
        photoUrl,
        voiceUrl,
        displayName,
        voiceScript,
        setPhoto: setPhotoUrl,
        setVoice: setVoiceUrl,
        setDisplayName,
        setVoiceScript,
      }}
    >
      {children}
    </OnboardingMediaContext.Provider>
  );
}

export function useOnboardingMedia() {
  const ctx = useContext(OnboardingMediaContext);
  if (!ctx) throw new Error("useOnboardingMedia must be used within OnboardingMediaProvider");
  return ctx;
}
