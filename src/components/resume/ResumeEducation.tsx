import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Education } from "./types";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function ResumeEducation({ data, onChange }: Props) {
  const add = () => {
    onChange([...data, { id: Date.now().toString(), institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", location: "", cgpa: "" }]);
  };

  const remove = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const update = (index: number, field: keyof Education, value: string) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2">
          <GraduationCap className="w-5 h-5" /> Education
        </h3>
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      {data.map((edu, index) => (
        <Card key={edu.id} className="p-4 bg-muted/30">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">Education {index + 1}</h4>
            {data.length > 1 && (
              <Button onClick={() => remove(edu.id)} size="sm" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Institution Name *</Label>
              <Input placeholder="MIT" value={edu.institution} onChange={(e) => update(index, "institution", e.target.value)} />
            </div>
            <div>
              <Label>Degree *</Label>
              <Input placeholder="Bachelor of Science" value={edu.degree} onChange={(e) => update(index, "degree", e.target.value)} />
            </div>
            <div>
              <Label>Field of Study *</Label>
              <Input placeholder="Computer Science" value={edu.fieldOfStudy} onChange={(e) => update(index, "fieldOfStudy", e.target.value)} />
            </div>
            <div>
              <Label>Location</Label>
              <Input placeholder="Cambridge, MA" value={edu.location} onChange={(e) => update(index, "location", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start Date *</Label>
                <Input placeholder="2018" value={edu.startDate} onChange={(e) => update(index, "startDate", e.target.value)} />
              </div>
              <div>
                <Label>End Date *</Label>
                <Input placeholder="2022" value={edu.endDate} onChange={(e) => update(index, "endDate", e.target.value)} />
              </div>
            </div>
            <div>
              <Label>CGPA (optional)</Label>
              <Input placeholder="3.8 / 4.0" value={edu.cgpa} onChange={(e) => update(index, "cgpa", e.target.value)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
