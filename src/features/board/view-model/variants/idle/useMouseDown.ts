import { MouseEvent } from "react";
import { IdleViewState } from ".";
import { ViewModelParams } from "../../view-model-params";
import { pointOnScreenToCanvas } from "@/features/board/domain/screen-to-canvas";

export function useMouseDown({ setViewState, canvasRect }: ViewModelParams) {
    const handleOverlayMouseDown = (
        idleState: IdleViewState,
        e: MouseEvent<HTMLDivElement>,
    ) => {
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
    };
    const handleWindowMouseUp = (idleState: IdleViewState) => {
        setViewState({
            ...idleState,
            mouseDown: undefined,
        });
    };
    return {
        handleOverlayMouseDown,
        handleWindowMouseUp,
    };
}
