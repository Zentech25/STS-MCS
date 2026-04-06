import imgFig120cm from "@/assets/targets/Fig120cm.jpg";
import imgFig120x4 from "@/assets/targets/Fig120x4.jpg";
import imgSmallBlue from "@/assets/targets/small_target_blue.jpg";
import imgSmallRed from "@/assets/targets/small_target_red.jpg";
import imgSPG from "@/assets/targets/SPGTarget.jpg";
import imgTarget3 from "@/assets/targets/Target_3.jpg";
import imgFig11 from "@/assets/targets/Fig11.jpg";
import imgFig11Line from "@/assets/targets/Fig11_Line.jpg";
import imgFig12 from "@/assets/targets/Fig12.jpg";

export interface TargetType {
  id: string;
  label: string;
  image: string;
  zones: number;
}

export const TARGETS: TargetType[] = [
  { id: "fig120cm", label: "Fig 120cm (Concentric)", image: imgFig120cm, zones: 10 },
  { id: "fig120x4", label: "Fig 120 Bullseye", image: imgFig120x4, zones: 10 },
  { id: "fig11", label: "Fig 11 Soldier", image: imgFig11, zones: 8 },
  { id: "fig11-line", label: "Fig 11 Line Target", image: imgFig11Line, zones: 8 },
  { id: "fig12", label: "Fig 12 Silhouette", image: imgFig12, zones: 6 },
  { id: "spg", label: "SPG Target", image: imgSPG, zones: 6 },
  { id: "target3", label: "Hostage / No-Shoot", image: imgTarget3, zones: 4 },
  { id: "small-blue", label: "Small Target (Blue)", image: imgSmallBlue, zones: 3 },
  { id: "small-red", label: "Small Target (Red)", image: imgSmallRed, zones: 3 },
];

export function getTargetById(id: string): TargetType | undefined {
  return TARGETS.find((t) => t.id === id);
}
