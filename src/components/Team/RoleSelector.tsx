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
import { useTheme } from "@/contexts/ThemeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const { currentTheme } = useTheme();
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
        return currentTheme.colors.accent;
      case UserRole.ADMIN:
        return currentTheme.colors.primary;
      case UserRole.TEAM_LEAD:
        return currentTheme.colors.secondary;
      default:
        return currentTheme.colors.text;
    }
  };

  return (
    <Select
      value={currentRole}
      onValueChange={handleRoleChange}
      disabled={disabled}
    >
      <SelectTrigger 
        className="w-[180px]"
        style={{
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border,
          color: currentTheme.colors.text
        }}
      >
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent
        style={{
          backgroundColor: currentTheme.colors.background,
          borderColor: currentTheme.colors.border
        }}
      >
        {roles.map((role) => (
          <SelectItem 
            key={role} 
            value={role}
            style={{ color: getRoleColor(role) }}
          >
            {role.replace(/_/g, ' ')}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RoleSelector;
