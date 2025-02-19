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
import { Download, Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SplitForm } from "@/components/forms/split-form";
import { useToast } from "@/hooks/use-toast";

const splitExpenses = [
  {
    id: 1,
    date: "2024-03-20",
    description: "Dinner at Restaurant",
    totalAmount: 2400,
    paidBy: "You",
    splitWith: ["John", "Sarah"],
    yourShare: 800,
    status: "Pending",
  },
  {
    id: 2,
    date: "2024-03-19",
    description: "Movie Night",
    totalAmount: 1500,
    paidBy: "Sarah",
    splitWith: ["You", "John"],
    yourShare: 500,
    status: "Settled",
  },
  {
    id: 3,
    date: "2024-03-18",
    description: "Groceries",
    totalAmount: 3600,
    paidBy: "You",
    splitWith: ["Sarah", "Mike", "John"],
    yourShare: 900,
    status: "Pending",
  },
];

const friends = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Sarah", email: "sarah@example.com" },
  { id: 3, name: "Mike", email: "mike@example.com" },
];

export default function SplitExpensesPage() {
  const [status, setStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredSplits = splitExpenses.filter((split) => {
    const matchesStatus = status === "All" || split.status === status;
    const matchesSearch = split.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleExport = () => {
    const csvContent =
      "Date,Description,Total Amount,Paid By,Split With,Your Share,Status\n" +
      filteredSplits
        .map(
          (split) =>
            `${split.date},"${split.description}",${split.totalAmount},${
              split.paidBy
            },"${split.splitWith.join(", ")}",${split.yourShare},${split.status}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `split_expenses_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (data: any) => {
    console.log("New split expense:", data);
    toast({
      title: "Split expense added",
      description: "Your split expense has been successfully added.",
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Split Expenses</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage shared expenses with friends
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Friend
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Friend</DialogTitle>
                  <DialogDescription>
                    Add a friend to split expenses with.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Enter friend's name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="Enter friend's email" type="email" />
                  </div>
                  <Button className="w-full">Add Friend</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Split Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Split Expense</DialogTitle>
                  <DialogDescription>
                    Add a new expense to split with friends.
                  </DialogDescription>
                </DialogHeader>
                <SplitForm onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">You'll Receive</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹2,400
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              From 3 friends
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">You'll Pay</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              ₹1,500
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              To 2 friends
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Net Balance</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹900
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              You'll receive overall
            </p>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search splits..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Settled">Settled</SelectItem>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid By</TableHead>
                  <TableHead>Split With</TableHead>
                  <TableHead>Your Share</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSplits.map((split) => (
                  <TableRow key={split.id}>
                    <TableCell>{format(new Date(split.date), "PP")}</TableCell>
                    <TableCell>{split.description}</TableCell>
                    <TableCell>₹{split.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{split.paidBy}</TableCell>
                    <TableCell>{split.splitWith.join(", ")}</TableCell>
                    <TableCell>₹{split.yourShare.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          split.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        )}
                      >
                        {split.status}
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