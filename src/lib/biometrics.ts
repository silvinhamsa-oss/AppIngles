/**
 * Biometric Authentication (WebAuthn / Passkeys / Face ID / Touch ID / Fingerprint)
 * Fully compatible with iOS Safari PWA, Android Chrome, and Desktop Platform Authenticators.
 */

export interface BiometricAuthData {
  email: string;
  access_token?: string;
  refresh_token?: string;
  registeredAt: string;
}

export async function isBiometricsAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return false;
  }

  try {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
      const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return isAvailable;
    }
    return false;
  } catch {
    return false;
  }
}

export function isBiometricsRegistered(): boolean {
  if (typeof window === "undefined") return false;
  const registered = localStorage.getItem("english-lab-biometric-registered");
  const email = localStorage.getItem("english-lab-biometric-email");
  return Boolean(registered === "true" && email);
}

export function clearBiometrics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("english-lab-biometric-registered");
  localStorage.removeItem("english-lab-biometric-email");
  localStorage.removeItem("english-lab-biometric-tokens");
}

export function saveBiometricSession(email: string, tokens?: { access_token: string; refresh_token: string }): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("english-lab-biometric-registered", "true");
  localStorage.setItem("english-lab-biometric-email", email);
  if (tokens?.access_token && tokens?.refresh_token) {
    localStorage.setItem("english-lab-biometric-tokens", JSON.stringify({
      email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      registeredAt: new Date().toISOString(),
    }));
  }
}

export async function registerBiometrics(
  userEmail: string,
  tokens?: { access_token: string; refresh_token: string }
): Promise<{ success: boolean; message: string }> {
  if (!(await isBiometricsAvailable())) {
    return { success: false, message: "Biometria não suportada neste dispositivo ou navegador." };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const hostname = window.location.hostname;
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    const rpConfig: PublicKeyCredentialRpEntity = {
      name: "English Lab",
    };
    if (hostname && !isIp && hostname !== "localhost") {
      rpConfig.id = hostname;
    }

    const createOptions: CredentialCreationOptions = {
      publicKey: {
        challenge,
        rp: rpConfig,
        user: {
          id: userId,
          name: userEmail,
          displayName: userEmail.split("@")[0] || "Aluno",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
          residentKey: "preferred",
        },
        timeout: 60000,
        attestation: "none",
      },
    };

    const credential = await navigator.credentials.create(createOptions);

    if (credential) {
      saveBiometricSession(userEmail, tokens);
      return { success: true, message: "Biometria (Face ID / Touch ID / Digital) cadastrada com sucesso!" };
    }

    return { success: false, message: "Não foi possível registrar a credencial biométrica." };
  } catch (err: unknown) {
    console.error("Biometric registration error:", err);
    const isNotAllowed = err instanceof Error && err.name === "NotAllowedError";
    const errorMessage = err instanceof Error ? err.message : "Erro ao registrar biometria.";
    return {
      success: false,
      message: isNotAllowed
        ? "Registro biométrico cancelado pelo usuário."
        : errorMessage,
    };
  }
}

export async function authenticateWithBiometrics(): Promise<{
  success: boolean;
  userEmail?: string;
  tokens?: { access_token: string; refresh_token: string };
  message: string;
}> {
  if (!(await isBiometricsAvailable())) {
    return { success: false, message: "Biometria não disponível neste navegador." };
  }

  const registeredEmail = typeof window !== "undefined" ? localStorage.getItem("english-lab-biometric-email") : null;
  if (!registeredEmail) {
    return {
      success: false,
      message: "Nenhuma biometria cadastrada neste aparelho. Faça login com seu e-mail e senha primeiro.",
    };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const hostname = window.location.hostname;
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    const getOptions: CredentialRequestOptions = {
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "preferred",
      },
    };

    if (hostname && !isIp && hostname !== "localhost") {
      getOptions.publicKey!.rpId = hostname;
    }

    const assertion = await navigator.credentials.get(getOptions);

    if (assertion) {
      let tokens: { access_token: string; refresh_token: string } | undefined;
      try {
        const rawTokens = localStorage.getItem("english-lab-biometric-tokens");
        if (rawTokens) {
          const parsed = JSON.parse(rawTokens);
          if (parsed.access_token && parsed.refresh_token) {
            tokens = {
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token,
            };
          }
        }
      } catch {}

      return {
        success: true,
        userEmail: registeredEmail,
        tokens,
        message: "Autenticação biométrica validada com sucesso!",
      };
    }

    return { success: false, message: "Falha na verificação biométrica." };
  } catch (err: unknown) {
    console.error("Biometric authentication error:", err);
    const isNotAllowed = err instanceof Error && err.name === "NotAllowedError";
    const errorMessage = err instanceof Error ? err.message : "Falha na leitura biométrica.";
    return {
      success: false,
      message: isNotAllowed
        ? "Leitura biométrica cancelada pelo usuário."
        : errorMessage,
    };
  }
}
