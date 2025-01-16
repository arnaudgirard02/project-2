import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Target, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate">
        {/* Background decorations */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-blue-200 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        {/* Main content */}
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:flex lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-4">
            <div className="mt-12 sm:mt-16 lg:mt-8">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                  Nouveauté
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Découvrez notre IA</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </div>
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Créez des exercices personnalisés avec l'IA
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              iTeach révolutionne la création d'exercices scolaires. Notre IA s'adapte au niveau de chaque élève pour un apprentissage plus efficace et engageant.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" size="lg">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats and image section */}
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="relative w-[40rem] h-[35rem] sm:-ml-12 lg:ml-0">
                {/* Background pattern */}
                <div className="absolute w-full h-full">
                  <div className="absolute right-1/2 bottom-1/2 w-72 h-72 rounded-full bg-primary/5" />
                  <div className="absolute left-1/2 top-1/2 w-96 h-96 rounded-full bg-blue-100/20" />
                </div>
                
                {/* Stats cards */}
                <div className="absolute left-10 top-10 w-72 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">1000+</h3>
                      <p className="text-sm text-gray-500">Exercices générés</p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-10 bottom-10 w-72 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">500+</h3>
                      <p className="text-sm text-gray-500">Enseignants satisfaits</p>
                    </div>
                  </div>
                </div>

                {/* Main illustration */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Education illustration"
                    className="w-[400px] h-[300px] rounded-2xl object-cover shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tout ce dont vous avez besoin pour enseigner efficacement
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ils nous font confiance
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Découvrez comment iTeach transforme le quotidien des enseignants
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:mx-0 sm:max-w-none md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                  <div>
                    <div className="relative h-12">
                      <svg
                        className="absolute left-0 top-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-primary/10"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                    </div>
                    <p className="mt-4 text-lg leading-6 italic text-gray-600">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-x-4">
                    <img
                      className="h-12 w-12 rounded-full bg-gray-50 object-cover"
                      src={testimonial.image}
                      alt={testimonial.author}
                    />
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-sm leading-6 text-gray-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote: "iTeach a révolutionné ma façon de corriger. Je gagne un temps précieux que je peux consacrer à l'accompagnement personnalisé de mes élèves.",
    author: "Marie Dubois",
    role: "Professeure de Français, Lycée Victor Hugo",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    quote: "La précision des corrections et la pertinence des commentaires générés par l'IA sont impressionnantes. Mes élèves progressent plus rapidement.",
    author: "Thomas Laurent",
    role: "Professeur de Français, Collège Jean Moulin",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  },
  {
    quote: "Les analyses statistiques m'ont permis d'identifier précisément les points à renforcer dans mon enseignement. Un outil indispensable !",
    author: "Sophie Martin",
    role: "Professeure de Français, Lycée Molière",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
  }
];

const features = [
  {
    name: 'IA Intelligente',
    description: 'Générez des exercices personnalisés en quelques clics grâce à notre IA avancée.',
    icon: <Sparkles className="h-6 w-6 text-primary" />,
  },
  {
    name: 'Personnalisation avancée',
    description: 'Adaptez le contenu au niveau et aux intérêts de chaque élève.',
    icon: <Target className="h-6 w-6 text-primary" />,
  },
  {
    name: 'Base de données collaborative',
    description: 'Accédez à plus de 500 exercices déjà créés par la communauté des enseignants.',
    icon: <BookOpen className="h-6 w-6 text-primary" />,
  },
];