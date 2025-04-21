
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, DollarSign, CreditCard, PieChart, Banknote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface BudgetMonthlyData {
  month: string;
  totalBudget: number;
  developmentBudget: number;
  marketingBudget: number;
  salesBudget: number;
  spent: number;
}

interface BudgetData {
  totalBudget: number;
  developmentBudget: number;
  marketingBudget: number;
  salesBudget: number;
  createdAt: string;
  monthlyData: BudgetMonthlyData[];
}

const BudgetDashboard = () => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [activeView, setActiveView] = useState<string>("overview");
  const [showBankModal, setShowBankModal] = useState(false);
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("budgetData");
    if (storedData) {
      setBudgetData(JSON.parse(storedData));
    }
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getTotalSpent = () => {
    if (!budgetData) return 0;
    return budgetData.monthlyData.reduce((acc, month) => acc + month.spent, 0);
  };

  const getRemainingBudget = () => {
    if (!budgetData) return 0;
    return budgetData.totalBudget - getTotalSpent();
  };

  const handleConnectBank = () => {
    setShowBankModal(true);
    // In a real app, this would open a modal or redirect to bank connection flow
    toast.success("Bank connection feature is not implemented in this demo");
  };

  const handleAddFunds = () => {
    setShowAddFundsDialog(true);
  };

  const submitAddFunds = () => {
    if (!amountToAdd || isNaN(Number(amountToAdd)) || Number(amountToAdd) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (budgetData) {
      const amount = Number(amountToAdd);
      const updatedBudgetData = {
        ...budgetData,
        totalBudget: budgetData.totalBudget + amount,
      };

      setBudgetData(updatedBudgetData);
      localStorage.setItem("budgetData", JSON.stringify(updatedBudgetData));
      toast.success(`Successfully added ${formatCurrency(amount)} to your budget`);
      setShowAddFundsDialog(false);
      setAmountToAdd("");
    }
  };

  if (!budgetData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p>No budget data available. Please complete the questionnaire first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Budget Management</h1>
          <p className="text-sm text-gray-500">
            Manage and track your company budget allocations
          </p>
        </div>
        <Button onClick={handleConnectBank} className="flex items-center gap-2">
          <Banknote className="h-4 w-4" />
          Connect Bank Account
        </Button>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Budget</p>
                <h2 className="text-3xl font-bold">{formatCurrency(budgetData.totalBudget)}</h2>
              </div>
              <div className="flex gap-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-primary/10" 
                  onClick={handleAddFunds}
                  title="Add funds to budget"
                >
                  <Plus className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <h2 className="text-3xl font-bold">{formatCurrency(getTotalSpent())}</h2>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <CreditCard className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Remaining</p>
                <h2 className="text-3xl font-bold">{formatCurrency(getRemainingBudget())}</h2>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <PieChart className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Budget Utilization</p>
                <h2 className="text-3xl font-bold">
                  {budgetData.totalBudget > 0 
                    ? Math.round((getTotalSpent() / budgetData.totalBudget) * 100) 
                    : 0}%
                </h2>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <BarChart className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Funds Dialog */}
      <Dialog open={showAddFundsDialog} onOpenChange={setShowAddFundsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Funds to Budget</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right col-span-1">
                Amount
              </label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  className="pl-8"
                  placeholder="Enter amount"
                  min="1"
                  autoFocus
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFundsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitAddFunds}>Add Funds</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Budget Details */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Yearly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Development</TableCell>
                    <TableCell>{formatCurrency(budgetData.developmentBudget)}</TableCell>
                    <TableCell>{formatCurrency(budgetData.developmentBudget * 0.3)}</TableCell>
                    <TableCell>{formatCurrency(budgetData.developmentBudget * 0.7)}</TableCell>
                    <TableCell>30%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketing</TableCell>
                    <TableCell>{formatCurrency(budgetData.marketingBudget)}</TableCell>
                    <TableCell>{formatCurrency(budgetData.marketingBudget * 0.45)}</TableCell>
                    <TableCell>{formatCurrency(budgetData.marketingBudget * 0.55)}</TableCell>
                    <TableCell>45%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sales</TableCell>
                    <TableCell>{formatCurrency(budgetData.salesBudget)}</TableCell>
                    <TableCell>{formatCurrency(budgetData.salesBudget * 0.6)}</TableCell>
                    <TableCell>{formatCurrency(budgetData.salesBudget * 0.4)}</TableCell>
                    <TableCell>60%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Development</TableHead>
                    <TableHead>Marketing</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.monthlyData.map((month, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell>{formatCurrency(month.developmentBudget)}</TableCell>
                      <TableCell>{formatCurrency(month.marketingBudget)}</TableCell>
                      <TableCell>{formatCurrency(month.salesBudget)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(month.totalBudget)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yearly Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-12 text-muted-foreground">
                <p>Year-over-year data will be available after the first year.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetDashboard;
