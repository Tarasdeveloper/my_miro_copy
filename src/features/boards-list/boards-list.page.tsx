import { Button } from "@/shared/ui/kit/button";
import { useBoardsList } from "./model/use-boards-list";
import { useBoardsFilters } from "./model/use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";
import { useCreateBoard } from "./model/use-create-board";
import { useDeleteBoard } from "./model/use-delete-board";
import { useUpdateFavorite } from "./model/use-update-favorite";
import { PlusIcon } from "lucide-react";
import {
  BoardsListLayout,
  BoardsListLayoutContent,
  BoardsListLayoutFilters,
  BoardsListLayoutHeader,
} from "./ui/boards-list-layout";
import { ViewMode, ViewModeToggle } from "./ui/view-mode-toggle";
import { useState } from "react";
import { BoardsSortSelect } from "./ui/boards-sort-select";
import { BoardsSearchInput } from "./ui/boards-search-input";
import { BoardsListCard } from "./ui/boards-list-card";
import { BoardsFavoriteToggle } from "./ui/boards-favorite-toggle";
import { BoardsListItem } from "./ui/boards-list-item";
import { DropdownMenuItem } from "@/shared/ui/kit/dropdown-menu";

function BoardsListPage() {
  const boardsFilters = useBoardsFilters();
  const boardsQuery = useBoardsList({
    sort: boardsFilters.sort,
    search: useDebouncedValue(boardsFilters.search, 300),
  });

  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();
  const updateFavorite = useUpdateFavorite();

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <BoardsListLayout
      header={
        <BoardsListLayoutHeader
          title="Доски"
          description="Здесь вы можете просматривать и управлять своими досками"
          actions={
            <Button
              disabled={createBoard.isPending}
              onClick={createBoard.createBoard}
            >
              <PlusIcon />
              Создать новую доску
            </Button>
          }
        />
      }
      filters={
        <BoardsListLayoutFilters
          sort={
            <BoardsSortSelect
              value={boardsFilters.sort}
              onValueChange={boardsFilters.setSort}
            />
          }
          filters={
            <BoardsSearchInput
              value={boardsFilters.search}
              onChange={boardsFilters.setSearch}
            />
          }
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
          boardsQuery.boards.map(
            (board) =>
              updateFavorite.isOptimisticFavorite(board) && (
                <BoardsListItem
                  key={board.id}
                  board={board}
                  rightActions={
                    <BoardsFavoriteToggle
                      isFavorite={updateFavorite.isOptimisticFavorite(board)}
                      onToggle={() => updateFavorite.toggle(board)}
                    />
                  }
                  menuActions={
                    <DropdownMenuItem
                      variant={"destructive"}
                      disabled={deleteBoard.getIsPending(board.id)}
                      onClick={() => deleteBoard.deleteBoard(board.id)}
                    >
                      Удалить
                    </DropdownMenuItem>
                  }
                />
              ),
          )
        }
        renderGrid={() =>
          boardsQuery.boards.map(
            (board) =>
              updateFavorite.isOptimisticFavorite(board) && (
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
              ),
          )
        }
      />
    </BoardsListLayout>
  );
}

export const Component = BoardsListPage;
