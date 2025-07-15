import { RefCallback, useCallback, useEffect, useRef, useState } from "react";

export type NodeRect = {
    width: number;
    height: number;
};

export type NodeRectsMap = Record<string, NodeRect>;

export const useNodesRects = () => {
    const [nodesRect, setNodesRect] = useState<NodeRect>();

    const resizeObserverRef = useRef<ResizeObserver | undefined>(undefined);

    const nodeRef: RefCallback<HTMLElement> = useCallback((el) => {
        if (!resizeObserverRef.current) {
            resizeObserverRef.current = new ResizeObserver((entries) => {
                console.log(entries);
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                }
            });
        }

        const resizeObserver = resizeObserverRef.current;

        if (el) {
            resizeObserver.observe(el);
            return () => {
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

    return { nodeRef, nodesRect };
};
