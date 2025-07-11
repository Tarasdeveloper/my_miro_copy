import { NodesModel } from "../model/nodes";
import { CanvasRect } from "../hooks/use-canvas-rect";
import { ViewStateModel } from "../model/view-state";
import { useAddStickerViewModel } from "./variants/add-sticker";
import { useIdleViewModel } from "./variants/idle";

type ViewModelNode = {
    id: string;
    text: string;
    x: number;
    y: number;
    isSelected?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type ViewModel = {
    nodes: ViewModelNode[];
    layout?: {
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    };
    canvas?: {
        onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    };
    actions?: {
        addSticker?: {
            onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
            isActive?: boolean;
        };
    };
};

export type ViewModelParams = {
    viewStateModel: ViewStateModel;
    nodesModel: NodesModel;
    canvasRect: CanvasRect | undefined;
};

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
