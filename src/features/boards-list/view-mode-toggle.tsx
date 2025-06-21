import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { ImagesIcon, ListIcon } from "lucide-react";

export type ViewMode = "list" | "cards";

export function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  return (
    <Tabs defaultValue={value} onValueChange={(e) => onChange(e as ViewMode)}>
      <TabsList>
        <TabsTrigger value="list">
          <ListIcon />
        </TabsTrigger>
        <TabsTrigger value="cards">
          <ImagesIcon />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
