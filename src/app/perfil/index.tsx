import { useMemo } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";

interface PerfilScreenProps {
  onEditProfile?: () => void;
  onFavoritesPress?: () => void;
  onSettingsPress?: () => void;
  onBack?: () => void;
}

export default function PerfilScreen({
  onEditProfile,
  onFavoritesPress,
  onSettingsPress,
  onBack,
}: PerfilScreenProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const initials = useMemo(() => {
    if (!user) {
      return "?";
    }

    const firstName = user.name?.charAt(0) ?? "";
    const lastName = user.lastName?.charAt(0) ?? "";

    return `${firstName}${lastName}`.toUpperCase() || "?";
  }, [user]);

  const fullName = user
    ? `${user.name} ${user.lastName ?? ""}`.trim()
    : "Usuario";

  const roleLabel = user?.role
    ? getRoleLabel(user.role)
    : "Usuario";

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notLoggedContainer}>
          <Text style={styles.notLoggedIcon}>👤</Text>

          <Text style={styles.notLoggedTitle}>
            No has iniciado sesión
          </Text>

          <Text style={styles.notLoggedMessage}>
            Inicia sesión para acceder a tu perfil y administrar tus
            preferencias.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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

            <Text style={styles.headerTitle}>
              Mi perfil
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.editButtonText}>
              Editar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {user.avatarUrl ? (
              <Text style={styles.avatarPlaceholder}>
                {initials}
              </Text>
            ) : (
              <Text style={styles.avatarText}>
                {initials}
              </Text>
            )}
          </View>

          <Text style={styles.name}>
            {fullName}
          </Text>

          <Text style={styles.email}>
            {user.email}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {roleLabel}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              user.isActive
                ? styles.activeBadge
                : styles.inactiveBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                user.isActive
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                user.isActive
                  ? styles.activeText
                  : styles.inactiveText,
              ]}
            >
              {user.isActive ? "Cuenta activa" : "Cuenta inactiva"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Mi cuenta
          </Text>

          <ProfileOption
            icon="👤"
            title="Información personal"
            description="Actualiza tus datos personales"
            onPress={onEditProfile}
          />

          <ProfileOption
            icon="♥"
            title="Mis favoritos"
            description="Administra tus estaciones favoritas"
            onPress={onFavoritesPress}
          />

          <ProfileOption
            icon="⚙"
            title="Configuración"
            description="Personaliza tu experiencia en RadioNova"
            onPress={onSettingsPress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Información
          </Text>

          <View style={styles.infoCard}>
            <InfoRow
              label="Nombre"
              value={user.name}
            />

            <InfoRow
              label="Apellidos"
              value={user.lastName || "No especificado"}
            />

            <InfoRow
              label="Correo electrónico"
              value={user.email}
            />

            <InfoRow
              label="Rol"
              value={roleLabel}
              last
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>
            ↪
          </Text>

          <Text style={styles.logoutText}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          RadioNova
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

interface ProfileOptionProps {
  icon: string;
  title: string;
  description: string;
  onPress?: () => void;
}

function ProfileOption({
  icon,
  title,
  description,
  onPress,
}: ProfileOptionProps) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.optionIcon}>
        <Text style={styles.optionIconText}>
          {icon}
        </Text>
      </View>

      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>
          {title}
        </Text>

        <Text style={styles.optionDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.optionArrow}>
        ›
      </Text>
    </TouchableOpacity>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  last?: boolean;
}

function InfoRow({
  label,
  value,
  last = false,
}: InfoRowProps) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && styles.infoRowBorder,
      ]}
    >
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

function getRoleLabel(role: string): string {
  switch (role) {
    case "ADMIN":
      return "Administrador";

    case "MODERATOR":
      return "Moderador";

    case "USER":
    default:
      return "Usuario";
  }
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
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
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

  headerTitle: {
    color: Colors.light.text,
    fontSize: 26,
    fontWeight: "800",
  },

  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  profileCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 18,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 24,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    marginBottom: 14,
  },

  avatarText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  avatarPlaceholder: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },

  name: {
    color: Colors.light.text,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  email: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },

  roleBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
  },

  roleText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: "700",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  activeBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.12)",
  },

  inactiveBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  activeDot: {
    backgroundColor: Colors.light.live,
  },

  inactiveDot: {
    backgroundColor: Colors.light.error,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  activeText: {
    color: Colors.light.live,
  },

  inactiveText: {
    color: Colors.light.error,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 10,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 8,
    borderRadius: 14,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.background,
  },

  optionIconText: {
    fontSize: 19,
  },

  optionContent: {
    flex: 1,
    marginLeft: 12,
  },

  optionTitle: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: "700",
  },

  optionDescription: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  optionArrow: {
    color: Colors.light.textSecondary,
    fontSize: 26,
    fontWeight: "300",
    marginLeft: 8,
  },

  infoCard: {
    paddingHorizontal: 15,
    borderRadius: 14,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  infoRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
  },

  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },

  infoLabel: {
    color: Colors.light.textSecondary,
    fontSize: 13,
    flex: 0.8,
  },

  infoValue: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    flex: 1.2,
  },

  logoutButton: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.error,
    marginTop: 4,
  },

  logoutIcon: {
    color: Colors.light.error,
    fontSize: 21,
    marginRight: 8,
  },

  logoutText: {
    color: Colors.light.error,
    fontSize: 14,
    fontWeight: "700",
  },

  version: {
    color: Colors.light.textSecondary,
    fontSize: 11,
    textAlign: "center",
    marginTop: 18,
  },

  notLoggedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
  },

  notLoggedIcon: {
    fontSize: 52,
    marginBottom: 15,
  },

  notLoggedTitle: {
    color: Colors.light.text,
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
  },

  notLoggedMessage: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
  },
});