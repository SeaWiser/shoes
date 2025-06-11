import { View, StyleSheet, Pressable, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { colors } from "@constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SMALL_ICON_SIZE } from "@constants/sizes";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";
import * as ImagePicker from "expo-image-picker";
import { ProfileImage } from "@models/profile";
import { Skeleton } from "moti/skeleton";
import { useState } from "react";

const SIZE = 90;

interface ProfilePictureProps {
  image: ProfileImage;
  setImage: (image: ProfileImage) => void;
  photoUrl?: string;
}

export default function ProfilePicture({
  image,
  setImage,
  photoUrl,
}: ProfilePictureProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri, new: true });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.imageContainer} onPress={pickImage}>
        {photoUrl ? (
          <Skeleton
            show={!isImageLoaded}
            width={SIZE}
            radius={radius.FULL}
            colorMode="light"
          >
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              onLoadEnd={() => setIsImageLoaded(true)}
            />
          </Skeleton>
        ) : (
          <FontAwesome name="user-circle" size={SIZE} color={colors.BLUE} />
        )}
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="enhance-photo-translate"
            size={SMALL_ICON_SIZE / 2}
            color={colors.WHITE}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: spaces.XL,
  },
  imageContainer: {
    width: SIZE,
    height: SIZE,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: radius.FULL,
    borderWidth: 1,
    borderColor: colors.DARK,
  },
  iconContainer: {
    position: "absolute",
    bottom: 0,
    width: SMALL_ICON_SIZE,
    height: SMALL_ICON_SIZE,
    left: "50%",
    transform: [
      { translateX: -SMALL_ICON_SIZE / 2 },
      { translateY: SMALL_ICON_SIZE / 2 },
    ],
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.BLUE,
    borderRadius: radius.FULL,
  },
});
