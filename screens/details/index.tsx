import { View, StyleSheet, ScrollView } from "react-native";
import { shoes } from "@data/shoes";
import DetailsDescription from "@screens/details/components/DetailsDescription";
import DetailsImage from "@screens/details/components/DetailsImage";
import Gallery from "@screens/details/components/Gallery";
import Sizes from "@screens/details/components/Sizes";
import { ShoeSize } from "@models/shoe-size";
import CustomButton from "@ui-components/buttons/CustomButton";
import { spaces } from "@constants/spaces";
import { SCREEN_HEIGHT } from "@constants/sizes";

export default function Details() {
  const data = shoes[0].stock[0];
  const imageSource = data.items[0].image;
  const images = data.items.map((item) => item.image);
  const sizes = data.items[0].sizes;
  console.log(sizes);
  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <DetailsImage source={imageSource} />
          <DetailsDescription name={data.name} price={data.price} description={data.description} />
          <Gallery images={images} />
          <Sizes sizes={sizes as ShoeSize[]} />
          <View style={styles.btnContainer}>
            <CustomButton text="Ajouter au panier" onPress={() => console.log("Ajouter au panier")} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: SCREEN_HEIGHT,
  },
  container: {
    position: "relative",
    bottom: 120,
  },
  btnContainer: {
    width: "80%",
    alignSelf: "center",
    maxWidth: 400,
    marginVertical: spaces.XL,
  },
});
