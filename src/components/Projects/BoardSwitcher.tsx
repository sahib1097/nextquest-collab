
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Layout } from "lucide-react";
import { ProjectBoard } from "@/types/quest";

interface BoardSwitcherProps {
  boards: ProjectBoard[];
  currentBoard: ProjectBoard;
  onBoardChange: (boardId: string) => void;
}

const BoardSwitcher = ({ boards, currentBoard, onBoardChange }: BoardSwitcherProps) => {
  if (boards.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Layout className="h-4 w-4" />
          {currentBoard.name}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {boards.map((board) => (
          <DropdownMenuItem
            key={board.id}
            onClick={() => onBoardChange(board.id)}
            className="gap-2"
          >
            <Layout className="h-4 w-4" />
            {board.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BoardSwitcher;
