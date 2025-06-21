import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

type FloatingActionButtonProps = {
    onPress: () => void;
    iconName?: keyof typeof Ionicons.glyphMap;
    size?: number;
    color?: string;
};

export default function FloatingActionButton({
    onPress,
    iconName = "add",
    size = 32,
    color = "#fff",
}: FloatingActionButtonProps) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                { opacity: pressed ? 0.8 : 1.0 },
            ]}
            onPress={onPress}
        >
            <Ionicons name={iconName} size={size} color={color} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        bottom: 5,
        right: 5,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#007AFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 1,
    },
});
