import * as Linking from "expo-linking";
import { LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from "@models/navigation";

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/"), "exp+project-shoes://"],
  config: {
    screens: {
      Home: "home",
      Details: "details/:id",
      MainCart: "cart",
      Drawer: {
        screens: {
          BottomTabs: {
            screens: {
              Notifications: "notifications",
              // Home: "tabs-home",
              // Favorites: "tabs-favorites",
              // Cart: "tabs-cart",
              // Profile: "tabs-profile",
            },
          },
        },
      },
    },
  },
};
