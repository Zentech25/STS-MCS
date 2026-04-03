// Shared ORBAT types and initial data used by OrbatPage and AddTraineeDialog

export interface OrbatNode {
  id: string;
  name: string;
  type: "organization" | "regiment" | "unit" | "company" | "platoon" | "section";
  children: OrbatNode[];
  expanded?: boolean;
}

export const TYPE_META: Record<
  OrbatNode["type"],
  { color: string; childType?: OrbatNode["type"]; label: string }
> = {
  organization: { color: "160 72% 42%", childType: "regiment", label: "Organization" },
  regiment:     { color: "230 80% 60%", childType: "unit",      label: "Regiment" },
  unit:         { color: "280 65% 60%", childType: "company",   label: "Unit" },
  company:      { color: "40 96% 53%",  childType: "platoon",   label: "Company" },
  platoon:      { color: "200 80% 50%", childType: "section",   label: "Platoon" },
  section:      { color: "4 80% 58%",                           label: "Section" },
};

let nextId = 100;
export const genId = () => `node-${nextId++}`;

export const INITIAL_ORBAT: OrbatNode[] = [
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

// Immutable tree helper
export function mapTree(nodes: OrbatNode[], id: string, fn: (n: OrbatNode) => OrbatNode | null): OrbatNode[] {
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

// Build the ancestor path from root to a given node id
export function getNodePath(nodes: OrbatNode[], targetId: string): OrbatNode[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return [node];
    const childPath = getNodePath(node.children, targetId);
    if (childPath) return [node, ...childPath];
  }
  return null;
}
