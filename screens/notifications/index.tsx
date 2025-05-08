import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import { shoes } from "@data/shoes";
import { colors } from "@constants/colors";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import { spaces } from "@constants/spaces";
import ListItem from "@screens/notifications/components/ListItem";
import { ShoeStock } from "@models/shoe";
import { MainStackParamList } from "@models/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  useAddSeenNotificationsMutation,
  useGetAllSeenNotificationsQuery,
  useUpdateSeenNotificationsMutation,
} from "../../store/api/notificationsApi";

const ids = ["nik64p", "adi7p", "adi203p"];

type NotificationsProps = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

export default function Notifications({ navigation }: NotificationsProps) {
  const { data: seenNotifs, isLoading } = useGetAllSeenNotificationsQuery();
  const [addSeenNotif] = useAddSeenNotificationsMutation();
  const [updateSeenNotif] = useUpdateSeenNotificationsMutation();

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
    if (seenNotifs?.id) {
      const currentNotifs = seenNotifs.notifsIds || [];
      if (!currentNotifs.includes(id)) {
        updateSeenNotif({
          id: seenNotifs.id,
          notifsIds: [...currentNotifs, id],
        });
      }
    } else {
      addSeenNotif(id);
    }
  };

  const renderItem = ({ item }: { item: ShoeStock }) => (
    <ListItem
      item={item}
      navigateToDetails={navigateToDetails}
      isSeen={seenNotifs?.notifsIds?.includes(item.id)}
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
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.LIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: colors.LIGHT,
    paddingTop: spaces.L,
  },
});
