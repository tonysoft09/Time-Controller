import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FolderOpen,
  Plus,
  BarChart3,
  MoreVertical,
  Pencil,
  Trash2,
  BookOpen,
  Download,
  Upload,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ImportExportDialog from "./ImportExportDialog";

export default function AppSidebar() {
  const [location, setLocation] = useLocation();
  const {
    collections,
    activeCollectionId,
    setActiveCollectionId,
    addCollection,
    updateCollection,
    deleteCollection,
  } = useApp();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleAddCollection = () => {
    if (formData.name.trim()) {
      const newCol = addCollection(formData.name.trim(), formData.description.trim());
      setActiveCollectionId(newCol.id);
      setFormData({ name: "", description: "" });
      setIsAddDialogOpen(false);
      setLocation("/");
    }
  };

  const handleEditCollection = () => {
    if (formData.name.trim() && selectedCollection) {
      updateCollection(selectedCollection.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      setFormData({ name: "", description: "" });
      setSelectedCollection(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteCollection = () => {
    if (selectedCollection) {
      deleteCollection(selectedCollection.id);
      setSelectedCollection(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (collection) => {
    setSelectedCollection(collection);
    setFormData({ name: collection.name, description: collection.description || "" });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (collection) => {
    setSelectedCollection(collection);
    setIsDeleteDialogOpen(true);
  };

  const handleCollectionClick = (collectionId) => {
    setActiveCollectionId(collectionId);
    setLocation("/");
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">FlashLearn</h2>
              <p className="text-xs text-muted-foreground">Kartochka o'rganish</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              To'plamlar
              <SidebarGroupAction asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsAddDialogOpen(true)}
                  data-testid="button-add-collection"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </SidebarGroupAction>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {collections.length === 0 ? (
                  <div className="px-3 py-6 text-center">
                    <FolderOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Hali to'plam yo'q
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddDialogOpen(true)}
                      data-testid="button-create-first-collection"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Yangi to'plam
                    </Button>
                  </div>
                ) : (
                  collections.map((collection) => (
                    <SidebarMenuItem key={collection.id}>
                      <SidebarMenuButton
                        onClick={() => handleCollectionClick(collection.id)}
                        isActive={activeCollectionId === collection.id && location === "/"}
                        className="group"
                        data-testid={`sidebar-collection-${collection.id}`}
                      >
                        <FolderOpen className="h-4 w-4" />
                        <span className="flex-1 truncate">{collection.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {collection.cardCount}
                        </span>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            data-testid={`button-collection-menu-${collection.id}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(collection)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(collection)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            O'chirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => setIsImportExportOpen(true)}
            data-testid="button-import-export"
          >
            <Download className="h-4 w-4 mr-2" />
            Import/Export
          </Button>
          <Link href="/statistics">
            <Button
              variant={location === "/statistics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              data-testid="link-statistics"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistika
            </Button>
          </Link>
        </SidebarFooter>
      </Sidebar>

      {/* Add Collection Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi to'plam</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Nomi</Label>
              <Input
                id="collection-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masalan: Inglizcha so'zlar"
                data-testid="input-collection-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-desc">Tavsif (ixtiyoriy)</Label>
              <Textarea
                id="collection-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="To'plam haqida qisqacha..."
                className="resize-none"
                rows={3}
                data-testid="input-collection-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleAddCollection} data-testid="button-save-collection">
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>To'plamni tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-collection-name">Nomi</Label>
              <Input
                id="edit-collection-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-edit-collection-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-collection-desc">Tavsif</Label>
              <Textarea
                id="edit-collection-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="resize-none"
                rows={3}
                data-testid="input-edit-collection-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleEditCollection} data-testid="button-update-collection">
              Yangilash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>To'plamni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedCollection?.name}" to'plamini o'chirishni xohlaysizmi? 
              Barcha kartalar ham o'chiriladi. Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCollection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-collection"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import/Export Dialog */}
      <ImportExportDialog open={isImportExportOpen} onOpenChange={setIsImportExportOpen} />
    </>
  );
}
