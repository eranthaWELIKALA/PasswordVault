import { PortalProvider } from "@gorhom/portal";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/useColorScheme";
import { store } from "@/redux/store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../contexts/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        const load = async () => {
            // Example: wait 2 seconds or load resources
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await SplashScreen.hideAsync();
        };

        load();
    }, []);

    if (!loaded) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
        </GestureHandlerRootView>
    );
}
