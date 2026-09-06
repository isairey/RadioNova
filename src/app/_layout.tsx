
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.dark.background,
          },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen name="radio/index" />

        <Stack.Screen
          name="radio/[id]"
          options={{
            presentation: "card",
          }}
        />

        <Stack.Screen name="estaciones/index" />

        <Stack.Screen name="favoritos/index" />

        <Stack.Screen name="perfil/index" />
      </Stack>
    </>
  );
}

