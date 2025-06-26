import { useBoardsList } from "./model/use-boards-list";
import {
  BoardsListLayout,
  BoardsListLayoutCard,
  BoardsListLayoutContent,
  BoardsListLayoutContentGroups,
  BoardsListLayoutHeader,
  BoardsListLayoutList,
} from "./ui/boards-list-layout";
import { ViewMode, ViewModeToggle } from "./ui/view-mode-toggle";
import { useState } from "react";
import { useRecentGroups } from "./model/use-recent-groups";
import { BoardItem } from "./compose/board-item";
import { BoardCard } from "./compose/board-card";
import { BoardsSidebar } from "./ui/boards-sidebar";

function BoardsListPage() {
  const boardsQuery = useBoardsList({
    sort: "lastOpenedAt",
  });

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const recentGroups = useRecentGroups(boardsQuery.boards);

  return (
    <BoardsListLayout
      sidebar={<BoardsSidebar />}
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
            list: (
              <BoardsListLayoutList>
                {group.items.map((board) => (
                  <BoardItem board={board} />
                ))}
              </BoardsListLayoutList>
            ),
            cards: (
              <BoardsListLayoutCard>
                {group.items.map((board) => (
                  <BoardCard board={board} />
                ))}
              </BoardsListLayoutCard>
            ),
          }[viewMode],
          title: group.title,
        }))}
      />
    </BoardsListLayout>
  );
}

export const Component = BoardsListPage;
