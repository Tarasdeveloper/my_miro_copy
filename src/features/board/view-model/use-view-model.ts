import {
    AddStickerViewState,
    useAddStickerViewModel,
} from "./variants/add-sticker";
import { goToIdle, IdleViewState, useIdleViewModel } from "./variants/idle";
import { ViewModel } from "./view-model-type";
import { ViewModelParams } from "./view-model-params";
import { useState } from "react";
import {
    SelectionWindowViewState,
    useSelectionWindowViewModel,
} from "./variants/selection-window";
import {
    EditStickerViewState,
    useEditStickerViewModel,
} from "./variants/edit-sticker";
import {
    NodesDraggingiewState,
    useNodesDraggingViewModel,
} from "./variants/nodes-dragging";
import {
    useWindowDraggingViewModel,
    WindowDraggingViewState,
} from "./variants/window-dragging";
import { useZoomDecorator } from "./decorator/zoom";
import { AddArrowViewState, useAddArrowViewModel } from "./variants/add-arrow";
import { useCommonActionsDecorator } from "./decorator/common-actions";

export type ViewState =
    | AddArrowViewState
    | AddStickerViewState
    | EditStickerViewState
    | IdleViewState
    | SelectionWindowViewState
    | NodesDraggingiewState
    | WindowDraggingViewState;

export function useViewModel(params: Omit<ViewModelParams, "setViewState">) {
    const [viewState, setViewState] = useState<ViewState>(() => goToIdle());

    const newParams = {
        ...params,
        setViewState,
    };

    const addArrowViewModel = useAddArrowViewModel(newParams);
    const addStickerViewModel = useAddStickerViewModel(newParams);
    const editStickerViewModel = useEditStickerViewModel(newParams);
    const idleViewModel = useIdleViewModel(newParams);
    const selectionWindowViewModel = useSelectionWindowViewModel(newParams);
    const nodesDraggingViewModel = useNodesDraggingViewModel(newParams);
    const windowDraggingViewModel = useWindowDraggingViewModel(newParams);

    const zoomDecorator = useZoomDecorator(newParams);
    const commonActionsDecorator = useCommonActionsDecorator(newParams);

    let viewModel: ViewModel;

    switch (viewState.type) {
        case "idle": {
            viewModel = commonActionsDecorator(idleViewModel(viewState));
            break;
        }
        case "add-arrow": {
            viewModel = commonActionsDecorator(addArrowViewModel());
            break;
        }
        case "add-sticker": {
            viewModel = commonActionsDecorator(addStickerViewModel());
            break;
        }
        case "edit-sticker": {
            viewModel = editStickerViewModel(viewState);
            break;
        }
        case "selection-window": {
            viewModel = selectionWindowViewModel(viewState);
            break;
        }
        case "nodes-dragging": {
            viewModel = nodesDraggingViewModel(viewState);
            break;
        }
        case "window-dragging": {
            viewModel = windowDraggingViewModel(viewState);
            break;
        }
        default:
            throw new Error("Invalid view state");
    }

    return zoomDecorator(viewModel);
}
