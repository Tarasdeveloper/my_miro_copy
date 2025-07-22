import { Selection } from "../../../domain/selection";
import { ViewModelParams } from "../../view-model-params";
import { ViewModel } from "../../view-model-type";
import { useSelection } from "./use-selection";
import { useDeleteSelected } from "./useDeleteSelected";
import { useGoToAddSticker } from "./useGoToAddSticker";
import { useGoToEditSticker } from "./useGoToEditSticker";
import { useMouseDown } from "./useMouseDown";
import { useGoToSelectionWindow } from "./useGoToSelectionWindow";

export type IdleViewState = {
    type: "idle";
    selectedIds: Set<string>;
    mouseDown?: {
        x: number;
        y: number;
    };
};

export function useIdleViewModel(params: ViewModelParams) {
    const { nodesModel } = params;

    const deleteSelected = useDeleteSelected(params);
    const goToEditSticker = useGoToEditSticker(params);
    const goToAddSticker = useGoToAddSticker(params);
    const goToSelectionWindow = useGoToSelectionWindow(params);
    const selection = useSelection(params);
    const mouseDown = useMouseDown(params);

    return (idleState: IdleViewState): ViewModel => ({
        nodes: nodesModel.nodes.map((node) => ({
            ...node,
            isSelected: selection.isSelected(idleState, node.id),
            onClick: (e) => {
                const clickResult = goToEditSticker.handleNodeClick(
                    idleState,
                    node.id,
                    e,
                );
                if (clickResult.preventNext) return;
                selection.handleNodeClick(idleState, node.id, e);
            },
        })),
        layout: {
            onKeyDown: (e) => {
                const keyDounResult = goToEditSticker.handleKeyDown(
                    idleState,
                    e,
                );
                if (keyDounResult.preventNext) return;

                deleteSelected.handleKeyDown(idleState, e);
                goToAddSticker.handleKeyDown(e);
            },
        },
        overlay: {
            onMouseDown: (e) => mouseDown.handleOverlayMouseDown(idleState, e),
            onMouseUp: () => selection.handleOverlayMouseUp(idleState),
        },
        window: {
            onMouseMove: (e) =>
                goToSelectionWindow.handleIdleWindowMouseMove(idleState, e),
            onMouseUp: () => mouseDown.handleWindowMouseUp(idleState),
        },
        actions: {
            addSticker: {
                isActive: false,
                onClick: goToAddSticker.handleActionClick,
            },
        },
    });
}

export function goToIdle({
    selectedIds,
}: {
    selectedIds?: Selection;
} = {}): IdleViewState {
    return {
        type: "idle",
        selectedIds: selectedIds ?? new Set(),
    };
}
