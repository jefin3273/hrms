import { Input } from "@/components/ui/input";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface CompanyTableProps {
  companies: any[];
  pageSize: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (company: any) => void;
  isLoading?: boolean;
}

export default function CompanyTable({
  companies,
  pageSize,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  isLoading = false,
}: CompanyTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Postal/Zip Code</TableHead>
              <TableHead>Company Info Updated</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.code}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.address1}</TableCell>
                  <TableCell>{company.city}</TableCell>
                  <TableCell>{company.state}</TableCell>
                  <TableCell>{company.postalCode}</TableCell>
                  <TableCell>{company.infoUpdated ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(company)}
                    >
                      <PenSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Page Size:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Go to Page:</span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                }
              }}
              className="w-16"
            />
            <Button
              variant="secondary"
              onClick={() => {
                const page = Number(currentPage);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                }
              }}
            >
              GO
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Page: {currentPage} of {totalPages}, Total: {companies.length}
          </div>
        </div>
      </div>
    </div>
  );
}
