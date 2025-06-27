import { distanceFromPoints } from "@/features/board/domain/point";
import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";
import { goToSelectionWindow } from "../selection-window";

export function useGoToSelectionWindow({
  setViewState,
  canvasRect,
  windowPositionModel,
}: ViewModelParams) {
  const handleWindowMouseMove = (idleState: IdleViewState, e: MouseEvent) => {
    if (
      idleState.mouseDown &&
      idleState.mouseDown.type === "overlay" &&
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
          goToSelectionWindow({
            startPoint: idleState.mouseDown,
            endPoint: currentPoint,
            initialSelectedIds: e.shiftKey ? idleState.selectedIds : undefined,
          }),
        );
      }
    }
  };

  return {
    handleWindowMouseMove,
  };
}
