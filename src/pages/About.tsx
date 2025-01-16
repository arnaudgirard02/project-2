import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

export function About() {
  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">À propos</h1>
        <p className="text-muted-foreground mt-1">
          En savoir plus sur iTeach
        </p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-6 w-6" />
            Notre mission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            iTeach est une plateforme innovante conçue pour aider les enseignants à créer
            des exercices personnalisés grâce à l'intelligence artificielle.
          </p>
          <p>
            Notre objectif est de simplifier la création de contenu pédagogique tout en
            garantissant une expérience d'apprentissage optimale pour les élèves.
          </p>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={() => window.history.back()}>
              Retour
            </Button>
            <Link to="/register">
              <Button>Commencer</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}