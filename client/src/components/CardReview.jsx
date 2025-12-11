import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Clock,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function CardReview({ open, onOpenChange, cards }) {
  const { reviewCard } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setIsComplete(false);
      setReviewedCount(0);
    }
  }, [open]);

  const handleReview = useCallback(
    (action) => {
      if (!currentCard) return;

      reviewCard(currentCard.id, action);
      setReviewedCount((prev) => prev + 1);

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        setIsComplete(true);
      }
    },
    [currentCard, currentIndex, cards.length, reviewCard]
  );

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
    setReviewedCount(0);
  };

  if (cards.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span>Kartalarni takrorlash</span>
            {!isComplete && (
              <Badge variant="outline">
                {currentIndex + 1} / {cards.length}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {!isComplete && (
          <Progress value={progress} className="h-2 mb-4" data-testid="progress-review" />
        )}

        {isComplete ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2" data-testid="text-review-complete">
              Ajoyib!
            </h3>
            <p className="text-muted-foreground mb-6">
              Siz {reviewedCount} ta kartani takrorladingiz
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRestart} data-testid="button-restart-review">
                <RotateCcw className="h-4 w-4 mr-2" />
                Qaytadan boshlash
              </Button>
              <Button onClick={() => onOpenChange(false)} data-testid="button-finish-review">
                <Sparkles className="h-4 w-4 mr-2" />
                Tugatish
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Flashcard */}
            <div className="perspective-1000">
              <Card
                className="min-h-72 cursor-pointer transition-all duration-300 transform-style-preserve-3d relative"
                onClick={handleFlip}
                data-testid="card-flashcard"
              >
                <CardContent className="flex flex-col items-center justify-center h-full min-h-72 p-8">
                  <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleFlip(); }}>
                      {isFlipped ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  <Badge variant="secondary" className="mb-4">
                    {isFlipped ? "Javob" : "Savol"}
                  </Badge>

                  <p
                    className="text-2xl font-medium text-center leading-relaxed"
                    data-testid={isFlipped ? "text-card-answer" : "text-card-question"}
                  >
                    {isFlipped ? currentCard?.back : currentCard?.front}
                  </p>

                  {!isFlipped && (
                    <p className="text-sm text-muted-foreground mt-6">
                      Ko'rish uchun bosing
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            {isFlipped && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                <Button
                  variant="outline"
                  className="flex-1 py-6 bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                  onClick={() => handleReview("known")}
                  data-testid="button-known"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">Bilib oldim</span>
                    <span className="text-xs text-muted-foreground">7 kundan so'ng</span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 py-6 bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10"
                  onClick={() => handleReview("later")}
                  data-testid="button-later"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm font-medium">Keyinroq</span>
                    <span className="text-xs text-muted-foreground">1 kundan so'ng</span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 py-6 bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                  onClick={() => handleReview("hard")}
                  data-testid="button-hard"
                >
                  <div className="flex flex-col items-center gap-1">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-medium">Qiyin</span>
                    <span className="text-xs text-muted-foreground">10 daqiqadan so'ng</span>
                  </div>
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
