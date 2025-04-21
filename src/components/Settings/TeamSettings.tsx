
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const TeamSettings = () => {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage your team and their access permissions
            </CardDescription>
          </div>
          <Button className="ml-auto">
            <Users className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-lg border p-8 flex flex-col items-center justify-center text-center">
          <Users className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No team members yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Add team members to collaborate on projects together
          </p>
          <Button>Add your first team member</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamSettings;
