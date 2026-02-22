import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Achievement } from "./types";
import { Plus, Trash2, Trophy } from "lucide-react";

interface Props {
  data: Achievement[];
  onChange: (data: Achievement[]) => void;
}

export function ResumeAchievements({ data, onChange }: Props) {
  const add = () => {
    onChange([...data, { id: Date.now().toString(), description: "" }]);
  };

  const remove = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const update = (index: number, value: string) => {
    const updated = [...data];
    updated[index].description = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2">
          <Trophy className="w-5 h-5" /> Achievements (Optional)
        </h3>
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.id} className="flex gap-2">
            <Input
              placeholder="e.g., Top Performer Award, Published Research Paper"
              value={item.description}
              onChange={(e) => update(index, e.target.value)}
              className="flex-1"
            />
            {data.length > 1 && (
              <Button onClick={() => remove(item.id)} size="sm" variant="ghost" className="shrink-0"><Trash2 className="w-4 h-4" /></Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
