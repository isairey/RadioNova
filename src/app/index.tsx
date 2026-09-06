
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import StationList from "@/components/stations/StationList";
import { Colors } from "@/constants/colors";
import { Station, StationCategory } from "@/types/station";

interface HomeScreenProps {
  stations?: Station[];
  onStationPress?: (station: Station) => void;
  onFavoritePress?: (station: Station) => void;
}

const defaultStations: Station[] = [];

export default function HomeScreen({
  stations = defaultStations,
  onStationPress,
  onFavoritePress,
}: HomeScreenProps) {
  const router = useRouter();

  const activeStations = useMemo(
    () => stations.filter((station) => station.isActive),
    [stations]
  );

  const liveStations = useMemo(
    () =>
      activeStations.filter((station) => station.isLive).slice(0, 5),
    [activeStations]
  );

  const popularStations = useMemo(
    () =>
      [...activeStations]
        .sort((a, b) => (b.listeners ?? 0) - (a.listeners ?? 0))
        .slice(0, 5),
    [activeStations]
  );

  const musicStations = useMemo(
    () =>
      activeStations
        .filter((station) => station.category === StationCategory.MUSIC)
        .slice(0, 5),
    [activeStations]
  );

  const handleStationPress = (station: Station) => {
    if (onStationPress) {
      onStationPress(station);
      return;
    }

    router.push(`/radio/${station.id}`);
  };

  const handleFavoritePress = (station: Station) => {
    if (onFavoritePress) {
      onFavoritePress(station);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bienvenido a</Text>
            <Text style={styles.logo}>
              Radio<Text style={styles.logoAccent}>Nova</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/perfil")}
            activeOpacity={0.7}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Tu radio,
              {"\n"}
              en un solo lugar
            </Text>

            <Text style={styles.heroDescription}>
              Descubre estaciones, música, noticias y mucho más.
            </Text>

            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push("/estaciones")}
              activeOpacity={0.8}
            >
              <Text style={styles.exploreButtonText}>
                Explorar estaciones
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.radioIconContainer}>
            <Text style={styles.radioIcon}>📻</Text>
          </View>
        </View>

        {/* Accesos rápidos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push("/estaciones")}
            activeOpacity={0.7}
          >
            <View style={styles.quickIcon}>
              <Text>📻</Text>
            </View>
            <Text style={styles.quickText}>Estaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push("/favoritos")}
            activeOpacity={0.7}
          >
            <View style={styles.quickIcon}>
              <Text>♥</Text>
            </View>
            <Text style={styles.quickText}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push("/radio")}
            activeOpacity={0.7}
          >
            <View style={styles.quickIcon}>
              <Text>▶</Text>
            </View>
            <Text style={styles.quickText}>Reproductor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push("/perfil")}
            activeOpacity={0.7}
          >
            <View style={styles.quickIcon}>
              <Text>⚙</Text>
            </View>
            <Text style={styles.quickText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Estaciones en vivo */}
        {liveStations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>En vivo ahora</Text>
                <Text style={styles.sectionSubtitle}>
                  Escucha estas estaciones en directo
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/estaciones")}
              >
                <Text style={styles.seeAll}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            <StationList
              stations={liveStations}
              onStationPress={handleStationPress}
              onFavoritePress={handleFavoritePress}
              horizontal
              showFavorite
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Más populares */}
        {popularStations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Más populares</Text>
                <Text style={styles.sectionSubtitle}>
                  Las estaciones más escuchadas
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/estaciones")}
              >
                <Text style={styles.seeAll}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            <StationList
              stations={popularStations}
              onStationPress={handleStationPress}
              onFavoritePress={handleFavoritePress}
              showFavorite
            />
          </View>
        )}

        {/* Música */}
        {musicStations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Música</Text>
                <Text style={styles.sectionSubtitle}>
                  Disfruta tus géneros favoritos
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/estaciones")}
              >
                <Text style={styles.seeAll}>Explorar</Text>
              </TouchableOpacity>
            </View>

            <StationList
              stations={musicStations}
              onStationPress={handleStationPress}
              onFavoritePress={handleFavoritePress}
              horizontal
              showFavorite
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Estado vacío */}
        {activeStations.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📻</Text>

            <Text style={styles.emptyTitle}>
              No hay estaciones disponibles
            </Text>

            <Text style={styles.emptyDescription}>
              Cuando haya estaciones disponibles aparecerán aquí.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push("/estaciones")}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>
                Ver estaciones
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            Radio<Text style={styles.logoAccent}>Nova</Text>
          </Text>

          <Text style={styles.footerText}>
            Tu mundo de radio, siempre contigo.
          </Text>

          <Text style={styles.version}>RadioNova v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  greeting: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 3,
  },

  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.dark.text,
  },

  logoAccent: {
    color: Colors.dark.primary,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 20,
  },

  hero: {
    minHeight: 205,
    borderRadius: 24,
    backgroundColor: Colors.dark.playerBackground,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 30,
  },

  heroContent: {
    flex: 1,
    paddingRight: 10,
  },

  heroTitle: {
    fontSize: 27,
    lineHeight: 32,
    fontWeight: "800",
    color: Colors.dark.text,
    marginBottom: 10,
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.dark.textSecondary,
    marginBottom: 18,
  },

  exploreButton: {
    alignSelf: "flex-start",
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },

  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  radioIconContainer: {
    width: 85,
    height: 85,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.card,
  },

  radioIcon: {
    fontSize: 42,
  },

  section: {
    marginTop: 30,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.dark.text,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 3,
  },

  seeAll: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.dark.primary,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quickAction: {
    width: "23%",
    alignItems: "center",
  },

  quickIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  quickText: {
    fontSize: 11,
    color: Colors.dark.text,
    fontWeight: "600",
    textAlign: "center",
  },

  horizontalList: {
    paddingRight: 10,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 55,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 8,
  },

  emptyDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },

  emptyButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  footer: {
    alignItems: "center",
    marginTop: 50,
    paddingTop: 25,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },

  footerLogo: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.dark.text,
    marginBottom: 6,
  },

  footerText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 8,
  },

  version: {
    fontSize: 10,
    color: Colors.dark.textSecondary,
  },
});

