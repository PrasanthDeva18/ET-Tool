"use client";

import { Header } from "@/components/header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Card } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCard,
  DollarSign,
  SplitSquareVertical,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", expenses: 4000, emi: 2400 },
  { month: "Feb", expenses: 3000, emi: 2400 },
  { month: "Mar", expenses: 2000, emi: 2400 },
  { month: "Apr", expenses: 2780, emi: 2400 },
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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 lg:p-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Expenses"
            value="₹24,500"
            description="+20.1% from last month"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />
          <SummaryCard
            title="Total EMI Paid"
            value="₹12,000"
            description="4 active EMIs"
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          />
          <SummaryCard
            title="Split Expenses"
            value="₹3,600"
            description="2 pending settlements"
            icon={<SplitSquareVertical className="h-4 w-4 text-muted-foreground" />}
          />
          <SummaryCard
            title="Lending/Borrowing"
            value="₹8,200"
            description="You'll receive ₹5,000"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Expense Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
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
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="emi"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <ArrowUpIcon className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Grocery Shopping</p>
                  <p className="text-xs text-muted-foreground">Today, 2:30 PM</p>
                </div>
                <p className="text-sm font-medium">-₹2,500</p>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <ArrowDownIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Split Payment Received</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <p className="text-sm font-medium">+₹1,200</p>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Home Loan EMI</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <p className="text-sm font-medium">-₹15,000</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}