import { View, StyleSheet, Image } from "react-native";
import { ShoeStock } from "@models/shoe";
import Touchable from "@ui-components/touchable/Touchable";
import TextBoldM from "@ui-components/texts/TextBoldM";
import TextMediumM from "@ui-components/texts/TextMediumM";
import TextBoldL from "@ui-components/texts/TextBoldL";
import TextMediumS from "@ui-components/texts/TextMediumS";
import { spaces } from "@constants/spaces";
import { colors } from "@constants/colors";
import { radius } from "@constants/radius";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { addSeenNotification } from "../../../store/slices/notificationsSlice";

type ListItemProps = {
  item: ShoeStock;
  navigateToDetails: (id: string) => void;
};

export default function ListItem({ item, navigateToDetails }: ListItemProps) {
  const dispatch = useDispatch();
  const seenNotificationsIds = useSelector(
    (state: RootState) => state.notifications.seenNotificationsIds,
  );

  const isSeen = seenNotificationsIds.includes(item.id);

  const navigate = () => {
    navigateToDetails(item.id);
    setTimeout(() => {
      dispatch(addSeenNotification(item.id));
    }, 300);
  };

  return (
    <View style={styles.container}>
      <Touchable color={colors.BLUE} onPress={navigate}>
        <View style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <Image source={item.items[0].image} style={styles.image}></Image>
          </View>
          <View style={styles.textContainer}>
            <TextBoldM>Nouvelle offre</TextBoldM>
            <TextMediumM>{item.name}</TextMediumM>
            <TextBoldL>{item.price} €</TextBoldL>
          </View>
          <View>
            <TextMediumS>Il y a 2 jours</TextMediumS>
            {isSeen ? (
              <TextMediumS style={styles.seenText}>vu</TextMediumS>
            ) : (
              <View style={styles.dot} />
            )}
          </View>
        </View>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spaces.XS,
    paddingHorizontal: spaces.L,
  },
  imageContainer: {
    width: 120,
    height: "100%",
  },
  image: {
    width: 120,
    height: 120,
    transform: [
      { rotate: "-20deg" },
      { translateX: -spaces.S },
      { translateY: -spaces.S },
    ],
  },
  textContainer: {
    justifyContent: "space-evenly",
    paddingVertical: spaces.S,
  },
  dot: {
    width: spaces.S,
    height: spaces.S,
    borderRadius: radius.FULL,
    backgroundColor: colors.BLUE,
    marginTop: spaces.M,
    alignSelf: "flex-end",
  },
  seenText: {
    marginTop: spaces.M,
    alignSelf: "flex-end",
  },
});
