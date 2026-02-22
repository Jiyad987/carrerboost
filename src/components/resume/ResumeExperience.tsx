import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Experience } from "./types";
import { Plus, Trash2, Briefcase } from "lucide-react";

interface Props {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export function ResumeExperience({ data, onChange }: Props) {
  const add = () => {
    onChange([...data, { id: Date.now().toString(), company: "", position: "", location: "", startDate: "", endDate: "", responsibilities: "" }]);
  };

  const remove = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const update = (index: number, field: keyof Experience, value: string) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2">
          <Briefcase className="w-5 h-5" /> Work Experience
        </h3>
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      {data.map((exp, index) => (
        <Card key={exp.id} className="p-4 bg-muted/30">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">Experience {index + 1}</h4>
            {data.length > 1 && (
              <Button onClick={() => remove(exp.id)} size="sm" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Company Name *</Label>
              <Input placeholder="Google" value={exp.company} onChange={(e) => update(index, "company", e.target.value)} />
            </div>
            <div>
              <Label>Job Title *</Label>
              <Input placeholder="Software Engineer" value={exp.position} onChange={(e) => update(index, "position", e.target.value)} />
            </div>
            <div>
              <Label>Location *</Label>
              <Input placeholder="Mountain View, CA" value={exp.location} onChange={(e) => update(index, "location", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Start Date *</Label>
                <Input placeholder="Jan 2020" value={exp.startDate} onChange={(e) => update(index, "startDate", e.target.value)} />
              </div>
              <div>
                <Label>End Date *</Label>
                <Input placeholder="Present" value={exp.endDate} onChange={(e) => update(index, "endDate", e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Label>Responsibilities (bullet points, one per line)</Label>
            <Textarea placeholder="• Led development of microservices architecture&#10;• Mentored team of 5 junior engineers&#10;• Reduced API response time by 40%" value={exp.responsibilities} onChange={(e) => update(index, "responsibilities", e.target.value)} rows={4} />
          </div>
        </Card>
      ))}
    </div>
  );
}
