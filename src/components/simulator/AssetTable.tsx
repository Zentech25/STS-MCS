import { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

export interface AssetItem {
  id: string;
  label: string;
}

interface AssetTableProps {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  items: AssetItem[];
  onAdd: (label: string) => void;
  onDelete: (id: string) => void;
  singularName: string;
  showSearch?: boolean;
}

export function AssetTable({ title, icon, accentColor, items, onAdd, onDelete, singularName, showSearch = false }: AssetTableProps) {
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = showSearch && search
    ? items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : items;

  const handleAdd = () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    if (items.some((i) => i.label.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: "Duplicate entry", description: `"${trimmed}" already exists.`, variant: "destructive" });
      return;
    }
    onAdd(trimmed);
    setNewValue("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `hsl(${accentColor} / 0.12)`, color: `hsl(${accentColor})` }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">{title}</h3>
        <span className="text-xs text-muted-foreground ml-1">{items.length} items</span>
        {showSearch && (
          <div className="relative ml-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="h-8 w-48 pl-8 text-sm rounded-lg"
            />
          </div>
        )}
        <div className="ml-auto">
          {isAdding ? (
            <div className="flex items-center gap-1.5">
              <Input
                autoFocus
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") { setIsAdding(false); setNewValue(""); }
                }}
                placeholder={`e.g. New ${singularName}`}
                className="h-8 w-44 text-sm rounded-lg"
              />
              <Button size="sm" className="h-8 rounded-lg text-xs" onClick={handleAdd}>Add</Button>
              <Button size="sm" variant="ghost" className="h-8 rounded-lg text-xs" onClick={() => { setIsAdding(false); setNewValue(""); }}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs rounded-lg gap-1.5"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Add {singularName}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold uppercase tracking-wider w-12">#</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">{singularName} Name</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider w-20 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-8">
                  No {title.toLowerCase()} added yet
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell className="text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{item.label}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {singularName}</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.label}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => onDelete(item.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
