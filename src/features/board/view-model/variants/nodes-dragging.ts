import { Point, vectorFromPoints } from "../../domain/point";
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
    windowPositionModel,
}: ViewModelParams) {
    const getNodes = (state: NodesDraggingiewState) =>
        nodesModel.nodes.map((node) => {
            if (state.nodesToMove.has(node.id)) {
                const diff = vectorFromPoints(state.startPoint, state.endPoint);

                return {
                    ...node,
                    x: node.x + diff.x,
                    y: node.y + diff.y,
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
                        windowPositionModel.position,
                        canvasRect,
                    );
                    setViewState({
                        ...state,
                        endPoint: currentPoint,
                    });
                },
                onMouseUp: () => {
                    const nodesToMove = nodes.filter((node) =>
                        state.nodesToMove.has(node.id),
                    );
                    nodesModel.updateNodesPositions(nodesToMove);

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
