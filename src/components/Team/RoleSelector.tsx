
import { Check, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/quest";
import { toast } from "sonner";

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  disabled?: boolean;
  currentUserRole?: UserRole;
}

const RoleSelector = ({ 
  currentRole, 
  onRoleChange, 
  disabled = false,
  currentUserRole = UserRole.USER 
}: RoleSelectorProps) => {
  const roles = Object.values(UserRole);

  const handleRoleChange = (newRole: UserRole) => {
    // Only super admins can create other super admins
    if (newRole === UserRole.SUPER_ADMIN && currentUserRole !== UserRole.SUPER_ADMIN) {
      toast.error("Only Super Admins can assign Super Admin role");
      return;
    }

    // Only admins and super admins can assign admin roles
    if (newRole === UserRole.ADMIN && 
        ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUserRole)) {
      toast.error("Only Admins can assign Admin role");
      return;
    }

    onRoleChange(newRole);
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "text-purple-600";
      case UserRole.ADMIN:
        return "text-red-600";
      case UserRole.TEAM_LEAD:
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button 
          variant="outline" 
          className={`gap-2 ${getRoleColor(currentRole)}`}
        >
          <Shield className="h-4 w-4" />
          {currentRole}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            className={`gap-2 ${currentRole === role ? 'bg-accent' : ''}`}
            onClick={() => handleRoleChange(role)}
          >
            <Shield className={`h-4 w-4 ${getRoleColor(role)}`} />
            {role}
            {currentRole === role && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSelector;
