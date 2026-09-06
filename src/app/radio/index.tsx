import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { useRadioStore } from "@/store/radioStore";

import PlayerControls from "@/components/radio/PlayerControls";
import VolumeControls from "@/components/radio/VolumeControl";
import StationLogo from "@/components/stations/StationLogo";

export default function RadioIndexScreen() {
  const router = useRouter();

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

  const error = useRadioStore(
    (state) => state.error
  );

  const setPlaying = useRadioStore(
    (state) => state.setPlaying
  );

  const clearError = useRadioStore(
    (state) => state.clearError
  );

  useEffect(() => {
    if (!currentStation) {
      setPlaying(false);
    }
  }, [currentStation, setPlaying]);

  const handlePlayPause = () => {
    if (!currentStation) {
      return;
    }

    clearError();
    setPlaying(!isPlaying);
  };

  const handleStop = () => {
    setPlaying(false);
  };

  const handlePrevious = () => {
    // Preparado para cambiar a la estación anterior.
  };

  const handleNext = () => {
    // Preparado para cambiar a la siguiente estación.
  };

  const handleStations = () => {
    router.push("/estaciones");
  };

  if (!currentStation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📻</Text>

          <Text style={styles.emptyTitle}>
            No hay estación seleccionada
          </Text>

          <Text style={styles.emptyMessage}>
            Selecciona una estación para comenzar a escuchar
            RadioNova.
          </Text>

          <TouchableOpacity
            style={styles.stationsButton}
            onPress={handleStations}
            activeOpacity={0.8}
          >
            <Text style={styles.stationsButtonText}>
              Explorar estaciones
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
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            RadioNova
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleStations}
            activeOpacity={0.7}
          >
            <Text style={styles.headerIcon}>
              ☰
            </Text>
          </TouchableOpacity>
        </View>

        {/* STATION */}
        <View style={styles.stationSection}>
          <StationLogo
            station={currentStation}
            size={210}
            showLiveIndicator
          />

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                !currentStation.isLive &&
                  styles.statusDotOffline,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                !currentStation.isLive &&
                  styles.statusTextOffline,
              ]}
            >
              {currentStation.isLive
                ? "EN VIVO"
                : "FUERA DE LÍNEA"}
            </Text>
          </View>

          <Text style={styles.stationName}>
            {currentStation.name}
          </Text>

          {currentStation.frequency && (
            <Text style={styles.frequency}>
              {currentStation.frequency}
            </Text>
          )}

          {currentStation.slogan && (
            <Text style={styles.slogan}>
              {currentStation.slogan}
            </Text>
          )}
        </View>

        {/* NOW PLAYING */}
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
            {nowPlaying?.artist ??
              "Transmisión en vivo"}
          </Text>

          {nowPlaying?.albumArt && (
            <Text style={styles.musicIcon}>
              ♪
            </Text>
          )}
        </View>

        {/* ERROR */}
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
              <Text style={styles.dismissText}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* CONTROLES */}
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

        {/* VOLUMEN */}
        <View style={styles.volumeCard}>
          <VolumeControls />
        </View>

        {/* INFORMACIÓN */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Estación actual
          </Text>

          <InfoRow
            label="Categoría"
            value={getCategoryLabel(
              currentStation.category
            )}
          />

          {currentStation.location?.city && (
            <InfoRow
              label="Ubicación"
              value={[
                currentStation.location.city,
                currentStation.location.state,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          )}

          <InfoRow
            label="Idioma"
            value={currentStation.language}
          />

          <InfoRow
            label="Formato"
            value={currentStation.stream.format}
          />

          {currentStation.listeners !== undefined && (
            <InfoRow
              label="Oyentes"
              value={formatListeners(
                currentStation.listeners
              )}
            />
          )}
        </View>

        {/* CAMBIAR ESTACIÓN */}
        <TouchableOpacity
          style={styles.changeStationButton}
          onPress={handleStations}
          activeOpacity={0.8}
        >
          <Text style={styles.changeStationIcon}>
            📻
          </Text>

          <Text style={styles.changeStationText}>
            Cambiar estación
          </Text>

          <Text style={styles.changeStationArrow}>
            ›
          </Text>
        </TouchableOpacity>
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
  category: string
): string {
  const labels: Record<string, string> = {
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
    marginBottom: 25,
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

  headerIcon: {
    color: Colors.light.text,
    fontSize: 19,
  },

  headerTitle: {
    color: Colors.light.text,
    fontSize: 19,
    fontWeight: "800",
  },

  stationSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.live,
    marginRight: 6,
  },

  statusDotOffline: {
    backgroundColor: Colors.light.textSecondary,
  },

  statusText: {
    color: Colors.light.live,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  statusTextOffline: {
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
    marginTop: 4,
  },

  slogan: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
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

  musicIcon: {
    position: "absolute",
    top: 12,
    right: 15,
    color: Colors.light.primary,
    fontSize: 24,
  },

  errorContainer: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.error,
    backgroundColor: Colors.light.card,
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
    lineHeight: 19,
    marginTop: 4,
  },

  dismissText: {
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

  infoCard: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 15,
  },

  infoTitle: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: "800",
    marginVertical: 10,
  },

  infoRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
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

  changeStationButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  changeStationIcon: {
    fontSize: 19,
    marginRight: 10,
  },

  changeStationText: {
    flex: 1,
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: "700",
  },

  changeStationArrow: {
    color: Colors.light.textSecondary,
    fontSize: 26,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 18,
  },

  emptyTitle: {
    color: Colors.light.text,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyMessage: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
  },

  stationsButton: {
    marginTop: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
  },

  stationsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});