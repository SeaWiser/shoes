import { StyleSheet, FlatList } from "react-native";
import { shoes } from "@data/shoes";
import { colors } from "@constants/colors";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import { spaces } from "@constants/spaces";
import ListItem from "@screens/notifications/components/ListItem";
import { ShoeStock } from "@models/shoe";
import { MainStackParamList } from "@models/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ids = ["nik64p", "adi7p", "adi203p"];

type NotificationsProps = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

export default function Notifications({ navigation }: NotificationsProps) {
  const data = ids
    .map((id) =>
      shoes
        .find((item) => item.stock.find((elem) => elem.id === id))
        ?.stock.find((item) => item.id === id),
    )
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  const navigateToDetails = (id: string) =>
    navigation.navigate("Details", { id });

  const renderItem = ({ item }: { item: ShoeStock }) => (
    <ListItem item={item} navigateToDetails={navigateToDetails} />
  );

  return (
    <FlatList
      style={styles.container}
      data={data}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={() => <ItemSeparator height={spaces.L} />}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    paddingTop: spaces.L,
  },
});
