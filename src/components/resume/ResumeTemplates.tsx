import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TemplateType = "modern" | "classic" | "minimal" | "professional" | "creative";

interface TemplateOption {
  id: TemplateType;
  name: string;
  description: string;
  preview: React.ReactNode;
}

interface ResumeTemplatesProps {
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
}

const templates: TemplateOption[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean lines with accent colors",
    preview: (
      <div className="w-full h-full bg-white p-2 text-[6px] space-y-1">
        <div className="h-3 bg-primary/20 rounded-sm" />
        <div className="flex gap-1">
          <div className="w-1/3 space-y-1">
            <div className="h-1.5 bg-primary/40 rounded-sm w-full" />
            <div className="h-1 bg-muted rounded-sm w-3/4" />
            <div className="h-1 bg-muted rounded-sm w-2/3" />
          </div>
          <div className="w-2/3 space-y-1">
            <div className="h-1.5 bg-primary/30 rounded-sm w-1/2" />
            <div className="h-1 bg-muted rounded-sm w-full" />
            <div className="h-1 bg-muted rounded-sm w-5/6" />
            <div className="h-1 bg-muted rounded-sm w-4/5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional and timeless",
    preview: (
      <div className="w-full h-full bg-white p-2 text-[6px] space-y-1">
        <div className="text-center space-y-0.5">
          <div className="h-2 bg-foreground/80 rounded-sm w-1/2 mx-auto" />
          <div className="h-1 bg-muted rounded-sm w-2/3 mx-auto" />
        </div>
        <div className="border-t border-foreground/30 pt-1 space-y-1">
          <div className="h-1.5 bg-foreground/60 rounded-sm w-1/4" />
          <div className="h-1 bg-muted rounded-sm w-full" />
          <div className="h-1 bg-muted rounded-sm w-5/6" />
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant",
    preview: (
      <div className="w-full h-full bg-white p-2 text-[6px] space-y-2">
        <div className="h-2.5 bg-foreground/70 rounded-sm w-2/3" />
        <div className="h-0.5 bg-foreground/20 w-full" />
        <div className="space-y-1">
          <div className="h-1 bg-muted rounded-sm w-full" />
          <div className="h-1 bg-muted rounded-sm w-4/5" />
          <div className="h-1 bg-muted rounded-sm w-full" />
        </div>
      </div>
    ),
  },
  {
    id: "professional",
    name: "Professional",
    description: "Corporate and structured",
    preview: (
      <div className="w-full h-full bg-white p-2 text-[6px]">
        <div className="bg-slate-800 text-white p-1.5 -mx-2 -mt-2 mb-1.5">
          <div className="h-2 bg-white/30 rounded-sm w-1/2" />
          <div className="h-1 bg-white/20 rounded-sm w-2/3 mt-0.5" />
        </div>
        <div className="space-y-1">
          <div className="h-1.5 bg-slate-800/60 rounded-sm w-1/3" />
          <div className="h-1 bg-muted rounded-sm w-full" />
          <div className="h-1 bg-muted rounded-sm w-4/5" />
        </div>
      </div>
    ),
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and eye-catching",
    preview: (
    <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 p-2 text-[6px]">
        <div className="flex gap-1">
          <div className="w-1/4 space-y-1">
            <div className="h-4 w-4 bg-violet-400/60 rounded-full mx-auto" />
            <div className="h-1 bg-violet-300/50 rounded-sm w-full" />
            <div className="h-1 bg-violet-200/50 rounded-sm w-3/4" />
          </div>
          <div className="w-3/4 space-y-1">
            <div className="h-2 bg-violet-400/60 rounded-sm w-2/3" />
            <div className="h-1 bg-muted rounded-sm w-full" />
            <div className="h-1 bg-muted rounded-sm w-5/6" />
          </div>
        </div>
      </div>
    ),
  },
];

export function ResumeTemplates({ selectedTemplate, onSelectTemplate }: ResumeTemplatesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-primary">Choose Template</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden relative group",
              selectedTemplate === template.id
                ? "ring-2 ring-primary shadow-lg"
                : "hover:ring-1 hover:ring-primary/50"
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="aspect-[3/4] relative">
              {template.preview}
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-2 text-center border-t">
              <p className="font-medium text-sm">{template.name}</p>
              <p className="text-[10px] text-muted-foreground">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
