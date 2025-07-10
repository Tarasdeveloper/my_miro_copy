import { useState } from "react";

type AddStickerViewState = {
    type: "add-sticker";
};

type IdleViewState = {
    type: "idle";

    selectedIds: string[];
};

type ViewState = AddStickerViewState | IdleViewState;

export function useViewModel() {
    const [viewState, setViewState] = useState<ViewState>({
        type: "idle",
        selectedIds: [],
    });

    const goToIdle = () => {
        setViewState({
            type: "idle",
            selectedIds: [], // Reset selected IDs when going to idle
        });
    };

    const selection = (
        ids: string[],
        modif: "replace" | "add" | "toggle" = "replace",
    ) =>
        setViewState((s) => {
            if (s.type === "idle") {
                return selectItems(s, ids, modif);
            }
            return s;
        });

    const goToAddSticker = () => {
        setViewState({
            type: "add-sticker",
        });
    };

    return {
        viewState,
        selection,
        goToAddSticker,
        goToIdle,
    };
}

function selectItems(
    viewState: IdleViewState,
    ids: string[],
    modif: "replace" | "add" | "toggle" = "replace",
) {
    if (modif === "replace") {
        return {
            ...viewState,
            selectedIds: ids,
        };
    }
    if (modif === "add") {
        return {
            ...viewState,
            selectedIds: Array.from(
                new Set([...viewState.selectedIds, ...ids]),
            ),
        };
    }
    if (modif === "toggle") {
        const currentIds = new Set(viewState.selectedIds);
        const newIds = new Set(ids);

        const base = viewState.selectedIds.filter((id) => !newIds.has(id));
        const added = ids.filter((id) => !currentIds.has(id));

        return {
            ...viewState,
            selectedIds: [...base, ...added],
        };
    }

    return viewState;
}
