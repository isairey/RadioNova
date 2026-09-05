import {
    Image,
    ImageStyle,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

import { Colors } from "@/constants/colors";
import { Station } from "@/types/station";

interface StationLogoProps {
  station: Station;
  size?: number;
  style?: StyleProp<ImageStyle | ViewStyle>;
  borderRadius?: number;
  showLiveIndicator?: boolean;
}

export default function StationLogo({
  station,
  size = 64,
  style,
  borderRadius,
  showLiveIndicator = false,
}: StationLogoProps) {
  const radius = borderRadius ?? size * 0.18;

  const initial = station.name
    ? station.name.charAt(0).toUpperCase()
    : "R";

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
        },
        style as StyleProp<ViewStyle>,
      ]}
    >
      {station.logoUrl ? (
        <Image
          source={{ uri: station.logoUrl }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: radius,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: radius,
            },
          ]}
        >
          <Text
            style={[
              styles.initial,
              {
                fontSize: size * 0.4,
              },
            ]}
          >
            {initial}
          </Text>
        </View>
      )}

      {showLiveIndicator && station.isLive && (
        <View
          style={[
            styles.liveIndicator,
            {
              width: Math.max(10, size * 0.2),
              height: Math.max(10, size * 0.2),
              borderRadius: Math.max(5, size * 0.1),
              borderWidth: Math.max(2, size * 0.04),
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "visible",
    backgroundColor: Colors.light.background,
  },

  image: {
    backgroundColor: Colors.light.background,
  },

  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
  },

  initial: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  liveIndicator: {
    position: "absolute",
    right: -2,
    bottom: -2,
    backgroundColor: Colors.light.live,
    borderColor: Colors.light.card,
  },
});