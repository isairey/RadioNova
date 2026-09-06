import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import StationList from "@/components/stations/StationList";
import { Colors } from "@/constants/colors";
import { useFavoritesStore } from "@/store/favoritesStore";
import { Station } from "@/types/station";

interface FavoritosScreenProps {
  onStationPress?: (station: Station) => void;
  onFavoritePress?: (station: Station) => void;
  onBack?: () => void;
}

export default function FavoritosScreen({
  onStationPress,
  onFavoritePress,
  onBack,
}: FavoritosScreenProps) {
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore(
    (state) => state.removeFavorite
  );

  const handleFavoritePress = (station: Station) => {
    if (onFavoritePress) {
      onFavoritePress(station);
      return;
    }

    removeFavorite(station.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {onBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Volver"
              >
                <Text style={styles.backIcon}>‹</Text>
              </TouchableOpacity>
            )}

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Favoritos</Text>

              <Text style={styles.subtitle}>
                {favorites.length}{" "}
                {favorites.length === 1
                  ? "estación guardada"
                  : "estaciones guardadas"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <StationList
            stations={favorites}
            onStationPress={onStationPress}
            onFavoritePress={handleFavoritePress}
            emptyMessage="Todavía no tienes estaciones favoritas. Agrega tus estaciones favoritas para encontrarlas rápidamente aquí."
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.background,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderRadius: 21,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  backIcon: {
    color: Colors.light.text,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "300",
    marginTop: -3,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    color: Colors.light.text,
    fontSize: 25,
    fontWeight: "800",
  },

  subtitle: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});