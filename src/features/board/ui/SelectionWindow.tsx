import { Rect } from "../domain/rect";

export function SelectionWindow({ x, y, height, width }: Rect) {
    return (
        <div
            className="absolute inset-0 bg-blue-500/30 border border-blue-500"
            style={{
                transform: `translate(${x}px, ${y}px)`,
                height: height,
                width: width,
            }}
        ></div>
    );
}
