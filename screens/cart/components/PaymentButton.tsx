import { StyleSheet } from "react-native";
import CustomButton from "@ui-components/buttons/CustomButton";
import { useEffect, useState } from "react";
import { useInitPaymentMutation } from "../../../store/api/stripe";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

interface PaymentButtonProps {
  isReady: boolean;
  setIsPaymentDone: (value: boolean) => void;
}

export default function PaymentButton({
  isReady,
  setIsPaymentDone,
}: PaymentButtonProps) {
  const [clientSecret, setClientSecret] = useState();
  const [initPayment] = useInitPaymentMutation();

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      return;
    }

    const { error } = await presentPaymentSheet();
    if (error) {
      console.log(error);
    } else {
      setIsPaymentDone(true);
    }
  };

  const initializePaymentSheet = async () => {
    const { data } = await initPayment();
    const { error } = await initPaymentSheet({
      customerId: data.customer,
      customerEphemeralKeySecret: data.ephemeralKey,
      paymentIntentClientSecret: data.paymentIntent,
      merchantDisplayName: "Shoes Inc.",
      returnURL: "exp://127.0.0.1:8081",
    });
    if (!error) {
      setClientSecret(data.paymentIntent);
    }
  };

  useEffect(() => {
    if (isReady) {
      initializePaymentSheet();
    }
  }, [isReady]);

  return (
    <CustomButton
      text="Passer la commande"
      isLoading={!isReady}
      onPress={openPaymentSheet}
    />
  );
}

const styles = StyleSheet.create({});
