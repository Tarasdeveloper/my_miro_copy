import { Selection } from "../../../domain/selection";
import { ViewModelParams } from "../../view-model-params";
import { ViewModel } from "../../view-model-type";
import { useSelection } from "./use-selection";
import { useDeleteSelected } from "./useDeleteSelected";
import { useGoToAddSticker } from "./useGoToAddSticker";
import { useGoToEditSticker } from "./useGoToEditSticker";
import { useMouseDown } from "./useMouseDown";
import { useGoToSelectionWindow } from "./useGoToSelectionWindow";
import { useGoToNodesDragging } from "./useGoToNodesDragging";

export type IdleViewState = {
    type: "idle";
    selectedIds: Set<string>;
    mouseDown?:
        | {
              type: "overlay";
              x: number;
              y: number;
          }
        | {
              type: "node";
              x: number;
              y: number;
              nodeId: string;
          };
};

export function useIdleViewModel(params: ViewModelParams) {
    const { nodesModel } = params;

    const deleteSelected = useDeleteSelected(params);
    const goToEditSticker = useGoToEditSticker(params);
    const goToAddSticker = useGoToAddSticker(params);
    const goToSelectionWindow = useGoToSelectionWindow(params);
    const goToNodesDragging = useGoToNodesDragging(params);
    const selection = useSelection(params);
    const mouseDown = useMouseDown(params);

    return (idleState: IdleViewState): ViewModel => ({
        nodes: nodesModel.nodes.map((node) => ({
            ...node,
            isSelected: selection.isSelected(idleState, node.id),
            onMouseDown: (e) =>
                mouseDown.handleNodeMouseDown(idleState, node.id, e),
            onMouseUp: (e) => {
                if (!mouseDown.getIsStickerMouseDown(idleState, node.id))
                    return;
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
            onMouseMove: (e) => {
                goToNodesDragging.handleIdleWindowMouseMove(idleState, e);
                goToSelectionWindow.handleIdleWindowMouseMove(idleState, e);
            },
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
