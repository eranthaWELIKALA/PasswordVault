import api from "@/services/api";
import { Group } from "@/utils/dataTypes";
import { useCallback, useState } from "react";

export function useGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchGroups = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/vault/groups");
            setGroups(response.data.groups);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { groups, loading, fetchGroups };
}