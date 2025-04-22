import { View } from "react-native";

type ItemSeparatorProps = {
  width: number;
}

export default function ItemSeparator({ width }: ItemSeparatorProps) {
  return <View style={{ width }} />;
}