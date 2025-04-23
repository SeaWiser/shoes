import { StyleSheet, useWindowDimensions, View } from "react-native";
import Banner from "../components/Banner";
import HorizontalCard from "./components/HorizontalCard";
import { shoes } from "../../../data/shoes";
import { spaces } from "../../../constants/spaces";
import { IS_LARGE_SCREEN } from "../../../constants/sizes";

type NewsSectionProps = {
  selectedBrand: string;
}

export default function NewsSection({ selectedBrand }: NewsSectionProps) {
  const { height } = useWindowDimensions();
  const landscapeStyle = {
    flex: 160,
    minHeight: 240,
    paddingVertical: spaces.M,
  };

  const item =
    shoes.find(elem => elem.brand === selectedBrand)
      ?.stock.find((elem) => elem.new);

  return (
    <View style={height < 400 ? landscapeStyle : styles.container}>
      <Banner text="Nouveautés" />
      <HorizontalCard item={item!} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 160,
    minHeight: IS_LARGE_SCREEN ? 320 : 160,
  },
});