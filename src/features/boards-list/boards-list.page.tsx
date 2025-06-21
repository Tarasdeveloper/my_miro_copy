import { Link, href } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { Input } from "@/shared/ui/kit/input";
import { Label } from "@/shared/ui/kit/label";
import { Button } from "@/shared/ui/kit/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/kit/select";
import { Switch } from "@/shared/ui/kit/switch";
import { useBoardsList } from "./use-boards-list";
import { useBoardsFilters } from "./use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";
import { useCreateBoard } from "./use-create-board";
import { useDeleteBoard } from "./use-delete-board";
import { useUpdateFavorite } from "./use-update-favorite";
import { PlusIcon, StarIcon } from "lucide-react";
import {
  BoardsListLayout,
  BoardsListLayoutFilters,
  BoardsListLayoutHeader,
} from "./boards-list-layout";
import { ViewMode, ViewModeToggle } from "./view-mode-toggle";
import { useState } from "react";

type BoardsSortOption = "createdAt" | "updatedAt" | "lastOpenedAt" | "name";

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
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
            // <Button
            //   disabled={createBoard.isPending}
            //   onClick={createBoard.createBoard}
            // >
            //   <PlusIcon />
            //   Создать новую доску
            // </Button>
          }
        />
      }
      filters={
        <BoardsListLayoutFilters
          sort={
            <Select
              value={boardsFilters.sort}
              onValueChange={(value) =>
                boardsFilters.setSort(value as BoardsSortOption)
              }
            >
              <SelectTrigger id="sort" className="w-full">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastOpenedAt">По дате открытия</SelectItem>
                <SelectItem value="createdAt">По дате создания</SelectItem>
                <SelectItem value="updatedAt">По дате обновления</SelectItem>
                <SelectItem value="name">По имени</SelectItem>
              </SelectContent>
            </Select>
          }
          filters={
            <Input
              id="search"
              placeholder="Введите название доски..."
              value={boardsFilters.search}
              onChange={(e) => boardsFilters.setSearch(e.target.value)}
              className="w-full"
            />
          }
        ></BoardsListLayoutFilters>
      }
    >
      {boardsQuery.isPending ? (
        <div className="text-center py-10">Загрузка...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boardsQuery.boards.map((board) => (
              <Card key={board.id} className="relative">
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    <StarIcon />
                  </span>
                  <Switch
                    checked={updateFavorite.isOptimisticFavorite(board)}
                    onCheckedChange={() => updateFavorite.toggle(board)}
                  />
                </div>
                <CardHeader>
                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      variant="link"
                      className="text-left justify-start h-auto p-0"
                    >
                      <Link to={href(ROUTES.BOARD, { boardId: board.id })}>
                        <span className="text-xl font-medium">
                          {board.name}
                        </span>
                      </Link>
                    </Button>
                    <div className="text-sm text-gray-500">
                      Создано: {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Последнее открытие:{" "}
                      {new Date(board.lastOpenedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="destructive"
                    disabled={deleteBoard.getIsPending(board.id)}
                    onClick={() => deleteBoard.deleteBoard(board.id)}
                  >
                    Удалить
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {boardsQuery.boards.length === 0 && !boardsQuery.isPending && null}

          {boardsQuery.hasNextPage && (
            <div ref={boardsQuery.cursorRef} className="text-center py-8">
              {boardsQuery.isFetchingNextPage &&
                "Загрузка дополнительных досок..."}
            </div>
          )}
        </>
      )}
    </BoardsListLayout>
  );
}

export const Component = BoardsListPage;
