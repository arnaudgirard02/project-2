import { SubscriptionPlan } from '@/lib/types/subscription';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    description: 'Pour découvrir iTeach',
    price: 0,
    features: [
      '✓ Accès à la base de données d\'exercices',
      '✓ Consultation de 5 exercices par mois',
      '✗ Création d\'exercices non disponible',
      '✗ Pas d\'accès à la communauté',
      '✗ Pas de statistiques avancées'
    ],
    limits: {
      exerciseViews: 5,
      exerciseCreation: 0,
      communityAccess: false,
      analytics: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Pour les enseignants actifs',
    price: 6.99,
    features: [
      '✓ Accès à la base de données d\'exercices',
      '✓ Consultation de 50 exercices par mois',
      '✓ Création de 20 exercices par mois',
      '✓ Accès à la communauté iTeach',
      '✓ Interaction avec les autres membres',
      '✗ Pas de statistiques avancées'
    ],
    limits: {
      exerciseViews: 50,
      exerciseCreation: 20,
      communityAccess: true,
      analytics: false
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour une utilisation intensive',
    price: 9.99,
    features: [
      '✓ Accès illimité à la base de données',
      '✓ Consultation illimitée d\'exercices',
      '✓ Création illimitée d\'exercices',
      '✓ Accès à la communauté iTeach',
      '✓ Interaction avec les autres membres',
      '✓ Statistiques d\'utilisation avancées'
    ],
    limits: {
      exerciseViews: Infinity,
      exerciseCreation: Infinity,
      communityAccess: true,
      analytics: true
    }
  }
];