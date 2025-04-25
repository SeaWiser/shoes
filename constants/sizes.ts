import { Dimensions } from "react-native";

export const ICON_SIZE = 32;
export const SMALL_ICON_SIZE = 24;

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

export const SCREEN_WIDTH = WINDOW_WIDTH;
export const SCREEN_HEIGHT = WINDOW_HEIGHT;

export const IS_SMALL_SCREEN = SCREEN_WIDTH <= 360;
export const IS_LARGE_SCREEN = SCREEN_WIDTH >= 700;
