import { Ref } from "react";
import { Point, vectorFromPoints } from "../../domain/point";
import clsx from "clsx";

export function Arrow({
    start,
    end,
    ref,
    onClick,
    onMouseDown,
    onMouseUp,
    isSelected,
}: {
    start: Point;
    end: Point;
    ref: Ref<SVGPathElement>;
    isSelected?: boolean;
    onClick?: (e: React.MouseEvent<SVGPathElement>) => void;
    onMouseDown?: (e: React.MouseEvent<SVGPathElement>) => void;
    onMouseUp?: (e: React.MouseEvent<SVGPathElement>) => void;
}) {
    const diff = vectorFromPoints(start, end);
    const angle = Math.atan2(diff.y, diff.x);
    const arrowRightAngle = angle + Math.PI * (1 - 1 / 6);
    const arrowLeftAngle = angle - Math.PI * (1 - 1 / 6);
    const arrowRightDiff = [
        Math.cos(arrowRightAngle) * 10,
        Math.sin(arrowRightAngle) * 10,
    ];
    const arrowLeftDiff = [
        Math.cos(arrowLeftAngle) * 10,
        Math.sin(arrowLeftAngle) * 10,
    ];

    return (
        <svg className="absolute left-0 top-0 pointer-events-none overflow-visible">
            <path
                className={clsx(
                    "pointer-events-auto",
                    isSelected && "stroke-blue-500 stroke-2 fill-blue-500",
                )}
                stroke="black"
                ref={ref}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={onClick}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                d={`
                    M ${start.x} ${start.y} L ${end.x} ${end.y}
                    M ${end.x} ${end.y} L ${end.x + arrowRightDiff[0]} ${
                        end.y + arrowRightDiff[1]
                    } L ${end.x + -5 * Math.cos(angle)} ${
                        end.y + -5 * Math.sin(angle)
                    }
                    L ${end.x + arrowLeftDiff[0]} ${end.y + arrowLeftDiff[1]} 
                    L ${end.x} ${end.y}
                   `}
            />
        </svg>
    );
}
