import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { shoes } from "@data/shoes";
import DetailsDescription from "@screens/details/components/DetailsDescription";
import DetailsImage from "@screens/details/components/DetailsImage";
import Gallery from "@screens/details/components/Gallery";
import Sizes from "@screens/details/components/Sizes";
import { ShoeSize } from "@models/shoe-size";
import CustomButton from "@ui-components/buttons/CustomButton";
import { spaces } from "@constants/spaces";
import { SCREEN_HEIGHT } from "@constants/sizes";
import { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@models/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type DetailsProps = {
  route: RouteProp<RootStackParamList, "Details">;
  navigation: NativeStackNavigationProp<RootStackParamList, "Details">;
};

export default function Details({ route, navigation }: DetailsProps) {
  const data = shoes
    .find((el) => el.stock.find((item) => item.id === route.params.id))!
    .stock.find((item) => item.id === route.params.id)!;
  const images = data.items.map((item) => item.image);
  const [selectedImage, setSelectedImage] = useState(data.items[0].image);
  const [selectedSize, setSelectedSize] = useState<ShoeSize | undefined>();
  const [sizes, setSizes] = useState<number[] | undefined>(data.items[0].sizes);

  useEffect(() => {
    setSizes(data.items.find((el) => el.image === selectedImage)?.sizes);
    setSelectedSize(undefined);
  }, [selectedImage]);

  useEffect(() => {
    navigation.setOptions({
      title: data.gender === "m" ? "Shoes Homme" : "Shoes Femme",
    });
  }, [route.params.id]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <DetailsImage source={selectedImage} />
          <DetailsDescription
            name={data.name}
            price={data.price}
            description={data.description}
            id={route.params.id}
          />
          <Gallery
            images={images}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
          />
          <Sizes
            sizes={sizes as ShoeSize[]}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
          <View style={styles.btnContainer}>
            <CustomButton
              text="Ajouter au panier"
              onPress={() => console.log("Ajouter au panier")}
            />
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
    bottom: Platform.select({ android: 80, ios: 100 }),
  },
  btnContainer: {
    width: "80%",
    alignSelf: "center",
    maxWidth: 400,
    marginVertical: spaces.XL,
  },
});
