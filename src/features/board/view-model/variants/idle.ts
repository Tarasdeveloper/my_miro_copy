import { SelectionModifier, selectItems } from "../../domain/selection";
import { CanvasRect } from "../../hooks/use-canvas-rect";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToAddSticker } from "./add-sticker";

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
        selectionWindow: {
            x: 100,
            y: 100,
            width: 500,
            height: 100,
        },
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
            onClick: () => {
                select(idleState, [], "replace");
            },
            onMouseDown: (e) => {
                if (!canvasRect) return;
                setViewState({
                    ...idleState,
                    mouseDown: {
                        x: e.clientX,
                        y: e.clientY,
                    },
                });
            },
        },
        window: {
            onMouseUp: () => {
                setViewState({
                    ...idleState,
                    mouseDown: undefined,
                });
            },
            onMouseMove: () => {
                if (idleState.mouseDown) {
                    console.log(idleState);
                }
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

export function goToIdle(): IdleViewState {
    return {
        type: "idle",
        selectedIds: new Set(),
    };
}

export function pointOnScreenToCanvas(
    point: { x: number; y: number },
    canvasRect?: CanvasRect,
) {
    if (!canvasRect) return point;
    return {
        x: point.x - canvasRect.x,
        y: point.y - canvasRect.y,
    };
}
