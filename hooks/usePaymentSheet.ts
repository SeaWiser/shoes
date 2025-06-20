import { useState, useRef, useCallback, useEffect } from "react";
import { useInitPayment } from "@hooks/queries/useStripe";
import { initPaymentSheet } from "@stripe/stripe-react-native";

export function usePaymentSheet(totalAmount: number) {
  const [clientSecret, setClientSecret] = useState<string>();
  const [initError, setInitError] = useState<string | null>(null);

  const lastInitializedAmountRef = useRef<number | null>(null);
  const isInitializingRef = useRef(false);

  const initPaymentMutation = useInitPayment();

  const initializePaymentSheet = useCallback(
    async (amount: number) => {
      if (isInitializingRef.current || amount <= 0) {
        return;
      }
      const amountDifference = lastInitializedAmountRef.current
        ? Math.abs(lastInitializedAmountRef.current - amount)
        : Infinity;
      if (clientSecret && amountDifference < 1) {
        return;
      }
      try {
        isInitializingRef.current = true;
        setInitError(null);
        console.log(
          `🔄 Initialisation payment sheet pour ${amount.toFixed(2)} €`,
        );
        const data = await initPaymentMutation.mutateAsync({
          amount: Math.round(amount * 100),
          currency: "eur",
        });
        const { error } = await initPaymentSheet({
          customerId: data.customer,
          customerEphemeralKeySecret: data.ephemeralKey,
          paymentIntentClientSecret: data.paymentIntent,
          merchantDisplayName: "Shoes Inc.",
          returnURL: "your-app://payment-return",
          allowsDelayedPaymentMethods: true,
        });
        if (!error) {
          setClientSecret(data.paymentIntent);
          lastInitializedAmountRef.current = amount;
          console.log(
            `✅ Payment sheet initialisé pour ${amount.toFixed(2)} €`,
          );
        } else {
          console.error("❌ Erreur initialisation payment sheet:", error);
          setInitError(error.message);
        }
      } catch (error: any) {
        console.error("❌ Erreur API initialisation paiement:", error);
        setInitError(error.message || "Erreur d'initialisation");
      } finally {
        isInitializingRef.current = false;
      }
    },
    [initPaymentMutation, clientSecret],
  );

  useEffect(() => {
    if (totalAmount > 0) {
      const handler = setTimeout(() => {
        initializePaymentSheet(totalAmount);
      }, 1200);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [totalAmount, initializePaymentSheet]);

  const resetPaymentSheet = useCallback(() => {
    console.log("🔄 Reset de l'état du payment sheet");
    setClientSecret(undefined);
    setInitError(null);
    lastInitializedAmountRef.current = null;
    isInitializingRef.current = false;
  }, []);

  // We check whether the current amount corresponds to the last initialized amount.
  const isAmountSynced =
    Math.abs((lastInitializedAmountRef.current ?? -1) - totalAmount) < 1;

  return {
    clientSecret,
    initError,
    isLoading: initPaymentMutation.isPending || isInitializingRef.current,
    resetPaymentSheet,
    isReady:
      !!clientSecret &&
      !initError &&
      !isInitializingRef.current &&
      isAmountSynced,
  };
}
