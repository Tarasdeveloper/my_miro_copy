import { ViewModelParams } from "../view-model-params";
import { ViewModel } from "../view-model-type";
import { goToIdle } from "./idle";

export type EditStickerViewState = {
    type: "edit-sticker";
    stickerId: string;
    newText?: string;
};

export function useEditStickerViewModel({
    nodesModel,
    setViewState,
}: ViewModelParams) {
    return (viewState: EditStickerViewState): ViewModel => ({
        nodes: nodesModel.nodes.map((node) => {
            if (node.id === viewState.stickerId) {
                return {
                    ...node,
                    isSelected: true,
                    isEditing: true,
                    text: viewState.newText ?? node.text,
                    onTextChange: (text) => {
                        setViewState({
                            ...viewState,
                            newText: text,
                        });
                    },
                };
            }
            return node;
        }),
        layout: {
            onKeyDown: (e) => {
                if (e.key === "Escape") {
                    setViewState(goToIdle());
                }
                if (e.key === "Enter") {
                    if (viewState.newText) {
                        nodesModel.updateStickerText(
                            viewState.stickerId,
                            viewState.newText,
                        );
                    }
                    setViewState(goToIdle());
                }
            },
        },
        overlay: {
            onClick: () => setViewState(goToIdle()),
        },
    });
}

export function goToEditSticker(stickerId: string): EditStickerViewState {
    return {
        type: "edit-sticker",
        stickerId,
    };
}
