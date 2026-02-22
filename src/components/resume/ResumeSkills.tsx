import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SkillCategory } from "./types";
import { Plus, Trash2, Wrench } from "lucide-react";

interface Props {
  data: SkillCategory[];
  onChange: (data: SkillCategory[]) => void;
}

export function ResumeSkills({ data, onChange }: Props) {
  const add = () => {
    onChange([...data, { id: Date.now().toString(), category: "", items: "" }]);
  };

  const remove = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const update = (index: number, field: keyof SkillCategory, value: string) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2">
          <Wrench className="w-5 h-5" /> Skills
        </h3>
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Add categorized skills (e.g., Technical Skills, Soft Skills, Tools, Languages)</p>
      {data.map((skill, index) => (
        <Card key={skill.id} className="p-4 bg-muted/30">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">Skill Category {index + 1}</h4>
            {data.length > 1 && (
              <Button onClick={() => remove(skill.id)} size="sm" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Category Name</Label>
              <Input placeholder="Technical Skills" value={skill.category} onChange={(e) => update(index, "category", e.target.value)} />
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input placeholder="Python, SQL, React, Node.js" value={skill.items} onChange={(e) => update(index, "items", e.target.value)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
