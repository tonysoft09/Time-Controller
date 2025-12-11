import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Statistics() {
  const { stats, cards, collections } = useApp();

  const hardCardsList = useMemo(() => {
    return cards.filter((card) => stats.hardCards.includes(card.id));
  }, [cards, stats.hardCards]);

  const collectionStats = useMemo(() => {
    return collections.map((col) => {
      const colCards = cards.filter((c) => c.collectionId === col.id);
      const easyCount = colCards.filter((c) => c.difficulty === "easy").length;
      const hardCount = colCards.filter((c) => c.difficulty === "hard").length;
      return {
        ...col,
        easyCount,
        hardCount,
        totalCards: colCards.length,
      };
    });
  }, [collections, cards]);

  const getCollectionName = (collectionId) => {
    return collections.find((c) => c.id === collectionId)?.name || "Noma'lum";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Statistika
        </h1>
        <p className="text-muted-foreground">
          O'qish progressingizni kuzating
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="text-3xl font-bold" data-testid="text-today-reviewed">
              {stats.todayReviewed}
            </div>
            <div className="text-sm text-muted-foreground">Bugun o'qilgan</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold" data-testid="text-today-added">
              {stats.todayAdded}
            </div>
            <div className="text-sm text-muted-foreground">Bugun qo'shilgan</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold" data-testid="text-total-cards">
              {stats.totalCards}
            </div>
            <div className="text-sm text-muted-foreground">Jami kartalar</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="text-3xl font-bold" data-testid="text-hard-cards">
              {stats.hardCards.length}
            </div>
            <div className="text-sm text-muted-foreground">Qiyin kartalar</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hard Cards List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Qiyin kartalar
            </CardTitle>
            <Badge variant="destructive">{hardCardsList.length} ta</Badge>
          </CardHeader>
          <CardContent>
            {hardCardsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
                <p className="text-muted-foreground">
                  Qiyin deb belgilangan kartalar yo'q
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-64">
                <div className="space-y-3">
                  {hardCardsList.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 rounded-lg bg-muted/50 border"
                      data-testid={`hard-card-${card.id}`}
                    >
                      <p className="font-medium text-sm truncate">{card.front}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {card.back}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {getCollectionName(card.collectionId)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Collection Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              To'plamlar holati
            </CardTitle>
            <Badge variant="secondary">{collections.length} ta</Badge>
          </CardHeader>
          <CardContent>
            {collections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Layers className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Hali to'plamlar yo'q
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-64">
                <div className="space-y-3">
                  {collectionStats.map((col) => (
                    <div
                      key={col.id}
                      className="p-3 rounded-lg bg-muted/50 border"
                      data-testid={`collection-stat-${col.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm truncate flex-1">
                          {col.name}
                        </p>
                        <Badge variant="outline">{col.totalCards} karta</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          {col.easyCount} oson
                        </span>
                        <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-3 w-3" />
                          {col.hardCount} qiyin
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Clock className="h-4 w-4" />
          Oxirgi yangilanish: {stats.lastUpdated || "Hali ma'lumot yo'q"}
        </p>
      </div>
    </div>
  );
}
