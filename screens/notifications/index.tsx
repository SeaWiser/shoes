import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";
import { shoes } from "@data/shoes";
import { colors } from "@constants/colors";
import ItemSeparator from "@ui-components/separators/ListItemSeparator";
import { spaces } from "@constants/spaces";
import ListItem from "@screens/notifications/components/ListItem";
import { ShoeStock } from "@models/shoe";
import { MainStackParamList } from "@models/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "@store/api/authApi";
import { useProfileCreation } from "@hooks/useProfileCreation";
import { useUpdateUserProfileMutation } from "@store/api/userApi";

const ids = ["nik64p", "adi7p", "adi203p"];

type NotificationsProps = {
  navigation: NativeStackNavigationProp<MainStackParamList>;
};

export default function Notifications({ navigation }: NotificationsProps) {
  const { user: authUser } = useAuth();
  const { userProfile, appwriteUserProfile, isLoadingProfile } =
    useProfileCreation();
  const [updateUserProfile] = useUpdateUserProfileMutation();

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
    if (!appwriteUserProfile || !authUser) return;

    const currentSeenNotifs = appwriteUserProfile.seenNotifsIds || [];

    // Check that the notification is not already marked as seen.
    if (currentSeenNotifs.includes(id)) return;

    const newSeenNotifs = [...currentSeenNotifs, id];

    updateUserProfile({
      documentId: appwriteUserProfile.$id,
      userId: authUser.$id,
      seenNotifsIds: newSeenNotifs,
    });
  };

  const renderItem = ({ item }: { item: ShoeStock }) => (
    <ListItem
      item={item}
      navigateToDetails={navigateToDetails}
      isSeen={appwriteUserProfile?.seenNotifsIds?.includes(item.id)}
      updateNotif={updateNotif}
    />
  );

  if (isLoadingProfile || !authUser) {
    return (
      <View style={styles.emptyListContainer}>
        <ActivityIndicator size="large" color={colors.DARK} />
      </View>
    );
  }

  if (!userProfile || !appwriteUserProfile) {
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
