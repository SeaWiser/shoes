import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import { shoes } from "@data/shoes";
import { colors } from "@constants/colors";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import { spaces } from "@constants/spaces";
import ListItem from "@screens/notifications/components/ListItem";
import { ShoeStock } from "@models/shoe";
import { MainStackParamList } from "@models/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNotificationManager } from "@hooks/useNotificationManager";

const ids = ["nik64p", "adi7p", "adi203p"];

type NotificationsProps = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

export default function Notifications({ navigation }: NotificationsProps) {
  const { markAsSeen, isNotificationSeen, isLoading } =
    useNotificationManager();

  const data = ids
    .map((id) =>
      shoes
        .find((item) => item.stock.find((elem) => elem.id === id))
        ?.stock.find((item) => item.id === id),
    )
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  const navigateToDetails = (id: string) =>
    navigation.navigate("Details", { id });

  const updateNotif = (id: string) => {
    markAsSeen(id);
  };

  const renderItem = ({ item }: { item: ShoeStock }) => (
    <ListItem
      item={item}
      navigateToDetails={navigateToDetails}
      isSeen={isNotificationSeen(item.id)}
      updateNotif={updateNotif}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.emptyListContainer}>
        <ActivityIndicator size="large" color={colors.DARK} />
      </View>
    );
  }

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
    paddingHorizontal: spaces.L,
    paddingTop: spaces.L,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
