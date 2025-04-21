
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import BudgetQuestionnaire from "@/components/Budgets/BudgetQuestionnaire";
import BudgetDashboard from "@/components/Budgets/BudgetDashboard";

const Budgets = () => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  
  useEffect(() => {
    // Check if budget data exists in localStorage
    const budgetData = localStorage.getItem("budgetData");
    if (budgetData) {
      setIsFirstTime(false);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="p-2 md:p-6">
        {isFirstTime ? (
          <BudgetQuestionnaire />
        ) : (
          <BudgetDashboard />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Budgets;
