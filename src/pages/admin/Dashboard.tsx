
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, DollarSign, Users, Plus, BarChart2, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import QuestLog from "@/components/Dashboard/QuestLog";
import TemplatesSection from "@/components/Dashboard/TemplatesSection";
import { getActivities, Activity } from "@/utils/activityLogger";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userCount, setUserCount] = useState(1); // Default to 1 (current user)
  const [budgetCount, setBudgetCount] = useState(0);
  const [roadmapCount, setRoadmapCount] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("fluxProjects") || "[]");
    setProjects(storedProjects);
    
    const storedActivities = getActivities();
    setActivities(storedActivities);
    
    const storedUsers = JSON.parse(localStorage.getItem("fluxUsers") || "[]");
    setUserCount(Math.max(1, storedUsers.length));
    
    const storedBudgets = JSON.parse(localStorage.getItem("fluxBudgets") || "[]");
    setBudgetCount(storedBudgets.length);
    
    const storedRoadmaps = JSON.parse(localStorage.getItem("fluxRoadmaps") || "[]");
    setRoadmapCount(storedRoadmaps.length);
    
    const budgetData = JSON.parse(localStorage.getItem("budgetData") || "null");
    if (budgetData) {
      setTotalBudget(budgetData.totalBudget);
      const totalSpent = budgetData.monthlyData?.reduce((acc: number, month: any) => acc + month.spent, 0) || 0;
      setRemainingBudget(budgetData.totalBudget - totalSpent);
    }
  }, []);
  
  const formatActivityTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };
  
  const handleActivityClick = (activity: Activity) => {
    if (activity.projectId) {
      navigate(`/admin/projects/${activity.projectId}`);
    } else if (activity.type.includes('budget')) {
      navigate('/admin/budgets');
    } else if (activity.type.includes('roadmap')) {
      navigate('/admin/roadmaps');
    } else if (activity.type.includes('user') || activity.type.includes('team')) {
      navigate('/admin/team');
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F]">Welcome to Next Quest</h1>
          <p className="text-[#86868B] text-sm mt-0.5">Your workspace overview</p>
        </div>
        <Button onClick={() => navigate("/admin/projects/new")} className="bg-[#007AFF] hover:opacity-90 text-white">
          <Plus className="h-4 w-4 mr-1.5" /> New Project
        </Button>
      </div>
      
      <TemplatesSection />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border border-[#E5E5EA] shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/projects")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#86868B]">
              Projects
            </CardTitle>
            <div className="p-2 rounded-full bg-[#F5F5F7] text-[#007AFF]">
              <BarChart2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{projects.length}</div>
            <p className="text-xs text-[#86868B] mt-1">Total projects</p>
          </CardContent>
        </Card>
        
        <Card className="border border-[#E5E5EA] shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/team")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#86868B]">
              Team
            </CardTitle>
            <div className="p-2 rounded-full bg-[#EBF5FF] text-[#007AFF]">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{userCount}</div>
            <p className="text-xs text-[#86868B] mt-1">Team members</p>
          </CardContent>
        </Card>
        
        <Card className="border border-[#E5E5EA] shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/budgets")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#86868B]">
              Budget
            </CardTitle>
            <div className="p-2 rounded-full bg-[#ECFDF5] text-[#10B981]">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${remainingBudget.toLocaleString()}</div>
            <p className="text-xs text-[#86868B] mt-1">Remaining budget</p>
          </CardContent>
        </Card>
        
        <Card className="border border-[#E5E5EA] shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/admin/roadmaps")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#86868B]">
              Roadmaps
            </CardTitle>
            <div className="p-2 rounded-full bg-[#F5F3FF] text-[#8B5CF6]">
              <Star className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{roadmapCount}</div>
            <p className="text-xs text-[#86868B] mt-1">Active roadmaps</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border border-[#E5E5EA] shadow-sm md:col-span-2">
          <CardHeader className="border-b border-[#E5E5EA] pb-3">
            <CardTitle className="text-[#1D1D1F]">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-[#86868B] mb-4">No projects created yet</p>
                <Button onClick={() => navigate("/admin/projects")} className="bg-[#007AFF] hover:opacity-90 text-white">
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F5F7] hover:bg-[#F5F5F7]">
                    <TableHead className="text-[#86868B] font-medium">Name</TableHead>
                    <TableHead className="text-[#86868B] font-medium">Status</TableHead>
                    <TableHead className="text-[#86868B] font-medium">Tasks</TableHead>
                    <TableHead className="text-[#86868B] font-medium">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.slice(0, 4).map((project, index) => (
                    <TableRow key={project.id || index} className="cursor-pointer hover:bg-[#F5F5F7]" onClick={() => navigate(`/admin/projects/${project.id}`)}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
                          {project.status || 'Active'}
                        </span>
                      </TableCell>
                      <TableCell>{project.tasks?.length || 0}</TableCell>
                      <TableCell>
                        <div className="w-full bg-[#F5F5F7] rounded-full h-1.5">
                          <div 
                            className="bg-[#007AFF] h-1.5 rounded-full" 
                            style={{ width: `${project.progress || 0}%` }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <QuestLog />
      </div>
      
      <Card className="border border-[#E5E5EA] shadow-sm mb-8">
        <CardHeader className="border-b border-[#E5E5EA] pb-3">
          <CardTitle className="text-[#1D1D1F]">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activities.length === 0 ? (
            <div className="flex items-center justify-center py-8 px-4 text-center">
              <p className="text-[#86868B]">No activity recorded yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E5E5EA]">
              {activities.slice(0, 6).map((activity) => (
                <div 
                  key={activity.id} 
                  className="p-4 hover:bg-[#F5F5F7] cursor-pointer transition-colors"
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#F5F5F7] text-[#007AFF] mr-3">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm text-[#1D1D1F]">{activity.details}</p>
                      <p className="text-xs text-[#86868B] mt-1">
                        {formatActivityTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
