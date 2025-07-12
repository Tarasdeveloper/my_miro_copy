import {
    AddStickerViewState,
    useAddStickerViewModel,
} from "./variants/add-sticker";
import { IdleViewState, useIdleViewModel } from "./variants/idle";
import { ViewModel } from "./view-model-type";
import { ViewModelParams } from "./view-model-params";
import { useState } from "react";

export type ViewState = AddStickerViewState | IdleViewState;

export function useViewModel(params: Omit<ViewModelParams, "setViewState">) {
    const [viewState, setViewState] = useState<ViewState>({
        type: "idle",
        selectedIds: new Set(),
    });

    const newParams = {
        ...params,
        setViewState,
    };

    const addStickerViewModel = useAddStickerViewModel(newParams);
    const idleViewModel = useIdleViewModel(newParams);

    let viewModel: ViewModel;

    switch (viewState.type) {
        case "add-sticker":
            viewModel = addStickerViewModel();
            break;
        case "idle": {
            viewModel = idleViewModel(viewState);
            break;
        }
        default:
            throw new Error("Invalid view state");
    }

    return viewModel;
}
