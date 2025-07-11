import { IdleViewState } from "../../model/view-state";
import { ViewModel, ViewModelParams } from "../use-view-model";

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
        actions: {
            addSticker: {
                isActive: false,
                onClick: () => viewStateModel.goToAddSticker(),
            },
        },
    });
}
