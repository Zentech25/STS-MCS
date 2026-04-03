import { useState, useCallback } from "react";
import {
  ChevronRight, ChevronDown, Plus, Trash2, Edit2, Check, X,
  Building2, Shield, Users, Crosshair, UserCheck, MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────
interface OrbatNode {
  id: string;
  name: string;
  type: "organization" | "regiment" | "unit" | "company" | "platoon" | "section";
  children: OrbatNode[];
  expanded?: boolean;
}

const TYPE_META: Record<OrbatNode["type"], { icon: typeof Building2; color: string; childType?: OrbatNode["type"]; label: string }> = {
  organization: { icon: Building2, color: "160 72% 42%", childType: "regiment", label: "Organization" },
  regiment:     { icon: Shield,    color: "230 80% 60%", childType: "unit",      label: "Regiment" },
  unit:         { icon: Users,     color: "280 65% 60%", childType: "company",   label: "Unit" },
  company:      { icon: Crosshair, color: "40 96% 53%",  childType: "platoon",   label: "Company" },
  platoon:      { icon: UserCheck, color: "200 80% 50%", childType: "section",   label: "Platoon" },
  section:      { icon: Users,     color: "4 80% 58%",                           label: "Section" },
};

let nextId = 100;
const genId = () => `node-${nextId++}`;

// ── Initial mock data ──────────────────────────────────────
const INITIAL_DATA: OrbatNode[] = [
  {
    id: "org-1", name: "Air Force", type: "organization", expanded: true,
    children: [
      {
        id: "reg-1", name: "Regiment", type: "regiment", expanded: true,
        children: [
          {
            id: "unit-1", name: "Unit", type: "unit", expanded: true,
            children: [
              {
                id: "comp-1", name: "Company", type: "company", expanded: true,
                children: [
                  { id: "plat-1", name: "Platoon", type: "platoon", expanded: true, children: [
                    { id: "sec-1", name: "Section", type: "section", children: [] },
                  ]},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "org-2", name: "ARMY", type: "organization", expanded: false,
    children: [
      {
        id: "reg-2", name: "Regiment", type: "regiment", expanded: false,
        children: [
          {
            id: "unit-2", name: "Unit", type: "unit", children: [
              { id: "comp-2", name: "Company", type: "company", children: [
                { id: "plat-2", name: "Platoon", type: "platoon", children: [
                  { id: "sec-2", name: "Section", type: "section", children: [] },
                ]},
              ]},
            ],
          },
        ],
      },
    ],
  },
];

// ── Immutable tree helpers ─────────────────────────────────
function mapTree(nodes: OrbatNode[], id: string, fn: (n: OrbatNode) => OrbatNode | null): OrbatNode[] {
  return nodes.reduce<OrbatNode[]>((acc, node) => {
    if (node.id === id) {
      const result = fn(node);
      if (result) acc.push(result);
    } else {
      acc.push({ ...node, children: mapTree(node.children, id, fn) });
    }
    return acc;
  }, []);
}

// ── Tree node component ───────────────────────────────────
function TreeNode({
  node, depth, onToggle, onRename, onAdd, onDelete,
}: {
  node: OrbatNode;
  depth: number;
  onToggle: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onAdd: (parentId: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);

  const meta = TYPE_META[node.type];
  const Icon = meta.icon;
  const hasChildren = node.children.length > 0;
  const canAddChild = !!meta.childType;

  const commitRename = () => {
    if (editValue.trim()) {
      onRename(node.id, editValue.trim());
    }
    setEditing(false);
  };

  return (
    <div className="select-none">
      {/* Row */}
      <div
        className="group flex items-center gap-1 py-[3px] pr-2 rounded-lg transition-colors hover:bg-muted/40"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {/* Expand / collapse toggle */}
        <button
          onClick={() => hasChildren && onToggle(node.id)}
          className="w-5 h-5 flex items-center justify-center rounded transition-transform"
          style={{ visibility: hasChildren ? "visible" : "hidden" }}
        >
          {node.expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        {/* Icon */}
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ background: `hsl(${meta.color} / 0.12)`, color: `hsl(${meta.color})` }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>

        {/* Name / Edit */}
        {editing ? (
          <form
            onSubmit={(e) => { e.preventDefault(); commitRename(); }}
            className="flex items-center gap-1 flex-1 min-w-0"
          >
            <Input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitRename}
              className="h-6 text-xs py-0 px-2 bg-background/80"
            />
            <button type="submit" className="text-success"><Check className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => setEditing(false)} className="text-destructive"><X className="w-3.5 h-3.5" /></button>
          </form>
        ) : (
          <span
            className="text-[13px] font-medium text-foreground truncate cursor-default"
            onDoubleClick={() => { setEditing(true); setEditValue(node.name); }}
          >
            {node.name}
          </span>
        )}

        {/* Type badge */}
        <span
          className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: `hsl(${meta.color} / 0.08)`, color: `hsl(${meta.color})` }}
        >
          {meta.label}
        </span>

        {/* Actions */}
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={() => { setEditing(true); setEditValue(node.name); }}>
                <Edit2 className="w-3.5 h-3.5 mr-2" /> Rename
              </DropdownMenuItem>
              {canAddChild && (
                <DropdownMenuItem onClick={() => onAdd(node.id)}>
                  <Plus className="w-3.5 h-3.5 mr-2" /> Add {TYPE_META[meta.childType!].label}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(node.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Children */}
      {node.expanded && hasChildren && (
        <div className="relative">
          {/* Vertical guide line */}
          <span
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${depth * 20 + 18}px`,
              background: `hsl(${meta.color} / 0.15)`,
            }}
          />
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              onToggle={onToggle}
              onRename={onRename}
              onAdd={onAdd}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main ORBAT Page ───────────────────────────────────────
export function OrbatPage() {
  const [tree, setTree] = useState<OrbatNode[]>(INITIAL_DATA);

  const toggle = useCallback((id: string) => {
    setTree((prev) => mapTree(prev, id, (n) => ({ ...n, expanded: !n.expanded })));
  }, []);

  const rename = useCallback((id: string, name: string) => {
    setTree((prev) => mapTree(prev, id, (n) => ({ ...n, name })));
    toast.success("Node renamed");
  }, []);

  const addChild = useCallback((parentId: string) => {
    setTree((prev) =>
      mapTree(prev, parentId, (n) => {
        const childType = TYPE_META[n.type].childType;
        if (!childType) return n;
        const newNode: OrbatNode = {
          id: genId(),
          name: `New ${TYPE_META[childType].label}`,
          type: childType,
          children: [],
          expanded: false,
        };
        return { ...n, expanded: true, children: [...n.children, newNode] };
      })
    );
    toast.success("Node added");
  }, []);

  const deleteNode = useCallback((id: string) => {
    setTree((prev) => mapTree(prev, id, () => null));
    toast.success("Node deleted");
  }, []);

  const addOrganization = () => {
    const newOrg: OrbatNode = {
      id: genId(),
      name: "New Organization",
      type: "organization",
      children: [],
      expanded: false,
    };
    setTree((prev) => [...prev, newOrg]);
    toast.success("Organization added");
  };

  return (
    <div className="h-full flex flex-col p-6 gap-4 overflow-hidden animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-bold text-foreground">ORBAT Structure</h2>
          <p className="text-xs text-muted-foreground">
            Order of Battle — double-click to rename, right-click or hover for actions
          </p>
        </div>
        <Button onClick={addOrganization} size="sm" className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Add Organization
        </Button>
      </div>

      {/* Tree */}
      <div
        className="flex-1 overflow-y-auto rounded-xl p-3"
        style={{
          background: "var(--surface-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--divider)",
        }}
      >
        {tree.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Building2 className="w-10 h-10 opacity-30" />
            <p className="text-sm">No organizations yet. Click "Add Organization" to start.</p>
          </div>
        ) : (
          tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              onToggle={toggle}
              onRename={rename}
              onAdd={addChild}
              onDelete={deleteNode}
            />
          ))
        )}
      </div>
    </div>
  );
}
