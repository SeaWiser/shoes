import { View } from "react-native";

type ItemSeparatorProps = {
  width?: number;
  height?: number;
}

export default function ItemSeparator({ width = 0, height = 0 }: ItemSeparatorProps) {
  return <View style={{ width, height }} />;
}