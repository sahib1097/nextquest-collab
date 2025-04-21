
import { useState } from "react";
import { LayoutTemplate, Search, Megaphone, Target, Code, Gamepad, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  config: {
    columns: string[];
    labels: string[];
    statuses: string[];
    defaultView: "table" | "kanban" | "gantt";
    customFields: string[];
  };
};

const templates: Template[] = [
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    description: "Plan and track marketing campaigns with predefined milestones and KPIs",
    category: "Marketing",
    icon: <Megaphone className="h-5 w-5" />,
    config: {
      columns: ["Campaign Name", "Channel", "Budget", "ROI", "Status", "Launch Date", "End Date"],
      labels: ["Social Media", "Email", "Content", "PPC", "Events", "PR"],
      statuses: ["Planning", "In Review", "Active", "Analyzing", "Completed"],
      defaultView: "kanban",
      customFields: ["Target Audience", "Success Metrics", "Campaign Budget", "Expected ROI"]
    }
  },
  {
    id: "agile-sprint",
    name: "Agile Sprint",
    description: "Manage sprints and user stories with Agile methodology",
    category: "Project Management",
    icon: <Target className="h-5 w-5" />,
    config: {
      columns: ["User Story", "Story Points", "Assigned To", "Sprint", "Priority", "Status"],
      labels: ["Feature", "Bug", "Tech Debt", "Documentation"],
      statuses: ["Backlog", "To Do", "In Progress", "Review", "Done"],
      defaultView: "kanban",
      customFields: ["Sprint Number", "Story Points", "Acceptance Criteria", "Epic"]
    }
  },
  {
    id: "software-release",
    name: "Software Release",
    description: "Track software development lifecycle and releases",
    category: "Software Development",
    icon: <Code className="h-5 w-5" />,
    config: {
      columns: ["Feature", "Priority", "Status", "Assigned To", "Target Version", "Dependencies"],
      labels: ["Frontend", "Backend", "API", "Database", "Testing", "DevOps"],
      statuses: ["Planning", "Development", "Testing", "Review", "Release Ready", "Released"],
      defaultView: "gantt",
      customFields: ["Version Number", "Release Date", "Test Coverage", "Breaking Changes"]
    }
  }
];

export default function TemplatesSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Extract unique categories from templates for filtering
  const categories = Array.from(new Set(templates.map(template => template.category)));

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: Template) => {
    // Store the selected template configuration in localStorage
    localStorage.setItem("fluxProjectTemplate", JSON.stringify(template));
    // Navigate to projects with the template parameter
    navigate(`/admin/projects?template=${template.id}`);
  };

  return (
    <Card className="border border-gray-200 shadow-sm mb-8">
      <CardHeader className="border-b border-gray-100 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            Templates
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Explore Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>Explore Templates</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-6 h-full">
                <div className="col-span-3">
                  <div className="mb-6">
                    <Input
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <ScrollArea className="h-[calc(80vh-180px)]">
                    <div className="grid grid-cols-2 gap-4 pr-4">
                      {filteredTemplates.map((template) => (
                        <Card
                          key={template.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {template.icon}
                              {template.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600">{template.description}</p>
                            <div className="mt-4 space-y-2">
                              <div className="text-xs text-gray-500">
                                <strong>Includes:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  <li>{template.config.columns.length} predefined columns</li>
                                  <li>{template.config.labels.length} labels</li>
                                  <li>{template.config.statuses.length} statuses</li>
                                </ul>
                              </div>
                              <Button 
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTemplateSelect(template);
                                }}
                              >
                                Use Template
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="border-l border-gray-200 pl-6">
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        !selectedCategory ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                      }`}
                    >
                      All Templates
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                          selectedCategory === category ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.slice(0, 3).map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTemplateSelect(template)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {template.icon}
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="mt-4">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
