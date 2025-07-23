import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import { ViewModelParams } from "../../view-model-params";
import { IdleViewState } from ".";
import { distanceFromPoints } from "@/features/board/domain/point";
import { goToWindowDragging } from "../window-dragging";

export function useGoToWindowDragging({
    canvasRect,
    setViewState,
    windowPositionModel,
}: ViewModelParams) {
    const handleIdleWindowMouseMove = (
        idleState: IdleViewState,
        e: MouseEvent,
    ) => {
        if (idleState.mouseDown && idleState.mouseDown.isRigthClick) {
            const currentPoint = pointOnScreenToCanvas(
                {
                    x: e.clientX,
                    y: e.clientY,
                },
                windowPositionModel.position,
                canvasRect,
            );

            if (distanceFromPoints(idleState.mouseDown, currentPoint) > 5) {
                setViewState(
                    goToWindowDragging({
                        startPoint: idleState.mouseDown,
                        endPoint: currentPoint,
                    }),
                );
            }
        }
    };
    return {
        handleIdleWindowMouseMove,
    };
}
