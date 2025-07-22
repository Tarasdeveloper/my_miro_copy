import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import { ViewModelParams } from "../../view-model-params";
import { IdleViewState } from ".";
import { distanceFromPoints } from "@/features/board/domain/point";

export function useGoToNodesDragging(params: ViewModelParams) {
    const { canvasRect } = params;

    const handleIdleWindowMouseMove = (
        idleState: IdleViewState,
        e: MouseEvent,
    ) => {
        if (idleState.mouseDown && idleState.mouseDown.type === "node") {
            const currentPoint = pointOnScreenToCanvas(
                {
                    x: e.clientX,
                    y: e.clientY,
                },
                canvasRect,
            );

            if (distanceFromPoints(idleState.mouseDown, currentPoint) > 5) {
                console.log("Dragging nodes");
            }
        }
    };
    return {
        handleIdleWindowMouseMove,
    };
}
