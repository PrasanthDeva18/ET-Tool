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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LendingForm } from "@/components/forms/lending-form";
import { useToast } from "@/hooks/use-toast";

const lendingData = [
  {
    id: 1,
    date: "2024-03-20",
    person: "John",
    amount: 5000,
    type: "Lent",
    dueDate: "2024-04-20",
    status: "Pending",
    notes: "Emergency fund",
  },
  {
    id: 2,
    date: "2024-03-15",
    person: "Sarah",
    amount: 2000,
    type: "Borrowed",
    dueDate: "2024-03-30",
    status: "Pending",
    notes: "Lunch payment",
  },
  {
    id: 3,
    date: "2024-03-10",
    person: "Mike",
    amount: 3000,
    type: "Lent",
    dueDate: "2024-03-25",
    status: "Repaid",
    notes: "Movie tickets",
  },
];

export default function LendingPage() {
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredTransactions = lendingData.filter((transaction) => {
    const matchesStatus = status === "All" || transaction.status === status;
    const matchesType = type === "All" || transaction.type === type;
    const matchesSearch =
      transaction.person.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleExport = () => {
    const csvContent =
      "Date,Person,Amount,Type,Due Date,Status,Notes\n" +
      filteredTransactions
        .map(
          (transaction) =>
            `${transaction.date},${transaction.person},${transaction.amount},${transaction.type},${transaction.dueDate},${transaction.status},"${transaction.notes}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `lending_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (data: any) => {
    console.log("New lending transaction:", data);
    toast({
      title: "Transaction added",
      description: "Your lending transaction has been successfully added.",
    });
    setIsDialogOpen(false);
  };

  // Calculate summary statistics
  const summary = filteredTransactions.reduce(
    (acc, transaction) => {
      if (transaction.status === "Pending") {
        if (transaction.type === "Lent") {
          acc.toReceive += transaction.amount;
        } else {
          acc.toPay += transaction.amount;
        }
      }
      return acc;
    },
    { toReceive: 0, toPay: 0 }
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Lending & Borrowing</h1>
            <p className="text-muted-foreground mt-1">
              Track money lent and borrowed
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Add a new lending or borrowing transaction.
                </DialogDescription>
              </DialogHeader>
              <LendingForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">To Receive</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{summary.toReceive.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Pending amount to receive
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">To Pay</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ₹{summary.toPay.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Pending amount to pay
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Net Balance</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹{(summary.toReceive - summary.toPay).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Overall lending balance
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by person or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Lent">Lent</SelectItem>
                  <SelectItem value="Borrowed">Borrowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Repaid">Repaid</SelectItem>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Person</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), "PP")}
                    </TableCell>
                    <TableCell>{transaction.person}</TableCell>
                    <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          transaction.type === "Lent"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        )}
                      >
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.dueDate), "PP")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          transaction.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        )}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.notes}</TableCell>
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