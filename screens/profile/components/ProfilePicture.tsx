import { View, StyleSheet, Pressable, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { colors } from "@constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SMALL_ICON_SIZE } from "@constants/sizes";
import { spaces } from "@constants/spaces";
import { radius } from "@constants/radius";
import * as ImagePicker from "expo-image-picker";
import { ProfileImage } from "@models/profile";
import { MotiView } from "moti";
import { useState, useEffect } from "react";

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

  // The current URI of the image to be displayed
  const currentImageUri = image.uri || photoUrl;

  // Reset isImageLoaded when the image changes
  useEffect(() => {
    console.log(currentImageUri);
    console.log(isImageLoaded);
    setIsImageLoaded(false);
  }, [currentImageUri]);

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
        {currentImageUri ? (
          <View style={styles.imageContainer}>
            {!isImageLoaded && (
              <MotiView
                from={{ opacity: 0.3 }}
                animate={{ opacity: 0.7 }}
                transition={{
                  type: "timing",
                  duration: 1000,
                  loop: true,
                }}
                style={[
                  styles.image,
                  {
                    position: "absolute",
                    backgroundColor: colors.GREY,
                    zIndex: 1,
                  },
                ]}
              />
            )}
            <Image
              source={{ uri: currentImageUri }}
              style={styles.image}
              onLoadEnd={() => setIsImageLoaded(true)}
              onError={(error) => {
                console.error("Error loading image:", error);
                setIsImageLoaded(true); // Stop the loader even in case of error
              }}
            />
          </View>
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
