import { View, StyleSheet, FlatList, ListRenderItem } from "react-native";
import { colors } from "../../constants/colors";
import { RootStackParamList } from "../../types/navigation";
import { shoes } from "../../data/shoes";
import { ShoeStock } from "../../types/shoe";
import VerticalCard from "../../ui-components/cards/VerticalCard";
import ListItemSeparator from "../../ui-components/separators/ListItemSeparator";
import { spaces } from "../../constants/spaces";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { useEffect } from "react";
import { SCREEN_HEIGHT } from "../../constants/sizes";

type ListRouteProp = RouteProp<RootStackParamList, any>;

type ListeProps = {
  route: ListRouteProp;
  navigation: NativeStackNavigationProp<RootStackParamList, "List">;
}

export default function List({ route, navigation }: ListeProps) {
  console.log(route.params);
  const data = shoes.find(elem => elem.brand === route!.params!.brand);
  console.log(data);

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.brand.charAt(0).toUpperCase() + route.params?.brand.slice(1),
    });
  }, [route.params?.brand]);

  const renderItem: ListRenderItem<ShoeStock> = ({ item }) => (
    <View style={styles.cardContainer}>
      <VerticalCard item={item} listScreen></VerticalCard>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList data={data?.stock ?? []}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                ItemSeparatorComponent={() => <ListItemSeparator height={spaces.L} />}
                contentContainerStyle={styles.contentStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    backgroundColor: colors.LIGHT,
    paddingTop: spaces.L,
    paddingBottom: 106,
  },
  contentStyle: {
    paddingBottom: spaces.XL,
  },
  cardContainer: {
    flex: 0.5,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
});