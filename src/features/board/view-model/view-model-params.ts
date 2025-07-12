import { Dispatch, SetStateAction } from "react";
import { CanvasRect } from "../hooks/use-canvas-rect";
import { NodesModel } from "../model/nodes";
import { ViewState } from "./use-view-model";

export type ViewModelParams = {
    setViewState: Dispatch<SetStateAction<ViewState>>;
    nodesModel: NodesModel;
    canvasRect: CanvasRect | undefined;
};
