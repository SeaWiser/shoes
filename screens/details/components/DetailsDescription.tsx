import { StyleSheet, View } from "react-native";
import TextBoldXL from "@ui-components/texts/TextBoldXL";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextMediumM from "@ui-components/texts/TextMediumM";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ICON_SIZE } from "@constants/sizes";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../store/api/userApi";

type DetailsDescriptionProps = {
  name: string;
  price: number;
  description: string;
  id: string;
};

export default function DetailsDescription({
  name,
  price,
  description,
  id,
}: DetailsDescriptionProps) {
  const userId = useSelector((state: RootState) => state.user.id);
  const { data: user } = useGetUserByIdQuery(userId);
  const [updateUser] = useUpdateUserMutation();
  const isFavorite = user?.favoritesIds?.includes(id);

  const iconName = isFavorite ? "star" : "staro";

  const toggleFavorite = () => {
    if (isFavorite) {
      // remove fron favorites
      updateUser({
        id: userId,
        favoritesIds: user?.favoritesIds.filter((el) => el !== id),
      });
    } else if (user?.favoritesIds) {
      // add to existing favorites
      updateUser({
        id: userId,
        shoesIds: [...user.favoritesIds, id],
      });
    } else {
      // create document with first favorite item
      updateUser({
        id: userId,
        favoritesIds: [id],
      });
    }
  };

  return (
    <View style={styles.descriptionContainer}>
      <View>
        <TextMediumM blue style={styles.textSpacing}>
          MEILLEUR CHOIX
        </TextMediumM>
        <View style={styles.nameAndFavoriteContainer}>
          <TextBoldXL style={styles.textSpacing}>{name}</TextBoldXL>
          <AntDesign
            name={iconName}
            size={ICON_SIZE}
            color={colors.BLUE}
            onPress={toggleFavorite}
            suppressHighlighting={true}
          />
        </View>
      </View>
      <TextBoldL style={styles.textSpacing}>{price} €</TextBoldL>
      <TextMediumM style={styles.descriptionText}>{description}</TextMediumM>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionContainer: {
    paddingHorizontal: spaces.L,
  },
  textSpacing: {
    marginBottom: spaces.S,
  },
  nameAndFavoriteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  descriptionText: {
    color: colors.GREY,
  },
});
