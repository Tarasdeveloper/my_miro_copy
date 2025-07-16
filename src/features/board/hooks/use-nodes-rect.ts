import { RefCallback, useCallback, useEffect, useRef, useState } from "react";

export type NodeRect = {
    width: number;
    height: number;
};

export type NodeRectsMap = Record<string, NodeRect>;

export const useNodesRects = () => {
    const [nodesRect, setNodesRect] = useState<NodeRect>();

    const resizeObserverRef = useRef<ResizeObserver | undefined>(undefined);

    const nodeRef: RefCallback<Element> = useCallback((el) => {
        if (!resizeObserverRef.current) {
            resizeObserverRef.current = new ResizeObserver((entries) => {
                const nodesToUpdate = Object.fromEntries(
                    entries
                        .map((entry) => [
                            (entry.target as HTMLElement).dataset.id,
                            {
                                width: entry.contentRect.width,
                                height: entry.contentRect.height,
                            },
                        ])
                        .filter((entry) => !!entry[0]),
                );

                setNodesRect((prev) => ({
                    ...prev,
                    ...nodesToUpdate,
                }));
            });
        }

        const resizeObserver = resizeObserverRef.current;

        if (el) {
            resizeObserver.observe(el);
            return () => {
                setNodesRect((prev) => {
                    const newNodesRect = { ...prev };
                    delete newNodesRect[(el as HTMLElement).dataset.id ?? ""];
                    return newNodesRect;
                });
                resizeObserver.unobserve(el);
            };
        }
    }, []);

    useEffect(
        () => () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        },
        [],
    );

    console.log("nodesRect", nodesRect);

    return { nodeRef, nodesRect };
};
