import api from "@/services/api";
import { useCallback, useState } from "react";

type LogItem = {
    _id: string;
    timestamp: string;
    success: boolean;
    reason: string;
};

export function useLogs() {
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/audit-logs");
            setLogs(response.data.logs);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { logs, loading, fetchLogs };
}