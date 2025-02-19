"use client";

import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "Jan", expenses: 24500, income: 45000 },
  { month: "Feb", expenses: 21000, income: 45000 },
  { month: "Mar", expenses: 28000, income: 45000 },
  { month: "Apr", expenses: 22000, income: 45000 },
];

const categoryData = [
  { name: "Groceries", value: 12000 },
  { name: "Transportation", value: 8000 },
  { name: "Entertainment", value: 5000 },
  { name: "Utilities", value: 7000 },
  { name: "Shopping", value: 9000 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const chartDefaults = {
  xAxis: {
    padding: { left: 0, right: 0 },
    tickMargin: 10,
    height: 60,
  },
  yAxis: {
    width: 60,
    padding: { top: 20, bottom: 20 },
    tickMargin: 10,
  },
};

export default function ReportsPage() {
  const [period, setPeriod] = useState("This Month");
  const [reportType, setReportType] = useState("Overview");

  const handleExport = () => {
    // Implementation for exporting reports
    console.log("Exporting reports...");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              View and analyze your financial data
            </p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Overview">Overview</SelectItem>
                <SelectItem value="Expenses">Expenses</SelectItem>
                <SelectItem value="EMI">EMI</SelectItem>
                <SelectItem value="Split">Split Expenses</SelectItem>
                <SelectItem value="Lending">Lending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Total Income</h3>
            </div>
            <p className="text-2xl font-bold mt-2">₹45,000</p>
            <p className="text-sm text-muted-foreground">+5% from last month</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Total Expenses</h3>
            </div>
            <p className="text-2xl font-bold mt-2">₹24,500</p>
            <p className="text-sm text-muted-foreground">-2% from last month</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Savings</h3>
            </div>
            <p className="text-2xl font-bold mt-2">₹20,500</p>
            <p className="text-sm text-muted-foreground">+12% from last month</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">EMI Payments</h3>
            </div>
            <p className="text-2xl font-bold mt-2">₹12,000</p>
            <p className="text-sm text-muted-foreground">Same as last month</p>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Income vs Expenses</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    {...chartDefaults.xAxis}
                    dataKey="month"
                  />
                  <YAxis 
                    {...chartDefaults.yAxis}
                  />
                  <Tooltip />
                  <Bar dataKey="income" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="expenses" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Expense Categories</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}