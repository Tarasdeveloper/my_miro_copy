import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";

export type SelectionWindowViewState = {
    type: "selection-window";
};

export function useSelectionWindowViewModel({
    nodesModel,
    canvasRect,
    setViewState,
}: ViewModelParams) {
    return (): ViewModel => {
        return {
            selectionWindow: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            nodes: nodesModel.nodes,
        };
    };
}

export function goToSelectionWindow(): SelectionWindowViewState {
    return {
        type: "selection-window",
    };
}
