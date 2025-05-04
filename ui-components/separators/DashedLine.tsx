import React, { useState } from "react";
import { View, ViewStyle, StyleProp, LayoutChangeEvent } from "react-native";

interface DashedLineProps {
  style?: StyleProp<ViewStyle>;
}

const DashedLine: React.FC<DashedLineProps> = ({ style }) => {
  const [width, setWidth] = useState(0);

  const dotWidth = 2;
  const dotHeight = 2;
  const spacing = 4;
  const dotsNeeded = Math.floor(width / (dotWidth + spacing));

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      onLayout={onLayout}
      style={[
        {
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        },
        style,
      ]}
    >
      {width > 0 &&
        [...Array(dotsNeeded)].map((_, i) => (
          <View
            key={i}
            style={{
              width: dotWidth,
              height: dotHeight,
              backgroundColor:
                style && typeof style === "object" && "borderColor" in style
                  ? style.borderColor
                  : "#000",
              marginRight: i === dotsNeeded - 1 ? 0 : spacing,
            }}
          />
        ))}
    </View>
  );
};

export default DashedLine;
