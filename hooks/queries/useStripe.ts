import { useQuery, useMutation } from "@tanstack/react-query";
import { stripeService } from "@services/stripeService";

export function useFetchPublishableKey() {
  return useQuery({
    queryKey: ["stripePublishableKey"],
    queryFn: stripeService.fetchPublishableKey,
    staleTime: Infinity,
  });
}

// ✅ Corriger le hook useInitPayment pour retourner une mutation
export function useInitPayment() {
  return useMutation({
    mutationFn: async (params: { amount: number; currency: string }) => {
      console.log("🔄 Initialisation paiement:", params);

      const result = await stripeService.initPayment(params);

      console.log("✅ Paiement initialisé:", {
        hasCustomer: !!result.customer,
        hasEphemeralKey: !!result.ephemeralKey,
        hasPaymentIntent: !!result.paymentIntent,
      });

      return result;
    },
    onError: (error) => {
      console.error("❌ Erreur initialisation paiement:", error);
    },
  });
}

// Alias pour compatibilité
export const useStripePublishableKey = useFetchPublishableKey;
