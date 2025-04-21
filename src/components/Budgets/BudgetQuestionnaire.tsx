
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const questionnaireSchema = z.object({
  totalBudget: z.string().min(1, "Total budget is required"),
  developmentBudget: z.string().min(1, "Development budget is required"),
  marketingBudget: z.string().min(1, "Marketing budget is required"),
  salesBudget: z.string().min(1, "Sales budget is required"),
});

type QuestionnaireValues = z.infer<typeof questionnaireSchema>;

const BudgetQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<QuestionnaireValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      totalBudget: "",
      developmentBudget: "",
      marketingBudget: "",
      salesBudget: "",
    },
  });

  const steps = [
    {
      title: "Total Budget",
      description: "What is your total allocated company funds?",
      field: "totalBudget",
    },
    {
      title: "Development Budget",
      description: "What is your budget for development?",
      field: "developmentBudget",
    },
    {
      title: "Marketing Budget",
      description: "What is your budget for marketing?",
      field: "marketingBudget",
    },
    {
      title: "Sales Budget",
      description: "What is your budget for sales?",
      field: "salesBudget",
    },
  ];

  const handleNextStep = async () => {
    const currentField = steps[currentStep].field as keyof QuestionnaireValues;
    const isValid = await form.trigger(currentField);
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleSubmit = () => {
    const values = form.getValues();
    // Convert string values to numbers
    const budgetData = {
      totalBudget: parseFloat(values.totalBudget),
      developmentBudget: parseFloat(values.developmentBudget),
      marketingBudget: parseFloat(values.marketingBudget),
      salesBudget: parseFloat(values.salesBudget),
      createdAt: new Date().toISOString(),
      monthlyData: generateInitialMonthlyData(),
    };
    
    // Save budget data to localStorage
    localStorage.setItem("budgetData", JSON.stringify(budgetData));
    
    toast.success("Budget information saved successfully!");
    navigate("/admin/budgets");
  };

  const formatCurrency = (value: string) => {
    // Remove any non-digit characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, "");
    const parsedValue = parseFloat(numericValue);
    
    if (isNaN(parsedValue)) {
      return "";
    }

    // Format as currency
    return parsedValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const rawValue = e.target.value.replace(/[$,]/g, "");
    form.setValue(field as keyof QuestionnaireValues, rawValue);
  };

  const generateInitialMonthlyData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const monthlyData = [];

    for (let i = 0; i < 12; i++) {
      monthlyData.push({
        month: new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' }),
        totalBudget: parseFloat(form.getValues().totalBudget) / 12,
        developmentBudget: parseFloat(form.getValues().developmentBudget) / 12,
        marketingBudget: parseFloat(form.getValues().marketingBudget) / 12,
        salesBudget: parseFloat(form.getValues().salesBudget) / 12,
        spent: 0,
      });
    }

    return monthlyData;
  };

  const currentField = steps[currentStep].field as keyof QuestionnaireValues;
  const currentValue = form.watch(currentField) || "";
  const formattedValue = currentValue ? formatCurrency(currentValue) : "";

  return (
    <div className="max-w-md mx-auto pt-12">
      <Card>
        <CardContent className="pt-6">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">
            Step {currentStep + 1} of {steps.length}
          </div>
          <h1 className="text-lg font-medium mb-1">{steps[currentStep].title}</h1>
          <p className="text-sm text-gray-500 mb-6">{steps[currentStep].description}</p>

          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name={currentField}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="text-4xl font-light h-20 opacity-0"
                          placeholder="0"
                          onChange={(e) => handleCurrencyInput(e, field.name)}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-light">
                            {formattedValue || "$0"}
                          </span>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button type="button" onClick={handleNextStep}>
                  {currentStep < steps.length - 1 ? "Next" : "Complete"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetQuestionnaire;
