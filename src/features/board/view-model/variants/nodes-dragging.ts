import { Point } from "../../domain/point";
import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type NodesDraggingiewState = {
    type: "nodes-dragging";
    startPoint: Point;
    endPoint: Point;
    nodesToMove: Set<string>;
};

export function useNodesDraggingViewModel({
    nodesModel,
    canvasRect,
    setViewState,
}: ViewModelParams) {
    const getNodes = (state: NodesDraggingiewState) =>
        nodesModel.nodes.map((node) => {
            if (state.nodesToMove.has(node.id)) {
                return {
                    ...node,
                    isSelected: true,
                };
            }
            return node;
        });

    return (state: NodesDraggingiewState): ViewModel => {
        const nodes = getNodes(state);

        return {
            nodes,
            window: {
                onMouseMove: (e) => {
                    const currentPoint = pointOnScreenToCanvas(
                        {
                            x: e.clientX,
                            y: e.clientY,
                        },
                        canvasRect,
                    );
                    setViewState({
                        ...state,
                        endPoint: currentPoint,
                    });
                },
                onMouseUp: () => {
                    setViewState(
                        goToIdle({
                            selectedIds: state.nodesToMove,
                        }),
                    );
                },
            },
        };
    };
}

export function goToNodesDragging({
    startPoint,
    endPoint,
    nodesToMove,
}: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    nodesToMove: Set<string>;
}): NodesDraggingiewState {
    return {
        type: "nodes-dragging",
        startPoint,
        endPoint,
        nodesToMove,
    };
}
