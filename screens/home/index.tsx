import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@constants/colors";
import { RootStackParamList } from "@models/navigation";
import SearchSection from "@screens/home/searchSection";
import ListSection from "@screens/home/listSection";
import NewsSection from "@screens/home/newsSection";
import { useAuthStore } from "@store/authStore";
import { useUserById } from "@hooks/queries/useUser";
import { useFavoritesStore } from "@store/favoritesStore";
import { useCartStore } from "@store/cartStore";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { user: authUser } = useAuthStore();
  const { data: user } = useUserById(authUser?.$id!, {
    enabled: !!authUser?.$id,
  });
  const { syncFavorites } = useFavoritesStore();
  const { syncCart } = useCartStore();

  const [inputValue, setInputValue] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("nike");

  useEffect(() => {
    if (user?.favoriteIds) {
      syncFavorites(user.favoriteIds);
    }
  }, [user?.favoriteIds, syncFavorites]);

  useEffect(() => {
    if (user?.cart) {
      syncCart(user.cart);
    }
  }, [user?.cart, syncCart]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          bounces={false}
        >
          <SearchSection
            inputValue={inputValue}
            setInputValue={setInputValue}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
          <ListSection
            selectedBrand={selectedBrand}
            inputValue={inputValue}
            navigation={navigation}
          />
          <NewsSection selectedBrand={selectedBrand} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    justifyContent: "space-between",
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
});
