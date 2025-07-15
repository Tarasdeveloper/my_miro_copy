import { distanceFromPoints } from "../../domain/point";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";
import {
    Selection,
    SelectionModifier,
    selectItems,
} from "../../domain/selection";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToAddSticker } from "./add-sticker";
import { goToSelectionWindow } from "./selection-window";

export type IdleViewState = {
    type: "idle";
    selectedIds: Set<string>;
    mouseDown?: {
        x: number;
        y: number;
    };
};

export function useIdleViewModel({
    nodesModel,
    canvasRect,
    setViewState,
}: ViewModelParams) {
    const select = (
        lastState: IdleViewState,
        ids: string[],
        modif: SelectionModifier,
    ) => {
        setViewState({
            ...lastState,
            selectedIds: selectItems(lastState.selectedIds, ids, modif),
        });
    };

    return (idleState: IdleViewState): ViewModel => ({
        nodes: nodesModel.nodes.map((node) => ({
            ...node,
            isSelected: idleState.selectedIds.has(node.id),
            onClick: (e) => {
                if (e.ctrlKey || e.shiftKey) {
                    select(idleState, [node.id], "toggle");
                } else {
                    select(idleState, [node.id], "replace");
                }
            },
        })),
        layout: {
            onKeyDown: (e) => {
                if (e.key === "s") {
                    setViewState(goToAddSticker());
                }
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
            onMouseUp: () => {
                if (idleState.mouseDown) {
                    setViewState({
                        ...idleState,
                        selectedIds: selectItems(
                            idleState.selectedIds,
                            [],
                            "replace",
                        ),
                    });
                }
            },
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
