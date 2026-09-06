import { useMemo, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Colors } from "@/constants/colors";
import {
    Station,
    StationCategory,
} from "@/types/station";

import StationList from "@/components/stations/StationList";

interface EstacionesScreenProps {
  stations?: Station[];
  onStationPress?: (station: Station) => void;
  onFavoritePress?: (station: Station) => void;
}

export default function EstacionesScreen({
  stations = [],
  onStationPress,
  onFavoritePress,
}: EstacionesScreenProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<StationCategory | "ALL">("ALL");
  const [onlyLive, setOnlyLive] = useState(false);

  const categories: Array<StationCategory | "ALL"> = [
    "ALL",
    StationCategory.MUSIC,
    StationCategory.NEWS,
    StationCategory.SPORTS,
    StationCategory.ROCK,
    StationCategory.POP,
    StationCategory.ELECTRONIC,
    StationCategory.REGIONAL,
    StationCategory.CULTURE,
    StationCategory.TALK,
  ];

  const filteredStations = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return stations.filter((station) => {
      const matchesSearch =
        !searchText ||
        station.name.toLowerCase().includes(searchText) ||
        station.description?.toLowerCase().includes(searchText) ||
        station.slogan?.toLowerCase().includes(searchText) ||
        station.frequency?.toLowerCase().includes(searchText) ||
        station.location?.city?.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "ALL" ||
        station.category === selectedCategory;

      const matchesLive =
        !onlyLive || station.isLive;

      return (
        station.isActive &&
        matchesSearch &&
        matchesCategory &&
        matchesLive
      );
    });
  }, [stations, search, selectedCategory, onlyLive]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("ALL");
    setOnlyLive(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => {
            const selected = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selected && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextActive,
                  ]}
                >
                  {category === "ALL"
                    ? "Todas"
                    : getCategoryLabel(category)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔎</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar estación..."
            placeholderTextColor={Colors.light.textSecondary}
            style={styles.searchInput}
            returnKeyType="search"
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filtersRow}>
          <Text style={styles.resultsText}>
            {filteredStations.length}{" "}
            {filteredStations.length === 1
              ? "estación"
              : "estaciones"}
          </Text>

          <TouchableOpacity
            style={[
              styles.liveButton,
              onlyLive && styles.liveButtonActive,
            ]}
            onPress={() => setOnlyLive((value) => !value)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.liveDot,
                onlyLive && styles.liveDotActive,
              ]}
            />

            <Text
              style={[
                styles.liveButtonText,
                onlyLive && styles.liveButtonTextActive,
              ]}
            >
              En vivo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <StationList
            stations={filteredStations}
            onStationPress={onStationPress}
            onFavoritePress={onFavoritePress}
            emptyMessage={
              search || selectedCategory !== "ALL" || onlyLive
                ? "No encontramos estaciones con los filtros seleccionados."
                : "No hay estaciones disponibles."
            }
          />
        </View>

        {(search || selectedCategory !== "ALL" || onlyLive) &&
          filteredStations.length === 0 && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={clearFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>
                Limpiar filtros
              </Text>
            </TouchableOpacity>
          )}
      </View>
    </SafeAreaView>
  );
}

function getCategoryLabel(category: StationCategory): string {
  const labels: Record<StationCategory, string> = {
    [StationCategory.MUSIC]: "Música",
    [StationCategory.NEWS]: "Noticias",
    [StationCategory.SPORTS]: "Deportes",
    [StationCategory.ROCK]: "Rock",
    [StationCategory.POP]: "Pop",
    [StationCategory.ELECTRONIC]: "Electrónica",
    [StationCategory.REGIONAL]: "Regional",
    [StationCategory.CULTURE]: "Cultura",
    [StationCategory.TALK]: "Talk",
    [StationCategory.RELIGIOUS]: "Religiosa",
    [StationCategory.VARIETY]: "Variedades",
  };

  return labels[category];
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  container: {
    flex: 1,
  },

  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  categoryButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },

  categoryText: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: Colors.light.text,
    fontSize: 15,
  },

  clearButton: {
    padding: 5,
  },

  clearText: {
    color: Colors.light.textSecondary,
    fontSize: 15,
  },

  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 8,
  },

  resultsText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },

  liveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  liveButtonActive: {
    backgroundColor: Colors.light.live,
    borderColor: Colors.light.live,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: Colors.light.textSecondary,
  },

  liveDotActive: {
    backgroundColor: "#FFFFFF",
  },

  liveButtonText: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },

  liveButtonTextActive: {
    color: "#FFFFFF",
  },

  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  resetButton: {
    alignSelf: "center",
    marginBottom: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});