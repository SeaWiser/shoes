import { StyleSheet, useWindowDimensions, View } from "react-native";
import Banner from "../components/Banner";
import HorizontalCard from "./components/HorizontalCard";
import { shoes } from "../../../data/shoes";
import { spaces } from "../../../constants/spaces";
import { IS_LARGE_SCREEN } from "../../../constants/sizes";
import { useAppNavigation } from "../../../hooks/navigation/useAppNavigation";

type NewsSectionProps = {
  selectedBrand: string;
}

export default function NewsSection({ selectedBrand }: NewsSectionProps) {
  const navigation = useAppNavigation();

  const { height } = useWindowDimensions();
  const landscapeStyle = {
    flex: 160,
    minHeight: 240,
    paddingVertical: spaces.M,
  };

  const item =
    shoes.find(elem => elem.brand === selectedBrand)
      ?.stock.find((elem) => elem.new);

  const navigateToNewsList = () => {
    navigation.navigate("NewsList");
  };

  return (
    <View style={height < 400 ? landscapeStyle : styles.container}>
      <HorizontalCard item={item!} />
      <Banner text="Nouveautés" navigate={navigateToNewsList} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 160,
    flexDirection: "column-reverse",
    minHeight: IS_LARGE_SCREEN ? 320 : 160,
    paddingVertical: spaces.M,
  },
});