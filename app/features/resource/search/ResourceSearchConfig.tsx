import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Checkbox } from "~/shared/components/ui/checkbox";
import { Input } from "~/shared/components/ui/input";
import { Label } from "~/shared/components/ui/label";
import { useResourceSearch } from "./ResourceSearchContext";

const ORDER_BY_OPTIONS = ["title", "username", "n_char"] as const;

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const { immediateParams, setImmediateParams } = useResourceSearch();
  const { order_by } = immediateParams;

  const handleCheckedChange = (checked: boolean) => {
    // @ts-ignore
    setImmediateParams((prev) => {
      const newOrderBy = checked
        ? // @ts-ignore
          [...prev.order_by, id]
        : prev.order_by?.filter((o) => o !== id);
      return { ...prev, order_by: newOrderBy };
    });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-2 p-2 bg-background rounded-md"
    >
      <button {...attributes} {...listeners} className="cursor-grab">
        <GripVertical size={20} />
      </button>
      <Checkbox
        id={`orderby-${id}`}
        // @ts-ignore
        checked={order_by?.includes(id)}
        onCheckedChange={handleCheckedChange}
      />
      <Label htmlFor={`orderby-${id}`} className="flex-grow">
        {id}
      </Label>
    </div>
  );
}

export default function ResourceSearchConfig() {
  const { immediateParams, setImmediateParams } = useResourceSearch();
  const { q_user, desc, order_by } = immediateParams;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImmediateParams((prev) => {
        // @ts-ignore
        const oldIndex = prev.order_by?.indexOf(active.id as string);
        // @ts-ignore
        const newIndex = prev.order_by?.indexOf(over.id as string);
        // @ts-ignore
        const newOrderBy = arrayMove(prev.order_by, oldIndex, newIndex);
        return { ...prev, order_by: newOrderBy };
      });
    }
  }

  const unselectedOptions = ORDER_BY_OPTIONS.filter(
    (opt) => !order_by?.includes(opt),
  );

  return (
    <div className="space-y-4 p-4 border-t bg-background">
      <div className="space-y-2">
        <Label htmlFor="q_user">ユーザー名</Label>
        <Input
          id="q_user"
          placeholder="ユーザー名で絞り込み..."
          value={q_user}
          onChange={(e) =>
            setImmediateParams((prev) => ({ ...prev, q_user: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <Label>ソート</Label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="desc"
              checked={desc}
              onCheckedChange={(checked) =>
                setImmediateParams((prev) => ({
                  ...prev,
                  desc: Boolean(checked),
                }))
              }
            />
            <Label htmlFor="desc">降順</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>ソートキー</Label>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            // @ts-ignore
            items={order_by}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {order_by?.map((option) => (
                <SortableItem key={option} id={option} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex flex-wrap gap-4 mt-4">
          {unselectedOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`orderby-${option}`}
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setImmediateParams((prev) => ({
                      ...prev,
                      order_by: [...prev.order_by, option],
                    }));
                  }
                }}
              />
              <Label htmlFor={`orderby-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
