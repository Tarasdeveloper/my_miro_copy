import { Rect } from "../domain/rect";
import { WindowPosition } from "../model/window-position";

type ViewModelNode = {
    id: string;
    text: string;
    x: number;
    y: number;
    isSelected?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isEditing?: boolean;
    onTextChange?: (text: string) => void;
    onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseUp?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type ViewModel = {
    nodes: ViewModelNode[];
    selectionWindow?: Rect;
    windowPosition?: WindowPosition;
    layout?: {
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    };
    canvas?: {
        onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    };
    overlay?: {
        onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
        onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
        onMouseUp?: (e: React.MouseEvent<HTMLDivElement>) => void;
    };
    window?: {
        onMouseUp?: (e: MouseEvent) => void;
        onMouseMove?: (e: MouseEvent) => void;
    };
    actions?: {
        addSticker?: {
            onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
            isActive?: boolean;
        };
    };
};
