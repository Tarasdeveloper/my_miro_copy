import { Button } from "@/shared/ui/kit/button";
import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { useNodes } from "./nodes";
import { useViewModel } from "./view-model";
import { Ref, useEffect, useRef } from "react";
import { useCanvasRect } from "./use-canvas-rect";

function useLayoutFocus() {
    const layoutRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (layoutRef.current) {
            layoutRef.current.focus();
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                layoutRef.current?.focus();
            }
        };

        window.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, [layoutRef]);

    return layoutRef;
}

function BoardPage() {
    const { nodes, addSticker } = useNodes();
    const viewModel = useViewModel();
    const focusLayoutRef = useLayoutFocus();
    const { canvasRef, canvasRect } = useCanvasRect();

    console.log(canvasRect);

    return (
        <Layout
            ref={focusLayoutRef}
            onKeyDown={(e) => {
                if (viewModel.viewState.type === "add-sticker") {
                    if (e.key === "Escape") {
                        viewModel.goToIdle();
                    }
                }
                if (viewModel.viewState.type === "idle") {
                    if (e.key === "s") {
                        viewModel.goToAddSticker();
                    }
                }
            }}
        >
            <Dots />
            <Canvas
                ref={canvasRef}
                onClick={(e) => {
                    if (
                        viewModel.viewState.type === "add-sticker" &&
                        canvasRect
                    ) {
                        addSticker({
                            text: "Default",
                            x: e.clientX - canvasRect.x,
                            y: e.clientY - canvasRect.y,
                        });
                        viewModel.goToIdle();
                    }
                }}
            >
                {nodes.map((node) => (
                    <Sticker
                        key={node.id}
                        text={node.text}
                        x={node.x}
                        y={node.y}
                    />
                ))}
            </Canvas>
            <Actions>
                <ActionButton
                    isActive={viewModel.viewState.type === "add-sticker"}
                    onClick={() => {
                        if (viewModel.viewState.type === "add-sticker") {
                            viewModel.goToIdle();
                        } else {
                            viewModel.goToAddSticker();
                        }
                    }}
                >
                    <StickerIcon />
                </ActionButton>
                <ActionButton isActive={false} onClick={() => {}}>
                    <ArrowRightIcon />
                </ActionButton>
            </Actions>
        </Layout>
    );
}

export const Component = BoardPage;

export function Layout({
    children,
    ref,
    ...props
}: {
    children: React.ReactNode;
    ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="grow relative" tabIndex={0} ref={ref} {...props}>
            {children}
        </div>
    );
}

export function Dots() {
    return (
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
    );
}

export function Canvas({
    children,
    ref,
    ...props
}: {
    children: React.ReactNode;
    ref: Ref<HTMLDivElement>;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div ref={ref} {...props} className="absolute inset-0">
            {children}
        </div>
    );
}

export function Sticker({
    text,
    x,
    y,
}: {
    text: string;
    x: number;
    y: number;
}) {
    return (
        <div
            className="absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            {text}
        </div>
    );
}

export function Actions({ children }: { children: React.ReactNode }) {
    return (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-1 rounded-md shadow">
            {children}
        </div>
    );
}

export function ActionButton({
    children,
    isActive,
    onClick,
}: {
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={
                isActive
                    ? "bg-blue-500/30 hover:bg-blue-600/30 text-blue-500 hover:text-blue-600"
                    : ""
            }
            onClick={onClick}
        >
            {children}
        </Button>
    );
}
