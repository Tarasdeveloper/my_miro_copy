import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { useNodes } from "./model/nodes";
import { useCanvasRect } from "./hooks/use-canvas-rect";
import { useLayoutFocus } from "./hooks/use-layout-focus";
import { useViewModel } from "./view-model/use-view-model";
import { useWindowEvents } from "./hooks/use-window-events";
import { Actions } from "./ui/Actions";
import { Layout } from "./ui/Layout";
import { Dots } from "./ui/Dots";
import { Canvas } from "./ui/Canvas";
import { Overlay } from "./ui/Overlay";
import { Sticker } from "./ui/nodes/Sticker";
import { SelectionWindow } from "./ui/SelectionWindow";
import { ActionButton } from "./ui/ActionButton";
import { useNodesDimensions } from "./hooks/use-nodes-dimensions";
import { useWindowPositionModel } from "./model/window-position";
import { Arrow } from "./ui/nodes/Arrow";

function BoardPage() {
    const nodesModel = useNodes();
    const windowPositionModel = useWindowPositionModel();
    const focusLayoutRef = useLayoutFocus();
    const { canvasRef, canvasRect } = useCanvasRect();
    const { nodeRef, nodesDimensions } = useNodesDimensions();

    const viewModel = useViewModel({
        nodesModel,
        canvasRect,
        nodesDimensions,
        windowPositionModel,
    });

    useWindowEvents(viewModel);

    const windowPosition =
        viewModel.windowPosition ?? windowPositionModel.position;

    return (
        <Layout ref={focusLayoutRef} onKeyDown={viewModel.layout?.onKeyDown}>
            <Dots windowPosition={windowPosition} />
            <Canvas
                ref={canvasRef}
                onClick={viewModel.canvas?.onClick}
                overlay={
                    <Overlay
                        onClick={viewModel.overlay?.onClick}
                        onMouseDown={viewModel.overlay?.onMouseDown}
                        onMouseUp={viewModel.overlay?.onMouseUp}
                    />
                }
                windowPosition={windowPosition}
            >
                {viewModel.nodes.map((node) => {
                    if (node.type === "sticker") {
                        return (
                            <Sticker key={node.id} {...node} ref={nodeRef} />
                        );
                    }
                    if (node.type === "arrow") {
                        return <Arrow key={node.id} {...node} ref={nodeRef} />;
                    }
                })}
                {viewModel.selectionWindow && (
                    <SelectionWindow {...viewModel.selectionWindow} />
                )}
            </Canvas>

            <Actions>
                <ActionButton
                    isActive={viewModel.actions?.addSticker?.isActive}
                    onClick={viewModel.actions?.addSticker?.onClick}
                >
                    <StickerIcon />
                </ActionButton>
                <ActionButton
                    isActive={viewModel.actions?.addArrow?.isActive}
                    onClick={viewModel.actions?.addArrow?.onClick}
                >
                    <ArrowRightIcon />
                </ActionButton>
            </Actions>
        </Layout>
    );
}

export const Component = BoardPage;
