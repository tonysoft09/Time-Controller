import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Play,
  Pencil,
  Trash2,
  BookOpen,
  Layers,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import CardReview from "../components/CardReview";

export default function Home() {
  const {
    collections,
    cards,
    activeCollectionId,
    addCard,
    updateCard,
    deleteCard,
    getCardsForReview,
    setActiveCollectionId,
  } = useApp();

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardForm, setCardForm] = useState({ front: "", back: "" });

  const activeCollection = useMemo(
    () => collections.find((c) => c.id === activeCollectionId),
    [collections, activeCollectionId]
  );

  const collectionCards = useMemo(
    () => cards.filter((c) => c.collectionId === activeCollectionId),
    [cards, activeCollectionId]
  );

  const cardsForReview = useMemo(
    () => getCardsForReview(activeCollectionId),
    [getCardsForReview, activeCollectionId]
  );

  const handleAddCard = () => {
    if (cardForm.front.trim() && cardForm.back.trim() && activeCollectionId) {
      addCard(activeCollectionId, cardForm.front.trim(), cardForm.back.trim());
      setCardForm({ front: "", back: "" });
      setIsAddCardOpen(false);
    }
  };

  const handleEditCard = () => {
    if (cardForm.front.trim() && cardForm.back.trim() && selectedCard) {
      updateCard(selectedCard.id, {
        front: cardForm.front.trim(),
        back: cardForm.back.trim(),
      });
      setCardForm({ front: "", back: "" });
      setSelectedCard(null);
      setIsEditCardOpen(false);
    }
  };

  const handleDeleteCard = () => {
    if (selectedCard) {
      deleteCard(selectedCard.id);
      setSelectedCard(null);
      setIsDeleteCardOpen(false);
    }
  };

  const openEditCard = (card) => {
    setSelectedCard(card);
    setCardForm({ front: card.front, back: card.back });
    setIsEditCardOpen(true);
  };

  const openDeleteCard = (card) => {
    setSelectedCard(card);
    setIsDeleteCardOpen(true);
  };

  const getDifficultyBadge = (difficulty) => {
    const variants = {
      easy: { className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20", label: "Oson" },
      medium: { className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20", label: "O'rta" },
      hard: { className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", label: "Qiyin" },
    };
    const variant = variants[difficulty] || variants.medium;
    return (
      <Badge variant="outline" className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  // No collection selected state
  if (!activeCollectionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Layers className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Xush kelibsiz!</h2>
          <p className="text-muted-foreground mb-6">
            O'rganishni boshlash uchun chap tarafdagi menyudan to'plam tanlang yoki yangi to'plam yarating.
          </p>
          {collections.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">Mavjud to'plamlar:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {collections.slice(0, 5).map((col) => (
                  <Button
                    key={col.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveCollectionId(col.id)}
                    data-testid={`button-select-collection-${col.id}`}
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    {col.name}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Yangi to'plam yaratish uchun <span className="font-medium">+</span> tugmasini bosing
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Collection Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold mb-2" data-testid="text-collection-title">
              {activeCollection?.name}
            </h1>
            {activeCollection?.description && (
              <p className="text-muted-foreground">{activeCollection.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddCardOpen(true)}
              data-testid="button-add-card"
            >
              <Plus className="h-4 w-4 mr-2" />
              Karta qo'shish
            </Button>
            {cardsForReview.length > 0 && (
              <Button onClick={() => setIsReviewOpen(true)} data-testid="button-start-review">
                <Play className="h-4 w-4 mr-2" />
                O'rganish ({cardsForReview.length})
              </Button>
            )}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold" data-testid="text-total-cards">
                {collectionCards.length}
              </div>
              <div className="text-sm text-muted-foreground">Jami kartalar</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary" data-testid="text-cards-to-review">
                {cardsForReview.length}
              </div>
              <div className="text-sm text-muted-foreground">Takrorlash kerak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {collectionCards.filter((c) => c.difficulty === "easy").length}
              </div>
              <div className="text-sm text-muted-foreground">Oson</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {collectionCards.filter((c) => c.difficulty === "hard").length}
              </div>
              <div className="text-sm text-muted-foreground">Qiyin</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cards List */}
      {collectionCards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Hali kartalar yo'q</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-sm">
              Birinchi kartangizni qo'shing va o'rganishni boshlang
            </p>
            <Button onClick={() => setIsAddCardOpen(true)} data-testid="button-add-first-card">
              <Plus className="h-4 w-4 mr-2" />
              Birinchi kartani qo'shish
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Kartalar
            </CardTitle>
            <Badge variant="secondary">{collectionCards.length} ta</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="max-h-[500px]">
              <div className="divide-y">
                {collectionCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center gap-4 px-6 py-4 hover-elevate group"
                    data-testid={`card-item-${card.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" data-testid={`text-card-front-${card.id}`}>
                        {card.front}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {card.back}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getDifficultyBadge(card.difficulty)}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditCard(card)}
                          data-testid={`button-edit-card-${card.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteCard(card)}
                          data-testid={`button-delete-card-${card.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Add Card Dialog */}
      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi karta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="card-front">Old tomon (savol)</Label>
              <Textarea
                id="card-front"
                value={cardForm.front}
                onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
                placeholder="Savol yoki atama..."
                className="min-h-24"
                data-testid="input-card-front"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-back">Orqa tomon (javob)</Label>
              <Textarea
                id="card-back"
                value={cardForm.back}
                onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
                placeholder="Javob yoki ta'rif..."
                className="min-h-24"
                data-testid="input-card-back"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              onClick={handleAddCard}
              disabled={!cardForm.front.trim() || !cardForm.back.trim()}
              data-testid="button-save-card"
            >
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog open={isEditCardOpen} onOpenChange={setIsEditCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kartani tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-card-front">Old tomon (savol)</Label>
              <Textarea
                id="edit-card-front"
                value={cardForm.front}
                onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
                className="min-h-24"
                data-testid="input-edit-card-front"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-card-back">Orqa tomon (javob)</Label>
              <Textarea
                id="edit-card-back"
                value={cardForm.back}
                onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
                className="min-h-24"
                data-testid="input-edit-card-back"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCardOpen(false)}>
              Bekor qilish
            </Button>
            <Button
              onClick={handleEditCard}
              disabled={!cardForm.front.trim() || !cardForm.back.trim()}
              data-testid="button-update-card"
            >
              Yangilash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Card Confirmation */}
      <AlertDialog open={isDeleteCardOpen} onOpenChange={setIsDeleteCardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kartani o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kartani o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-card"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Card Review Modal */}
      <CardReview
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        cards={cardsForReview}
      />
    </div>
  );
}
