import { WindowPosition } from "../model/window-position";

export function pointOnScreenToCanvas(
    point: { x: number; y: number },
    windowPosition: WindowPosition,
    canvasRect?: {
        x: number;
        y: number;
    },
) {
    if (!canvasRect) return point;
    return {
        x: point.x - canvasRect.x - windowPosition.x,
        y: point.y - canvasRect.y - windowPosition.y,
    };
}
