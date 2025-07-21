import { KeyboardEvent } from "react";
import { ViewModelParams } from "../../view-model-params";
import { goToAddSticker } from "../add-sticker";

export function useGoToAddSticker(params: ViewModelParams) {
    const { setViewState } = params;
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "s") {
            setViewState(goToAddSticker());
        }
    };
    const handleActionClick = () => {
        setViewState(goToAddSticker());
    };
    return {
        handleKeyDown,
        handleActionClick,
    };
}
