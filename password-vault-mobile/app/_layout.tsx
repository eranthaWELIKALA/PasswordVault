import { PortalProvider } from "@gorhom/portal";
import {
    DefaultTheme,
    ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "@/redux/store";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    if (!loaded) return null;

    return (
        <Provider store={store}>
            <PortalProvider>
                <AuthProvider>
                    <ThemeProvider
                        // value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                        value={DefaultTheme}
                    >
                        <Slot />
                        <StatusBar style="auto" />
                    </ThemeProvider>
                </AuthProvider>
            </PortalProvider>
        </Provider>
    );
}
