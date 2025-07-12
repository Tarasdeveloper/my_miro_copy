import { IdleViewState } from "../../model/view-state";
import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";

export function useIdleViewModel({
    viewStateModel,
    nodesModel,
}: ViewModelParams) {
    return (idleState: IdleViewState): ViewModel => ({
        nodes: nodesModel.nodes.map((node) => ({
            ...node,
            isSelected: idleState.selectedIds.has(node.id),
            onClick: (e) => {
                if (e.ctrlKey || e.shiftKey) {
                    viewStateModel.selection([node.id], "toggle");
                } else {
                    viewStateModel.selection([node.id], "replace");
                }
            },
        })),
        layout: {
            onKeyDown: (e) => {
                if (e.key === "s") {
                    viewStateModel.goToAddSticker();
                }
            },
        },
        overlay: {
            onClick: () => {
                viewStateModel.selection([], "replace");
            },
        },
        actions: {
            addSticker: {
                isActive: false,
                onClick: () => viewStateModel.goToAddSticker(),
            },
        },
    });
}
