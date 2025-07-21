import { KeyboardEvent, MouseEvent } from "react";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";
import { goToEditSticker } from "../edit-sticker";

export function useGoToEditSticker(params: ViewModelParams) {
    const { setViewState } = params;
    const handleNodeClick = (
        idleState: IdleViewState,
        nodeId: string,
        e: MouseEvent<HTMLButtonElement>,
    ) => {
        if (
            idleState.selectedIds.size === 1 &&
            idleState.selectedIds.has(nodeId) &&
            !e.ctrlKey &&
            !e.shiftKey
        ) {
            setViewState(goToEditSticker(nodeId));
            return { preventNext: true };
        }
        return {
            preventNext: false,
        };
    };

    const handleKeyDown = (
        idleState: IdleViewState,
        e: KeyboardEvent<HTMLDivElement>,
    ) => {
        if (
            !e.shiftKey &&
            !e.altKey &&
            !e.metaKey &&
            !e.ctrlKey &&
            idleState.selectedIds.size === 1
        ) {
            const [id] = idleState.selectedIds.values();
            setViewState(goToEditSticker(id));
            return { preventNext: true };
        }
        return {
            preventNext: false,
        };
    };

    return {
        handleNodeClick,
        handleKeyDown,
    };
}
