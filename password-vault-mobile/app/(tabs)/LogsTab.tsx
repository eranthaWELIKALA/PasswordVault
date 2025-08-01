import React from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
} from "react-native";

type LogItem = {
    _id: string;
    timestamp: string;
    success: boolean;
    reason: string;
};

type LogsTabProps = {
    logs: LogItem[];
    loading: boolean;
};

export default function LogsTab({ logs, loading }: LogsTabProps) {
    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#000"
                style={{ marginTop: 20 }}
            />
        );
    }

    return (
        <View style={styles.tabContainer}>
            <FlatList
                data={logs}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.logItem}>
                        <Text>
                            {new Date(item.timestamp).toLocaleString()} -{" "}
                            {item.success ? "Success" : "Fail"} - {item.reason}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: { padding: 10, height: "100%" },
    logItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
});
