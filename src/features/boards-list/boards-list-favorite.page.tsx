import { useBoardsList } from "./model/use-boards-list";
import { useDeleteBoard } from "./model/use-delete-board";
import { useUpdateFavorite } from "./model/use-update-favorite";
import {
  BoardsListCardsLayout,
  BoardsListLayout,
  BoardsListLayoutContent,
  BoardsListLayoutHeader,
  BoardsListListLayout,
} from "./ui/boards-list-layout";
import { ViewMode, ViewModeToggle } from "./ui/view-mode-toggle";
import { useState } from "react";
import { BoardsListCard } from "./ui/boards-list-card";

function BoardsListPage() {
  const boardsQuery = useBoardsList({
    isFavorite: true,
  });

  const deleteBoard = useDeleteBoard();
  const updateFavorite = useUpdateFavorite();

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <BoardsListLayout
      header={
        <BoardsListLayoutHeader
          title="Избранные доски"
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
      >
        {viewMode === "list" ? (
          <BoardsListListLayout>
            {boardsQuery.boards.map((board) => (
              <BoardsListCard
                key={board.id}
                board={board}
                isFavorite={updateFavorite.isOptimisticFavorite(board)}
                onFavoriteToggle={() => updateFavorite.toggle(board)}
                onDelete={() => deleteBoard.deleteBoard(board.id)}
                isDeletePending={deleteBoard.getIsPending(board.id)}
              />
            ))}
          </BoardsListListLayout>
        ) : (
          <BoardsListCardsLayout>
            {boardsQuery.boards.map((board) => (
              <BoardsListCard
                key={board.id}
                board={board}
                isFavorite={updateFavorite.isOptimisticFavorite(board)}
                onFavoriteToggle={() => updateFavorite.toggle(board)}
                onDelete={() => deleteBoard.deleteBoard(board.id)}
                isDeletePending={deleteBoard.getIsPending(board.id)}
              />
            ))}
          </BoardsListCardsLayout>
        )}
      </BoardsListLayoutContent>
    </BoardsListLayout>
  );
}

export const Component = BoardsListPage;
