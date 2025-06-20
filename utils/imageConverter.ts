import { ImageSourcePropType } from "react-native";

export const convertImageToString = (image: ImageSourcePropType): string => {
  if (typeof image === "string") {
    return image;
  }

  if (typeof image === "number") {
    // Pour les images local (require), retourner le numéro comme string
    return image.toString();
  }

  if (Array.isArray(image)) {
    // Prendre la première image du tableau
    return image[0]?.uri || "";
  }

  if (typeof image === "object" && image !== null && "uri" in image) {
    return image.uri || "";
  }

  return "";
};
