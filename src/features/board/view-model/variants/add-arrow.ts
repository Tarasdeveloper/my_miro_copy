import { pointOnScreenToCanvas } from "../../domain/screen-to-canvas";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToDrawArrow } from "./draw-arrow";
import { goToIdle } from "./idle";

export type AddArrowViewState = {
    type: "add-arrow";
};

export function useAddArrowViewModel({
    nodesModel,
    setViewState,
    windowPositionModel,
    canvasRect,
}: ViewModelParams) {
    return (): ViewModel => ({
        nodes: nodesModel.nodes.map((node) => {
            if (node.type === "sticker") {
                return {
                    ...node,
                    onMouseDown: (e: React.MouseEvent) =>
                        setViewState(
                            goToDrawArrow(
                                pointOnScreenToCanvas(
                                    {
                                        x: e.clientX,
                                        y: e.clientY,
                                    },
                                    windowPositionModel.position,
                                    canvasRect,
                                ),
                            ),
                        ),
                };
            }
            return node;
        }),
        layout: {
            onKeyDown: (e) => {
                if (e.key === "Escape") {
                    setViewState(goToIdle());
                }
            },
        },
        overlay: {
            onMouseDown: (e) =>
                setViewState(
                    goToDrawArrow(
                        pointOnScreenToCanvas(
                            { x: e.clientX, y: e.clientY },
                            windowPositionModel.position,
                            canvasRect,
                        ),
                    ),
                ),
        },
        actions: {
            addArrow: {
                isActive: true,
                onClick: () => setViewState(goToIdle()),
            },
        },
    });
}

export function goToAddArrow(): AddArrowViewState {
    return {
        type: "add-arrow",
    };
}
