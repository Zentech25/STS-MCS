import { useState, useRef } from "react";
import { X, ImagePlus, Palette, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTargetDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; targetImage: File; colorCodeImage: File; zones: number }) => void;
}

export function AddTargetDialog({ open, onClose, onAdd }: AddTargetDialogProps) {
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [colorCodeImage, setColorCodeImage] = useState<File | null>(null);
  const [zones, setZones] = useState(4);
  const [name, setName] = useState("");
  const targetInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const targetPreview = targetImage ? URL.createObjectURL(targetImage) : null;
  const colorPreview = colorCodeImage ? URL.createObjectURL(colorCodeImage) : null;

  const canSubmit = targetImage && colorCodeImage && zones > 0 && name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onAdd({ name: name.trim(), targetImage: targetImage!, colorCodeImage: colorCodeImage!, zones });
    handleClose();
  };

  const handleClose = () => {
    setTargetImage(null);
    setColorCodeImage(null);
    setZones(4);
    setName("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl mx-4 rounded-2xl p-6 flex flex-col gap-5 shadow-2xl"
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Add Custom Target</h2>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Custom Silhouette"
            className="h-9 rounded-xl text-sm"
          />
        </div>

        {/* Upload buttons + zones */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Image</label>
            <input
              ref={targetInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) setTargetImage(e.target.files[0]); }}
            />
            <Button
              variant={targetImage ? "secondary" : "outline"}
              className="h-10 rounded-xl gap-2 text-sm"
              onClick={() => targetInputRef.current?.click()}
            >
              <ImagePlus className="w-4 h-4" />
              {targetImage ? "Change" : "Upload"}
            </Button>
            {targetImage && (
              <span className="text-xs text-muted-foreground truncate">{targetImage.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Color Code</label>
            <input
              ref={colorInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) setColorCodeImage(e.target.files[0]); }}
            />
            <Button
              variant={colorCodeImage ? "secondary" : "outline"}
              className="h-10 rounded-xl gap-2 text-sm"
              onClick={() => colorInputRef.current?.click()}
            >
              <Palette className="w-4 h-4" />
              {colorCodeImage ? "Change" : "Upload"}
            </Button>
            {colorCodeImage && (
              <span className="text-xs text-muted-foreground truncate">{colorCodeImage.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Number of Zones</label>
            <Input
              type="number"
              value={zones}
              onChange={(e) => setZones(Math.max(1, Number(e.target.value)))}
              min={1}
              max={20}
              className="h-10 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Preview */}
        {(targetPreview || colorPreview) && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              Preview
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center aspect-square"
                style={{ background: "hsl(var(--muted) / 0.3)", border: "1px solid hsl(var(--border))" }}
              >
                {targetPreview ? (
                  <img src={targetPreview} alt="Target" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">Target Image</span>
                )}
              </div>
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center aspect-square"
                style={{ background: "hsl(var(--muted) / 0.3)", border: "1px solid hsl(var(--border))" }}
              >
                {colorPreview ? (
                  <img src={colorPreview} alt="Color Code" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">Color Code Image</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <span className="text-xs text-muted-foreground">Target Image</span>
              <span className="text-xs text-muted-foreground">Color Code Map</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" className="rounded-xl" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="rounded-xl gap-2"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Add Target
          </Button>
        </div>
      </div>
    </div>
  );
}
