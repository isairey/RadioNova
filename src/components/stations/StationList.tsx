import {
    ActivityIndicator,
    FlatList,
    ListRenderItem,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";

import StationCard from "@/components/stations/StationCard";
import { Colors } from "@/constants/colors";
import { Station } from "@/types/station";

interface StationListProps {
  stations: Station[];
  onStationPress?: (station: Station) => void;
  onFavoritePress?: (station: Station) => void;
  loading?: boolean;
  horizontal?: boolean;
  showFavorite?: boolean;
  emptyMessage?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function StationList({
  stations,
  onStationPress,
  onFavoritePress,
  loading = false,
  horizontal = false,
  showFavorite = true,
  emptyMessage = "No hay estaciones disponibles.",
  style,
  contentContainerStyle,
}: StationListProps) {
  const renderStation: ListRenderItem<Station> = ({ item }) => (
    <StationCard
      station={item}
      onPress={onStationPress}
      onFavoritePress={onFavoritePress}
      showFavorite={showFavorite}
      horizontal={horizontal}
      style={horizontal ? styles.horizontalCard : undefined}
    />
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
        />

        <Text style={styles.loadingText}>
          Cargando estaciones...
        </Text>
      </View>
    );
  }

  if (stations.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyIcon}>📻</Text>

        <Text style={styles.emptyTitle}>
          Sin estaciones
        </Text>

        <Text style={styles.emptyMessage}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={stations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderStation}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        horizontal && styles.horizontalListContent,
        contentContainerStyle,
      ]}
      style={style}
      ItemSeparatorComponent={
        horizontal
          ? () => <View style={styles.horizontalSeparator} />
          : undefined
      }
      removeClippedSubviews
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 4,
  },

  horizontalListContent: {
    paddingHorizontal: 4,
  },

  horizontalCard: {
    width: 300,
    marginBottom: 0,
  },

  horizontalSeparator: {
    width: 12,
  },

  loadingContainer: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: Colors.light.textSecondary,
    fontSize: 14,
  },

  emptyContainer: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptyMessage: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});