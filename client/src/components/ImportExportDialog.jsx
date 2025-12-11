import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Upload, Copy, Check, FileJson } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function ImportExportDialog({ open, onOpenChange }) {
  const { exportData, importData } = useApp();
  const { toast } = useToast();
  const [importText, setImportText] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flashlearn-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Eksport muvaffaqiyatli",
      description: "Ma'lumotlar JSON formatida yuklab olindi",
    });
  };

  const handleCopy = async () => {
    const data = exportData();
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Nusxalandi",
      description: "JSON ma'lumotlar buferga nusxalandi",
    });
  };

  const handleImportFromText = () => {
    if (!importText.trim()) {
      toast({
        title: "Xato",
        description: "JSON matn kiriting",
        variant: "destructive",
      });
      return;
    }

    const result = importData(importText);
    if (result.success) {
      toast({
        title: "Import muvaffaqiyatli",
        description: "Ma'lumotlar yuklandi",
      });
      setImportText("");
      onOpenChange(false);
    } else {
      toast({
        title: "Xato",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        const result = importData(text);
        if (result.success) {
          toast({
            title: "Import muvaffaqiyatli",
            description: "Ma'lumotlar yuklandi",
          });
          onOpenChange(false);
        } else {
          toast({
            title: "Xato",
            description: result.error,
            variant: "destructive",
          });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import / Export</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export" data-testid="tab-export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import" data-testid="tab-import">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Barcha to'plamlar va kartalarni JSON formatida eksport qiling
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleExport} className="w-full" data-testid="button-download-json">
                <Download className="h-4 w-4 mr-2" />
                JSON fayl yuklab olish
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="w-full"
                data-testid="button-copy-json"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Nusxalandi!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Buferga nusxalash
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              JSON formatidagi ma'lumotlarni import qiling
            </p>

            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              data-testid="button-upload-json"
            >
              <FileJson className="h-4 w-4 mr-2" />
              JSON fayl tanlash
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">yoki</span>
              </div>
            </div>

            <Textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"collections": [...], "cards": [...]}'
              className="min-h-32 font-mono text-sm"
              data-testid="textarea-import-json"
            />

            <Button
              onClick={handleImportFromText}
              className="w-full"
              disabled={!importText.trim()}
              data-testid="button-import-from-text"
            >
              <Upload className="h-4 w-4 mr-2" />
              Matndan import qilish
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
