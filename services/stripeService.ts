const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface InitPaymentParams {
  amount: number;
  currency: string;
}

interface InitPaymentResponse {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}

interface StripeConfig {
  publishableKey: string;
}

export const stripeService = {
  async fetchPublishableKey(): Promise<StripeConfig> {
    try {
      console.log("🔑 Retrieving Stripe public key...");

      // Temporary mock with real public key
      if (process.env.NODE_ENV === "development") {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              // Use your real Stripe test public key
              publishableKey:
                process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
                "pk_test_51...",
            });
          }, 500);
        });
      }

      const response = await fetch(`${API_BASE_URL}/stripe/config`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Clé publique récupérée");

      return data;
    } catch (error) {
      console.error("❌ Erreur récupération clé Stripe:", error);
      throw error;
    }
  },

  async initPayment(params: InitPaymentParams): Promise<InitPaymentResponse> {
    try {
      console.log("💳 Initialisation paiement Stripe:", params);

      // ✅ Mock temporaire avec des formats Stripe valides
      if (process.env.NODE_ENV === "development") {
        return new Promise((resolve) => {
          setTimeout(() => {
            const timestamp = Date.now();
            resolve({
              // ✅ Format valide pour PaymentIntent client secret
              paymentIntent: `pi_${timestamp}_secret_${timestamp}`,
              // ✅ Format valide pour EphemeralKey
              ephemeralKey: `ek_test_${timestamp}`,
              // ✅ Format valide pour Customer
              customer: `cus_${timestamp}`,
            });
          }, 1000);
        });
      }

      const response = await fetch(`${API_BASE_URL}/stripe/payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Paiement initialisé côté serveur");

      return data;
    } catch (error) {
      console.error("❌ Erreur initialisation paiement:", error);
      throw error;
    }
  },
};
