
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ProjectBoard } from "@/types/quest";

interface NewBoardDialogProps {
  onBoardCreated: (board: ProjectBoard) => void;
}

const NewBoardDialog = ({ onBoardCreated }: NewBoardDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBoard: ProjectBoard = {
      id: uuidv4(),
      name,
      description,
      projects: [],
      categories: [
        { id: "all", name: "All Projects" },
        { id: "development", name: "Development" },
        { id: "sales", name: "Sales" },
        { id: "marketing", name: "Marketing" },
      ],
      createdAt: new Date().toISOString(),
    };

    onBoardCreated(newBoard);
    setOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Layout className="h-4 w-4" />
          New Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Board Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter board name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter board description"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Board
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewBoardDialog;
