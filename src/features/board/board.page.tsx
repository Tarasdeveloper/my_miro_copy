import { PathParams, ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { ArrowRightIcon, StickerIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

type NodeBase = {
  id: string;
  type: string;
};

type StickerNode = NodeBase & {
  type: "sticker";
  text: string;
  x: number;
  y: number;
};

type Node = StickerNode;

function useNodes() {
  const [nodes] = useState<Node[]>([
    {
      id: "1",
      type: "sticker",
      text: "hello",
      x: 100,
      y: 100,
    },
    {
      id: "2",
      type: "sticker",
      text: "hello",
      x: 200,
      y: 200,
    },
  ]);
  return {
    nodes,
  };
}

function BoardPage() {
  const params = useParams<PathParams[typeof ROUTES.BOARD]>();
  return (
    <Layout>
      <Dots />
      <Canvas>
        <Sticker text="Hello" x={100} y={100} />
        <Sticker text="Hello" x={200} y={200} />
      </Canvas>
      <Actions>
        <ActionButton isActive={false} onClick={() => {}}>
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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow relative" tabIndex={0}>
      {children}
    </div>
  );
}

function Dots() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
  );
}

function Canvas({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className="absolute inset-0">
      {children}
    </div>
  );
}

function Sticker({ text, x, y }: { text: string; x: number; y: number }) {
  return (
    <div
      className="absolute bg-yellow-300 px-2 py-4 rounded-xs shadow-md"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {text}
    </div>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-1 rounded-md shadow">
      {children}
    </div>
  );
}

function ActionButton({
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
