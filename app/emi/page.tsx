"use client";

import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { EMIForm } from "@/components/forms/emi-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const emiData = [
  {
    id: 1,
    loanType: "Home Loan",
    lender: "HDFC Bank",
    totalAmount: 2500000,
    emiAmount: 25000,
    tenure: 120,
    paidMonths: 24,
    nextDueDate: "2024-04-05",
    status: "Active",
  },
  {
    id: 2,
    loanType: "Car Loan",
    lender: "ICICI Bank",
    totalAmount: 800000,
    emiAmount: 15000,
    tenure: 60,
    paidMonths: 36,
    nextDueDate: "2024-04-10",
    status: "Active",
  },
  {
    id: 3,
    loanType: "Personal Loan",
    lender: "SBI Bank",
    totalAmount: 500000,
    emiAmount: 12000,
    tenure: 48,
    paidMonths: 48,
    nextDueDate: "-",
    status: "Completed",
  },
];

export default function EMIPage() {
  const [status, setStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredEMIs = emiData.filter((emi) => {
    const matchesStatus = status === "All" || emi.status === status;
    const matchesSearch =
      emi.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emi.lender.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExport = () => {
    const csvContent =
      "Loan Type,Lender,Total Amount,EMI Amount,Tenure,Paid Months,Next Due Date,Status\n" +
      filteredEMIs
        .map(
          (emi) =>
            `${emi.loanType},${emi.lender},${emi.totalAmount},${emi.emiAmount},${emi.tenure},${emi.paidMonths},${emi.nextDueDate},${emi.status}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "emi_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (data: any) => {
    console.log("New EMI:", data);
    toast({
      title: "EMI added",
      description: "Your EMI has been successfully added.",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">EMI Tracker</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add EMI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New EMI</DialogTitle>
                <DialogDescription>
                  Add a new EMI to track your loan payments.
                </DialogDescription>
              </DialogHeader>
              <EMIForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by loan type or lender..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Lender</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>EMI Amount</TableHead>
                  <TableHead>Next Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEMIs.map((emi) => (
                  <TableRow key={emi.id}>
                    <TableCell className="font-medium">{emi.loanType}</TableCell>
                    <TableCell>{emi.lender}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress value={(emi.paidMonths / emi.tenure) * 100} />
                        <p className="text-xs text-muted-foreground">
                          {emi.paidMonths}/{emi.tenure} months paid
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>₹{emi.emiAmount.toLocaleString()}</TableCell>
                    <TableCell>{emi.nextDueDate}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          emi.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                        )}
                      >
                        {emi.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  );
}