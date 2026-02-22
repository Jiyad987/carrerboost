import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language } from "./types";
import { Plus, Trash2, Languages as LanguagesIcon } from "lucide-react";

interface Props {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const proficiencyLevels = ["Native", "Fluent", "Professional", "Intermediate", "Beginner"];

export function ResumeLanguages({ data, onChange }: Props) {
  const add = () => {
    onChange([...data, { id: Date.now().toString(), name: "", proficiency: "Fluent" }]);
  };

  const remove = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const update = (index: number, field: keyof Language, value: string) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2">
          <LanguagesIcon className="w-5 h-5" /> Languages
        </h3>
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map((lang, index) => (
          <Card key={lang.id} className="p-3 bg-muted/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Language {index + 1}</span>
              {data.length > 1 && (
                <Button onClick={() => remove(lang.id)} size="sm" variant="ghost" className="h-7 w-7 p-0"><Trash2 className="w-3 h-3" /></Button>
              )}
            </div>
            <div className="space-y-2">
              <Input placeholder="English" value={lang.name} onChange={(e) => update(index, "name", e.target.value)} />
              <Select value={lang.proficiency} onValueChange={(v) => update(index, "proficiency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
