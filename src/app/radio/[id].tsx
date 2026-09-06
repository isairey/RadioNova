import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { useRadioStore } from "@/store/radioStore";
import { Station } from "@/types/station";

import PlayerControls from "@/components/radio/PlayerControls";
import VolumeControls from "@/components/radio/VolumeControls";
import StationLogo from "@/components/stations/StationLogo";

interface RadioScreenProps {
  stations?: Station[];
}

export default function RadioScreen({
  stations = [],
}: RadioScreenProps) {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const currentStation = useRadioStore(
    (state) => state.currentStation
  );
  const nowPlaying = useRadioStore(
    (state) => state.nowPlaying
  );
  const isPlaying = useRadioStore(
    (state) => state.isPlaying
  );
  const isLoading = useRadioStore(
    (state) => state.isLoading
  );
  const error = useRadioStore((state) => state.error);

  const setStation = useRadioStore(
    (state) => state.setStation
  );
  const setPlaying = useRadioStore(
    (state) => state.setPlaying
  );
  const setLoading = useRadioStore(
    (state) => state.setLoading
  );
  const setError = useRadioStore(
    (state) => state.setError
  );
  const clearError = useRadioStore(
    (state) => state.clearError
  );

  const station = useMemo(() => {
    const stationId = Number(id);

    if (Number.isNaN(stationId)) {
      return null;
    }

    return (
      stations.find(
        (item) => item.id === stationId
      ) ?? null
    );
  }, [stations, id]);

  useEffect(() => {
    if (station) {
      setStation(station);
      clearError();
    }
  }, [station, setStation, clearError]);

  const handlePlayPause = () => {
    if (!station) {
      return;
    }

    if (isPlaying) {
      setPlaying(false);
      return;
    }

    setLoading(true);
    clearError();

    /*
     * Aquí se conectará posteriormente el reproductor
     * real de audio utilizando expo-audio.
     */
    setTimeout(() => {
      setLoading(false);
      setPlaying(true);
    }, 300);
  };

  const handleStop = () => {
    setPlaying(false);
  };

  const handlePrevious = () => {
    Alert.alert(
      "Anterior",
      "La función de cambiar a la estación anterior se conectará al reproductor."
    );
  };

  const handleNext = () => {
    Alert.alert(
      "Siguiente",
      "La función de cambiar a la siguiente estación se conectará al reproductor."
    );
  };

  const handleFavorite = () => {
    if (!station) {
      return;
    }

    Alert.alert(
      station.isFavorite
        ? "Favorito"
        : "Favoritos",
      station.isFavorite
        ? `${station.name} está en tus favoritos.`
        : `${station.name} se puede agregar a favoritos desde tu gestor de favoritos.`
    );
  };

  const handleShare = async () => {
    if (!station) {
      return;
    }

    try {
      await Share.share({
        message: `Escucha ${station.name} en RadioNova.${
          station.frequency
            ? ` Frecuencia: ${station.frequency}.`
            : ""
        }`,
      });
    } catch {
      // El usuario canceló el diálogo de compartir.
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/estaciones");
    }
  };

  if (!station) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            title: "Radio",
            headerShown: false,
          }}
        />

        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>📻</Text>

          <Text style={styles.notFoundTitle}>
            Estación no encontrada
          </Text>

          <Text style={styles.notFoundMessage}>
            La estación que buscas no está disponible.
          </Text>

          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonLargeText}>
              Ver estaciones
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: station.name,
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            Radio
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Compartir estación"
          >
            <Text style={styles.shareIcon}>↗</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stationSection}>
          <StationLogo
            station={station}
            size={180}
            showLiveIndicator
            style={styles.stationLogo}
          />

          <View style={styles.liveContainer}>
            <View
              style={[
                styles.liveDot,
                !station.isLive && styles.offlineDot,
              ]}
            />

            <Text
              style={[
                styles.liveText,
                !station.isLive && styles.offlineText,
              ]}
            >
              {station.isLive
                ? "TRANSMITIENDO EN VIVO"
                : "FUERA DE LÍNEA"}
            </Text>
          </View>

          <Text style={styles.stationName}>
            {station.name}
          </Text>

          {station.frequency && (
            <Text style={styles.frequency}>
              {station.frequency}
            </Text>
          )}

          {station.slogan && (
            <Text style={styles.slogan}>
              {station.slogan}
            </Text>
          )}
        </View>

        <View style={styles.nowPlayingCard}>
          <Text style={styles.nowPlayingLabel}>
            AHORA SONANDO
          </Text>

          <Text
            style={styles.songTitle}
            numberOfLines={2}
          >
            {nowPlaying?.title ?? "RadioNova"}
          </Text>

          <Text
            style={styles.artist}
            numberOfLines={1}
          >
            {nowPlaying?.artist ?? station.name}
          </Text>

          {nowPlaying?.albumArt && (
            <View style={styles.albumArtIndicator}>
              <Text style={styles.albumArtText}>
                ♪
              </Text>
            </View>
          )}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>
              Error de reproducción
            </Text>

            <Text style={styles.errorMessage}>
              {error}
            </Text>

            <TouchableOpacity
              onPress={clearError}
              activeOpacity={0.7}
            >
              <Text style={styles.retryText}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.controlsCard}>
          <PlayerControls
            isPlaying={isPlaying}
            isLoading={isLoading}
            onPlayPause={handlePlayPause}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onStop={handleStop}
          />
        </View>

        <View style={styles.volumeCard}>
          <VolumeControls />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFavorite}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.actionIcon,
                station.isFavorite &&
                  styles.favoriteActive,
              ]}
            >
              {station.isFavorite ? "♥" : "♡"}
            </Text>

            <Text style={styles.actionText}>
              {station.isFavorite
                ? "Favorita"
                : "Favorito"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>
              ↗
            </Text>

            <Text style={styles.actionText}>
              Compartir
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            Información de la estación
          </Text>

          <InfoRow
            label="Categoría"
            value={getCategoryLabel(station.category)}
          />

          {station.location?.city && (
            <InfoRow
              label="Ciudad"
              value={[
                station.location.city,
                station.location.state,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          )}

          <InfoRow
            label="Idioma"
            value={station.language}
          />

          <InfoRow
            label="País"
            value={station.country}
          />

          {station.stream.format && (
            <InfoRow
              label="Formato"
              value={station.stream.format}
            />
          )}

          {station.stream.bitrate && (
            <InfoRow
              label="Bitrate"
              value={`${station.stream.bitrate} kbps`}
            />
          )}

          {station.listeners !== undefined && (
            <InfoRow
              label="Oyentes"
              value={formatListeners(
                station.listeners
              )}
            />
          )}
        </View>

        {station.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>
              Acerca de esta estación
            </Text>

            <Text style={styles.description}>
              {station.description}
            </Text>
          </View>
        )}

        {station.websiteUrl && (
          <TouchableOpacity
            style={styles.websiteButton}
            activeOpacity={0.8}
          >
            <Text style={styles.websiteIcon}>
              🌐
            </Text>

            <Text style={styles.websiteText}>
              Visitar sitio web
            </Text>

            <Text style={styles.websiteArrow}>
              ›
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text
        style={styles.infoValue}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

function getCategoryLabel(
  category: Station["category"]
): string {
  const labels: Record<
    Station["category"],
    string
  > = {
    MUSIC: "Música",
    NEWS: "Noticias",
    SPORTS: "Deportes",
    ROCK: "Rock",
    POP: "Pop",
    ELECTRONIC: "Electrónica",
    REGIONAL: "Regional",
    CULTURE: "Cultura",
    TALK: "Talk",
    RELIGIOUS: "Religiosa",
    VARIETY: "Variedades",
  };

  return labels[category] ?? category;
}

function formatListeners(
  listeners: number
): string {
  if (listeners >= 1000000) {
    return `${(listeners / 1000000).toFixed(1)}M`;
  }

  if (listeners >= 1000) {
    return `${(listeners / 1000).toFixed(1)}K`;
  }

  return listeners.toString();
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
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

  shareIcon: {
    color: Colors.light.text,
    fontSize: 22,
    fontWeight: "700",
  },

  headerTitle: {
    flex: 1,
    marginHorizontal: 15,
    textAlign: "center",
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: "800",
  },

  stationSection: {
    alignItems: "center",
    marginBottom: 24,
  },

  stationLogo: {
    marginBottom: 18,
  },

  liveContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.live,
    marginRight: 6,
  },

  offlineDot: {
    backgroundColor: Colors.light.textSecondary,
  },

  liveText: {
    color: Colors.light.live,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  offlineText: {
    color: Colors.light.textSecondary,
  },

  stationName: {
    color: Colors.light.text,
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
  },

  frequency: {
    color: Colors.light.primary,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 5,
  },

  slogan: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 7,
  },

  nowPlayingCard: {
    position: "relative",
    alignItems: "center",
    padding: 20,
    borderRadius: 18,
    backgroundColor: Colors.light.playerBackground,
    marginBottom: 14,
  },

  nowPlayingLabel: {
    color: Colors.light.textSecondary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 8,
  },

  songTitle: {
    color: Colors.light.text,
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  artist: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },

  albumArtIndicator: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
  },

  albumArtText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  errorContainer: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.error,
    marginBottom: 14,
  },

  errorTitle: {
    color: Colors.light.error,
    fontSize: 14,
    fontWeight: "800",
  },

  errorMessage: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 19,
  },

  retryText: {
    color: Colors.light.primary,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
  },

  controlsCard: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 12,
  },

  volumeCard: {
    padding: 15,
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 15,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },

  actionButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  actionIcon: {
    color: Colors.light.text,
    fontSize: 20,
    marginRight: 7,
  },

  favoriteActive: {
    color: Colors.light.error,
  },

  actionText: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: "700",
  },

  infoSection: {
    marginBottom: 22,
  },

  sectionTitle: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 10,
  },

  infoRow: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },

  infoLabel: {
    color: Colors.light.textSecondary,
    fontSize: 13,
  },

  infoValue: {
    maxWidth: "60%",
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },

  descriptionSection: {
    marginBottom: 22,
  },

  description: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 14,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  websiteIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  websiteText: {
    flex: 1,
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: "700",
  },

  websiteArrow: {
    color: Colors.light.textSecondary,
    fontSize: 25,
  },

  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  notFoundIcon: {
    fontSize: 60,
    marginBottom: 15,
  },

  notFoundTitle: {
    color: Colors.light.text,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  notFoundMessage: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
  },

  backButtonLarge: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
  },

  backButtonLargeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});