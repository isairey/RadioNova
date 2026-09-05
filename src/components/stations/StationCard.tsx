import {
    Image,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

import FavoriteButton from "@/components/stations/FavoriteButton";
import { Colors } from "@/constants/colors";
import { Station } from "@/types/station";

interface StationCardProps {
  station: Station;
  onPress?: (station: Station) => void;
  onFavoritePress?: (station: Station) => void;
  style?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  showFavorite?: boolean;
}

export default function StationCard({
  station,
  onPress,
  onFavoritePress,
  style,
  horizontal = false,
  showFavorite = true,
}: StationCardProps) {
  const handlePress = () => {
    onPress?.(station);
  };

  const location = [
    station.location?.city,
    station.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      style={[
        styles.card,
        horizontal && styles.horizontalCard,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Estación ${station.name}`}
    >
      <View
        style={[
          styles.imageContainer,
          horizontal && styles.horizontalImageContainer,
        ]}
      >
        {station.logoUrl ? (
          <Image
            source={{ uri: station.logoUrl }}
            style={styles.logo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>
              {station.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {station.isLive && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>EN VIVO</Text>
          </View>
        )}

        {showFavorite && onFavoritePress && (
          <View style={styles.favoriteContainer}>
            <FavoriteButton
              station={station}
              onPress={onFavoritePress}
              size="small"
            />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {station.name}
        </Text>

        {station.frequency && (
          <Text style={styles.frequency} numberOfLines={1}>
            {station.frequency}
          </Text>
        )}

        {station.slogan && (
          <Text style={styles.slogan} numberOfLines={2}>
            {station.slogan}
          </Text>
        )}

        <View style={styles.footer}>
          {location ? (
            <Text style={styles.location} numberOfLines={1}>
              📍 {location}
            </Text>
          ) : (
            <Text style={styles.category} numberOfLines={1}>
              {station.category}
            </Text>
          )}

          {station.listeners !== undefined && (
            <Text style={styles.listeners}>
              👥 {formatListeners(station.listeners)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function formatListeners(listeners: number): string {
  if (listeners >= 1000000) {
    return `${(listeners / 1000000).toFixed(1)}M`;
  }

  if (listeners >= 1000) {
    return `${(listeners / 1000).toFixed(1)}K`;
  }

  return listeners.toString();
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 14,
  },

  horizontalCard: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageContainer: {
    width: "100%",
    height: 170,
    position: "relative",
    backgroundColor: Colors.light.background,
  },

  horizontalImageContainer: {
    width: 110,
    height: 110,
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  logo: {
    width: "100%",
    height: "100%",
  },

  logoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
  },

  logoPlaceholderText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  liveBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.live,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    marginRight: 5,
  },

  liveText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  favoriteContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  content: {
    padding: 14,
    flex: 1,
  },

  name: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
  },

  frequency: {
    color: Colors.light.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },

  slogan: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  location: {
    flex: 1,
    color: Colors.light.textSecondary,
    fontSize: 12,
  },

  category: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  listeners: {
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
});