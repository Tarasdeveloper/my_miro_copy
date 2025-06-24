import { useBoardsList } from "./model/use-boards-list";
import { useDeleteBoard } from "./model/use-delete-board";
import { useUpdateFavorite } from "./model/use-update-favorite";
import {
  BoardsListLayout,
  BoardsListLayoutContent,
  BoardsListLayoutHeader,
} from "./ui/boards-list-layout";
import { ViewMode, ViewModeToggle } from "./ui/view-mode-toggle";
import { useState } from "react";
import { BoardsListCard } from "./ui/boards-list-card";
import { BoardsFavoriteToggle } from "./ui/boards-favorite-toggle";
import { Button } from "@/shared/ui/kit/button";
import { BoardsListItem } from "./ui/boards-list-item";

function BoardsListPage() {
  const boardsQuery = useBoardsList({
    isFavorite: true,
  });

  const deleteBoard = useDeleteBoard();
  const updateFavorite = useUpdateFavorite();

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const boards = boardsQuery.boards.filter((board) =>
    updateFavorite.isOptimisticFavorite(board),
  );

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
        renderList={() =>
          boards.map((board) => (
            <BoardsListItem
              key={board.id}
              board={board}
              rightTopActions={
                <BoardsFavoriteToggle
                  isFavorite={updateFavorite.isOptimisticFavorite(board)}
                  onToggle={() => updateFavorite.toggle(board)}
                />
              }
              bottomActions={
                <Button
                  variant={"destructive"}
                  disabled={deleteBoard.getIsPending(board.id)}
                  onClick={() => deleteBoard.deleteBoard(board.id)}
                >
                  Удалить
                </Button>
              }
            />
          ))
        }
        renderGrid={() =>
          boards.map((board) => (
            <BoardsListCard
              key={board.id}
              board={board}
              rightTopActions={
                <BoardsFavoriteToggle
                  isFavorite={updateFavorite.isOptimisticFavorite(board)}
                  onToggle={() => updateFavorite.toggle(board)}
                />
              }
              bottomActions={
                <Button
                  variant={"destructive"}
                  disabled={deleteBoard.getIsPending(board.id)}
                  onClick={() => deleteBoard.deleteBoard(board.id)}
                >
                  Удалить
                </Button>
              }
            />
          ))
        }
      />
    </BoardsListLayout>
  );
}

export const Component = BoardsListPage;
