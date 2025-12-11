import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">404 - Sahifa topilmadi</h1>
          <p className="text-muted-foreground mb-6">
            Kechirasiz, siz izlayotgan sahifa mavjud emas.
          </p>
          <Link href="/">
            <Button data-testid="button-go-home">
              <Home className="h-4 w-4 mr-2" />
              Bosh sahifaga qaytish
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
