import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Project } from "./types";
import { Plus, Trash2, FolderGit2 } from "lucide-react";

interface Props {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export function ResumeProjects({ data, onChange }: Props) {
  const add = () => {
    onChange([...data, { id: Date.now().toString(), name: "", description: "", technologies: "", link: "" }]);
  };

  const remove = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const update = (index: number, field: keyof Project, value: string) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2">
          <FolderGit2 className="w-5 h-5" /> Projects
        </h3>
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      {data.map((project, index) => (
        <Card key={project.id} className="p-4 bg-muted/30">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">Project {index + 1}</h4>
            {data.length > 1 && (
              <Button onClick={() => remove(project.id)} size="sm" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Project Name *</Label>
              <Input placeholder="E-Commerce Platform" value={project.name} onChange={(e) => update(index, "name", e.target.value)} />
            </div>
            <div>
              <Label>Technologies Used *</Label>
              <Input placeholder="React, Node.js, MongoDB" value={project.technologies} onChange={(e) => update(index, "technologies", e.target.value)} />
            </div>
          </div>
          <div className="mt-3">
            <Label>Description *</Label>
            <Textarea placeholder="Describe what the project does and your contributions..." value={project.description} onChange={(e) => update(index, "description", e.target.value)} rows={3} />
          </div>
          <div className="mt-3">
            <Label>Project Link</Label>
            <Input placeholder="https://github.com/..." value={project.link} onChange={(e) => update(index, "link", e.target.value)} />
          </div>
        </Card>
      ))}
    </div>
  );
}
