"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Member = {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  role: string;
  contributions: number;
  createdAt: string;
};

const columns: ColumnDef<TUser>[] = [
  {
    accessorKey: "user",
    header: "Member's Name",
    cell: ({ row }) => {
      const firstName = row.original?.firstName ?? "";
      const lastName = row.original?.lastName ?? "";
      const profileImage = row.original?.profileImage ?? "";

      return (
        <div className="flex items-center">
          <Avatar className="mr-2 size-8">
            <AvatarImage src={profileImage} alt={`${firstName} ${lastName}`} />
            <AvatarFallback>
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {firstName} {lastName}
            </div>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const firstName = row.original?.firstName ?? "";
      const lastName = row.original?.lastName ?? "";
      return (
        firstName?.toLowerCase()?.includes(value?.toLowerCase()) ||
        lastName?.toLowerCase()?.includes(value?.toLowerCase())
      );
    },
  },
  // {
  //   accessorKey: "role",
  //   header: "Level",
  //   cell: ({ row }) => {
  //     const role = row?.getValue("role") as string;
  //     return (
  //       <Badge
  //         variant="secondary"
  //         className={
  //           role === "admin"
  //             ? "bg-green-100 text-green-800"
  //             : role === "moderator"
  //               ? "bg-orange-100 text-orange-800"
  //               : "bg-gray-100 text-gray-800"
  //         }
  //       >
  //         {role}
  //       </Badge>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "contributions",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Contributions
  //         <ArrowUpDown className="ml-2 size-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="text-right">{row.getValue("contributions")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "createdAt",
  //   header: "Join Date",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="text-right font-medium">
  //         {new Date(row.getValue("createdAt")).toLocaleDateString("en-US", {
  //           month: "long",
  //           day: "numeric",
  //           year: "numeric",
  //         })}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const member = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="size-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="size-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(member._id)}
  //           >
  //             Copy member ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View Details</DropdownMenuItem>
  //           <DropdownMenuItem>Edit Member</DropdownMenuItem>
  //           <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

type ClubMemberListProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  members: TUser[];
};

export default function IssueWhoShouldAddresList({
  isModalOpen,
  members,
  setIsModalOpen,
}: ClubMemberListProps) {
  console.log(members);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl gap-0 p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Who should Address</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <div className="flex items-center justify-between gap-4 py-4">
            <Input
              placeholder="Search for members..."
              value={
                (table.getColumn("user")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("user")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <div className="flex items-center space-x-2">
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button> */}
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getFilteredRowModel().rows?.length ? (
                  table.getFilteredRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
