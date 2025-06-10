import React, { useRef, useEffect } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    PanResponder,
} from "react-native";
import { Portal } from "@gorhom/portal";

type Props = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    heightPercent?: number; // 0.0 - 1.0, default 0.8
};

export default function CustomBottomSheet({
    visible,
    onClose,
    children,
    heightPercent = 0.8,
}: Props) {
    const screenHeight = Dimensions.get("window").height;
    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const clampedPercent = Math.max(0, Math.min(heightPercent, 1));
    const sheetHeight = screenHeight * clampedPercent;

    // PanResponder for drag-to-close
    const pan = useRef(new Animated.Value(0)).current;
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) =>
                gestureState.dy > 5,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    pan.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 80) {
                    Animated.timing(translateY, {
                        toValue: screenHeight,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        pan.setValue(0);
                        onClose();
                    });
                } else {
                    Animated.spring(pan, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: visible ? 0 : screenHeight,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, clampedPercent, screenHeight, translateY]);

    if (!visible) return null;

    return (
        <Portal>
            <View
                style={styles.absoluteFill}
                pointerEvents={visible ? "auto" : "none"}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        styles.sheet,
                        {
                            height: sheetHeight,
                            transform: [
                                { translateY: Animated.add(translateY, pan) },
                            ],
                        },
                    ]}
                >
                    {/* Optional: Add a drag handle */}
                    <View style={styles.dragHandleContainer}>
                        <View style={styles.dragHandle} />
                    </View>
                    {children}
                </Animated.View>
            </View>
        </Portal>
    );
}

const styles = StyleSheet.create({
    absoluteFill: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 1,
    },
    sheet: {
        position: "absolute",
        left: 5,
        right: 5,
        bottom: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        elevation: 10,
        zIndex: 2,
    },
    dragHandleContainer: {
        alignItems: "center",
        marginBottom: 8,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#ccc",
    },
});
