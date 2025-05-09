import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import { shoes } from "@data/shoes";
import { colors } from "@constants/colors";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import { spaces } from "@constants/spaces";
import ListItem from "@screens/notifications/components/ListItem";
import { ShoeStock } from "@models/shoe";
import { MainStackParamList } from "@models/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/api/userApi";

const ids = ["nik64p", "adi7p", "adi203p"];

type NotificationsProps = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

export default function Notifications({ navigation }: NotificationsProps) {
  const userId = useSelector((state: RootState) => state.user.id);
  const { data: user, isLoading } = useGetUserByIdQuery(userId);
  const [updateUser] = useUpdateUserMutation();

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
    if (user?.seenNotifsIds) {
      updateUser({
        id: userId,
        seenNotifsIds: [...user.seenNotifsIds, id],
      });
    } else {
      updateUser({
        id: userId,
        seenNotifsIds: [id],
      });
    }
  };

  const renderItem = ({ item }: { item: ShoeStock }) => (
    <ListItem
      item={item}
      navigateToDetails={navigateToDetails}
      isSeen={user?.seenNotifsIds?.includes(item.id)}
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
