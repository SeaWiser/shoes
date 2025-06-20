import React, { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Alert } from "react-native";
import { colors } from "@constants/colors";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";
import TextBoldL from "@ui-components/texts/TextBoldL";
import { usePaymentSheet } from "@hooks/usePaymentSheet";
import { presentPaymentSheet } from "@stripe/stripe-react-native";

interface PaymentButtonProps {
  isReady: boolean;
  setIsPaymentDone: (value: boolean) => void;
  totalAmount: number;
  onInitializationStart?: () => void;
  onInitializationEnd?: () => void;
}

export default function PaymentButton({
  isReady: isCartReady,
  setIsPaymentDone,
  totalAmount,
  onInitializationStart,
  onInitializationEnd,
}: PaymentButtonProps) {
  const {
    clientSecret,
    initError,
    isLoading: isPaymentLoading,
    resetPaymentSheet,
    isReady: isPaymentSheetReady,
  } = usePaymentSheet(totalAmount);

  // Notifies the parent component of the start/end of payment loading
  useEffect(() => {
    if (isPaymentLoading) {
      onInitializationStart?.();
    } else {
      onInitializationEnd?.();
    }
  }, [isPaymentLoading, onInitializationStart, onInitializationEnd]);

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      console.warn(
        "⚠️ Tentative d'ouverture de la payment sheet sans client secret.",
      );
      return;
    }

    try {
      const { error } = await presentPaymentSheet();
      if (error) {
        // The user canceled or an error occurred.
        Alert.alert(`${error.code}`, error.message);
        console.error("❌ Erreur présentation payment sheet:", error);
      } else {
        // Payment successful
        Alert.alert("Succès", "Votre paiement a été confirmé !");
        console.log("✅ Paiement réussi");
        setIsPaymentDone(true);
        resetPaymentSheet(); // We reset the status for a future purchase.
      }
    } catch (e) {
      console.error(
        "❌ Erreur inattendue lors de la présentation de la payment sheet:",
        e,
      );
      Alert.alert("Erreur", "Une erreur inattendue est survenue.");
    }
  };

  const handlePayment = async () => {
    if (initError) {
      Alert.alert(
        "Erreur d'initialisation",
        "Impossible de démarrer le paiement. Voulez-vous réessayer ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Réessayer",
            onPress: () => {
              // We reset the status. The hook will try to reinitialize itself.
              resetPaymentSheet();
            },
          },
        ],
      );
      return;
    }

    if (isCartReady && isPaymentSheetReady) {
      await openPaymentSheet();
    } else {
      console.warn("⚠️ Clic sur Payer alors que le bouton n'est pas prêt.", {
        isCartReady,
        isPaymentSheetReady,
      });
    }
  };

  // The useMemo hook manages the button state and text in a centralized manner
  const buttonState = useMemo(() => {
    const isFullyReady = isCartReady && isPaymentSheetReady;

    if (initError) {
      return {
        ready: true,
        text: "Erreur - Réessayer",
        style: styles.buttonError,
      };
    }
    if (isPaymentLoading) {
      return {
        ready: false,
        text: "Préparation...",
        style: styles.buttonDisabled,
      };
    }
    if (isFullyReady) {
      return {
        ready: true,
        text: `Payer ${totalAmount.toFixed(2)} €`,
        style: styles.button,
      };
    }
    // Default case or intermediate state
    return {
      ready: false,
      text: "Initialisation...",
      style: styles.buttonDisabled,
    };
  }, [
    isCartReady,
    isPaymentSheetReady,
    isPaymentLoading,
    initError,
    totalAmount,
  ]);

  return (
    <Pressable
      style={[styles.button, buttonState.style]}
      onPress={handlePayment}
      disabled={!buttonState.ready}
    >
      <TextBoldL style={styles.buttonText}>{buttonState.text}</TextBoldL>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.BLUE,
    paddingVertical: spaces.L,
    paddingHorizontal: spaces.XL,
    borderRadius: radius.REGULAR,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spaces.L,
    minHeight: 52,
  },
  buttonDisabled: {
    backgroundColor: colors.GREY,
  },
  buttonError: {
    backgroundColor: colors.RED,
  },
  buttonText: {
    color: colors.WHITE,
  },
});
