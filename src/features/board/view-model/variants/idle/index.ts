import { MouseEvent } from "react";
import { distanceFromPoints } from "../../../domain/point";
import { pointOnScreenToCanvas } from "../../../domain/screen-to-canvas";
import { Selection } from "../../../domain/selection";
import { ViewModelParams } from "../../view-model-params";
import { ViewModel } from "../../view-model-type";
import { goToAddSticker } from "../add-sticker";
import { goToEditSticker } from "../edit-sticker";
import { goToSelectionWindow } from "../selection-window";
import { useSelection } from "./use-selection";
import { useDeleteSelected } from "./useDeleteSelected";

export type IdleViewState = {
    type: "idle";
    selectedIds: Set<string>;
    mouseDown?: {
        x: number;
        y: number;
    };
};

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
}

export function useGoToAddSticker(params: ViewModelParams) {}

export function useIdleViewModel(params: ViewModelParams) {
    const { nodesModel, setViewState, canvasRect } = params;

    const selection = useSelection(params);
    const deleteSelected = useDeleteSelected(params);

    return (idleState: IdleViewState): ViewModel => ({
        nodes: nodesModel.nodes.map((node) => ({
            ...node,
            isSelected: selection.isSelected(idleState, node.id),
            onClick: (e) => {
                selection.handleNodeClick(idleState, node.id, e);
            },
        })),
        layout: {
            onKeyDown: (e) => {
                if (
                    !e.shiftKey &&
                    !e.altKey &&
                    !e.metaKey &&
                    !e.ctrlKey &&
                    idleState.selectedIds.size === 1
                ) {
                    const [id] = idleState.selectedIds.values();
                    setViewState(goToEditSticker(id));
                    return;
                }

                if (e.key === "s") {
                    setViewState(goToAddSticker());
                }

                deleteSelected.handleKeyDown(idleState, e);
            },
        },
        overlay: {
            onMouseDown: (e) => {
                setViewState({
                    ...idleState,
                    mouseDown: pointOnScreenToCanvas(
                        {
                            x: e.clientX,
                            y: e.clientY,
                        },
                        canvasRect,
                    ),
                });
            },
            onMouseUp: () => selection.handleOverlayMouseUp(idleState),
        },
        window: {
            onMouseMove: (e) => {
                if (idleState.mouseDown) {
                    const currentPoint = pointOnScreenToCanvas({
                        x: e.clientX,
                        y: e.clientY,
                    });

                    if (
                        distanceFromPoints(idleState.mouseDown, currentPoint) >
                        5
                    ) {
                        setViewState(
                            goToSelectionWindow({
                                startPoint: idleState.mouseDown,
                                endPoint: currentPoint,
                                initialSelectedIds: e.shiftKey
                                    ? idleState.selectedIds
                                    : undefined,
                            }),
                        );
                    }
                }
            },
            onMouseUp: () => {
                setViewState({
                    ...idleState,
                    mouseDown: undefined,
                });
            },
        },
        actions: {
            addSticker: {
                isActive: false,
                onClick: () => setViewState(goToAddSticker()),
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
