import { useBoardsList } from "./model/use-boards-list";
import {
  BoardsListLayout,
  BoardsListLayoutContent,
  BoardsListLayoutContentGroups,
  BoardsListLayoutHeader,
} from "./ui/boards-list-layout";
import { ViewMode, ViewModeToggle } from "./ui/view-mode-toggle";
import { useState } from "react";
import { useRecentGroups } from "./model/use-recent-groups";
import { BoardItem } from "./compose/board-item";
import { BoardCard } from "./compose/board-card";

function BoardsListPage() {
  const boardsQuery = useBoardsList({
    sort: "lastOpenedAt",
  });

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const recentGroups = useRecentGroups(boardsQuery.boards);

  return (
    <BoardsListLayout
      header={
        <BoardsListLayoutHeader
          title="Последние доски"
          description="Здесь вы можете просматривать и управлять своими досками"
          actions={<ViewModeToggle value={viewMode} onChange={setViewMode} />}
        />
      }
    >
      <BoardsListLayoutContent
        isEmpty={boardsQuery.boards.length === 0}
        isPending={boardsQuery.isPending}
        isPendingNext={boardsQuery.isFetchingNextPage}
        cursorRef={boardsQuery.cursorRef}
        hasCursor={boardsQuery.hasNextPage}
        mode={viewMode}
      />
      <BoardsListLayoutContentGroups
        groups={recentGroups.map((group) => ({
          items: {
            list: group.items.map((board) => <BoardItem board={board} />),
            cards: group.items.map((board) => <BoardCard board={board} />),
          }[viewMode],
          title: group.title,
        }))}
      />
    </BoardsListLayout>
  );
}

export const Component = BoardsListPage;
