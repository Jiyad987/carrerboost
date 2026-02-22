import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Certification } from "./types";
import { Plus, Trash2, Award } from "lucide-react";

interface Props {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

export function ResumeCertifications({ data, onChange }: Props) {
  const add = () => {
    onChange([...data, { id: Date.now().toString(), name: "", organization: "", year: "", credentialUrl: "" }]);
  };

  const remove = (id: string) => {
    onChange(data.filter((item) => item.id !== id));
  };

  const update = (index: number, field: keyof Certification, value: string) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2">
          <Award className="w-5 h-5" /> Certifications
        </h3>
        <Button onClick={add} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>
      {data.map((cert, index) => (
        <Card key={cert.id} className="p-4 bg-muted/30">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium">Certification {index + 1}</h4>
            {data.length > 1 && (
              <Button onClick={() => remove(cert.id)} size="sm" variant="ghost"><Trash2 className="w-4 h-4" /></Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Certification Name</Label>
              <Input placeholder="AWS Solutions Architect" value={cert.name} onChange={(e) => update(index, "name", e.target.value)} />
            </div>
            <div>
              <Label>Organization</Label>
              <Input placeholder="Amazon Web Services" value={cert.organization} onChange={(e) => update(index, "organization", e.target.value)} />
            </div>
            <div>
              <Label>Year</Label>
              <Input placeholder="2023" value={cert.year} onChange={(e) => update(index, "year", e.target.value)} />
            </div>
            <div>
              <Label>Credential URL</Label>
              <Input placeholder="https://credential.net/..." value={cert.credentialUrl} onChange={(e) => update(index, "credentialUrl", e.target.value)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
