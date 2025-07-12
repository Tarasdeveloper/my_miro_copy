import { useAddStickerViewModel } from "./variants/add-sticker";
import { useIdleViewModel } from "./variants/idle";
import { ViewModel } from "./view-model-type";
import { ViewModelParams } from "./view-model-params";

export function useViewModel(params: ViewModelParams) {
    const addStickerViewModel = useAddStickerViewModel(params);
    const idleViewModel = useIdleViewModel(params);

    let viewModel: ViewModel;

    switch (params.viewStateModel.viewState.type) {
        case "add-sticker":
            viewModel = addStickerViewModel();
            break;
        case "idle": {
            viewModel = idleViewModel(params.viewStateModel.viewState);
            break;
        }
        default:
            throw new Error("Invalid view state");
    }

    return viewModel;
}
