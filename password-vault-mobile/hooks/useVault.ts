import api from "@/services/api";
import { decryptObject, encryptObject } from "@/services/crypto";
import { HttpStatusCode } from "axios";
import { useCallback, useState } from "react";

type VaultEntry = {
    _id?: string;
    userId?: string;
    deviceId?: string;
    label: string;
    entryType: String;
    group?: string;
    encryptedData?: string;
    createdAt?: string;
    updatedAt?: string;
    decryptedData?: Record<string, any>;
};

export function useVault() {
    const [entries, setEntries] = useState<VaultEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/vault");
            const decrypted = response.data.entries.map((entry: VaultEntry) => ({
                ...entry,
                decryptedData: decryptObject(entry.encryptedData!),
            }));
            setEntries(decrypted);
        } catch (error) {
            console.error("Failed to fetch vault entries:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addEntry = useCallback(async (newEntry: any) => {
        let data = {
            label: newEntry.label,
            entryType: newEntry.entryType,
            group: newEntry.group,
        };
        let dataObj = {};
        if (newEntry.entryType === "login") {
            dataObj = {
                username: newEntry.username,
                password: newEntry.password,
                link: newEntry.link,
                note: newEntry.note,
            };
        } else if (newEntry.entryType === "card_pin") {
            dataObj = { pin: newEntry.pin };
        } else if (newEntry.entryType === "wifi") {
            dataObj = {
                wifiName: newEntry.wifiName,
                wifiPassword: newEntry.wifiPassword,
            };
        } else if (newEntry.entryType === "note") {
            dataObj = { note: newEntry.note };
        }
        (data as any).encryptedData = encryptObject(dataObj);

        setLoading(true);
        try {
            const response = await api.post("vault", data);
            if (response.status === HttpStatusCode.Created) {
                await fetchEntries();
                return true;
            }
        } catch (error) {
            console.error("Error saving vault entry:", error);
        } finally {
            setLoading(false);
        }
        return false;
    }, [fetchEntries]);

    const updateEntry = useCallback(async (entry: any, editableEntry: any) => {
        setLoading(true);
        try {
            const updatedData = {
                ...entry,
                encryptedData: encryptObject(editableEntry),
            };
            const response = await api.put(`vault/${entry?._id}`, updatedData);
            if (response.status === 200) {
                await fetchEntries();
                return true;
            }
        } catch (err) {
            console.error("Error updating entry:", err);
        } finally {
            setLoading(false);
        }
        return false;
    }, [fetchEntries]);

    return {
        entries,
        loading,
        fetchEntries,
        addEntry,
        updateEntry,
    };
}