import clsx from "clsx";
import React, { Ref } from "react";

export function Sticker({
    text,
    x,
    y,
    onClick,
    ref,
    selected,
}: {
    ref: Ref<HTMLButtonElement>;
    text: string;
    x: number;
    y: number;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    selected?: boolean;
}) {
    return (
        <button
            ref={ref}
            className={clsx(
                "absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md",
                selected && "outline-2 outline-blue-500",
            )}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            onClick={onClick}
        >
            {text}
        </button>
    );
}
