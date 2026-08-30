/**
 * Biometric Authentication (WebAuthn / Passkeys / Face ID / Touch ID / Fingerprint)
 * Uses native browser Web Authentication API without mock fallbacks.
 */

export async function isBiometricsAvailable(): Promise<boolean> {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    return false;
  }

  try {
    const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return isAvailable;
  } catch {
    return false;
  }
}

export async function registerBiometrics(userEmail: string): Promise<{ success: boolean; message: string }> {
  if (!(await isBiometricsAvailable())) {
    return { success: false, message: "Biometria não suportada neste dispositivo ou navegador." };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    window.crypto.getRandomValues(userId);

    const createOptions: CredentialCreationOptions = {
      publicKey: {
        challenge,
        rp: {
          name: "English Lab",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: userEmail,
          displayName: userEmail.split("@")[0],
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      },
    };

    const credential = await navigator.credentials.create(createOptions);

    if (credential) {
      localStorage.setItem("english-lab-biometric-registered", "true");
      localStorage.setItem("english-lab-biometric-email", userEmail);
      return { success: true, message: "Biometria (Face ID / Touch ID) cadastrada com sucesso!" };
    }

    return { success: false, message: "Não foi possível registrar a credencial biométrica." };
  } catch (err: any) {
    console.error("Biometric registration error:", err);
    return {
      success: false,
      message: err.name === "NotAllowedError" 
        ? "Registro biométrico cancelado pelo usuário." 
        : err.message || "Erro ao registrar biometria.",
    };
  }
}

export async function authenticateWithBiometrics(): Promise<{ success: boolean; userEmail?: string; message: string }> {
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

    const getOptions: CredentialRequestOptions = {
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
        rpId: window.location.hostname,
      },
    };

    const assertion = await navigator.credentials.get(getOptions);

    if (assertion) {
      return {
        success: true,
        userEmail: registeredEmail,
        message: "Autenticação biométrica validada com sucesso!",
      };
    }

    return { success: false, message: "Falha na verificação biométrica." };
  } catch (err: any) {
    console.error("Biometric authentication error:", err);
    return {
      success: false,
      message: err.name === "NotAllowedError"
        ? "Leitura biométrica cancelada pelo usuário."
        : err.message || "Falha na leitura biométrica.",
    };
  }
}
