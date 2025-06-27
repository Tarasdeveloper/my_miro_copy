import { distanceFromPoints } from "@/features/board/domain/point";
import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";
import { goToNodesDragging } from "../nodes-dragging";

export function useGoToNodesDragging({
  canvasRect,
  setViewState,
  windowPositionModel,
}: ViewModelParams) {
  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    if (
      idleState.mouseDown &&
      idleState.mouseDown.type === "node" &&
      !idleState.mouseDown.isRightClick
    ) {
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
          goToNodesDragging({
            startPoint: idleState.mouseDown,
            endPoint: currentPoint,
            nodesToMove: new Set([
              ...idleState.selectedIds,
              idleState.mouseDown.nodeId,
            ]),
          }),
        );
      }
    }
  };

  return {
    handleWindowMouseMove,
  };
}
