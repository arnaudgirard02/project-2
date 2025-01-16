import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

const SUBJECTS = [
  "Français",
  "Mathématiques",
  "Anglais",
  "Histoire-Géographie",
  "Sciences",
  "Physique-Chimie",
];

const LEVELS = [
  "CP", "CE1", "CE2", "CM1", "CM2",
  "6ème", "5ème", "4ème", "3ème",
  "Seconde", "Première", "Terminale",
];

const DIFFICULTIES = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
];

const DURATIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 heure" },
];

export interface ExerciseFilters {
  search: string;
  subject: string;
  level: string;
  difficulty: string;
  duration: string;
}

interface ExerciseFiltersProps {
  filters: ExerciseFilters;
  onFilterChange: (filters: ExerciseFilters) => void;
  className?: string;
}

export function ExerciseFilters({ filters, onFilterChange, className }: ExerciseFiltersProps) {
  return (
    <Card className={`p-4 ${className || ''}`}>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un exercice..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Matière</Label>
            <Select
              value={filters.subject}
              onValueChange={(value) => onFilterChange({ ...filters, subject: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les matières" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {SUBJECTS.map((subject) => (
                  <SelectItem key={subject} value={subject.toLowerCase()}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Niveau</Label>
            <Select
              value={filters.level}
              onValueChange={(value) => onFilterChange({ ...filters, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {LEVELS.map((level) => (
                  <SelectItem key={level} value={level.toLowerCase()}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulté</Label>
            <Select
              value={filters.difficulty}
              onValueChange={(value) => onFilterChange({ ...filters, difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les difficultés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les difficultés</SelectItem>
                {DIFFICULTIES.map((difficulty) => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Durée</Label>
            <Select
              value={filters.duration}
              onValueChange={(value) => onFilterChange({ ...filters, duration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les durées" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les durées</SelectItem>
                {DURATIONS.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}