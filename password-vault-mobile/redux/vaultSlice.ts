import { Group } from "@/utils/dataTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type VaultEntry = {
    _id?: string;
    label: string;
    group?: string;
    // ...other fields...
};

type VaultState = {
    selectedGroup: Group | null;
    entries: VaultEntry[];
};

const initialState: VaultState = {
    selectedGroup: null,
    entries: [],
};

export const vaultSlice = createSlice({
    name: "vault",
    initialState,
    reducers: {
        setSelectedGroup: (state, action: PayloadAction<Group | null>) => {
            state.selectedGroup = action.payload;
        },
        setEntries: (state, action: PayloadAction<VaultEntry[]>) => {
            state.entries = action.payload;
        },
        // Add more reducers as needed (addEntry, updateEntry, etc.)
    },
});

export const { setSelectedGroup, setEntries } = vaultSlice.actions;
export default vaultSlice.reducer;