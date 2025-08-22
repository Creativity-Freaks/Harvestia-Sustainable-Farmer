import { FarmingCard } from "@/components/FarmingCard";
import { FarmingTip } from "@/components/FarmingTip";
import { useState } from "react";
import { Sprout, Droplets, Beef, BarChart3, Map, BookOpen, Trophy, User } from "lucide-react";

const Index = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const farmingModules = [
    {
      id: "crops",
      title: "Crop Management",
      description: "Monitor and optimize crop growth using satellite data",
      icon: <Sprout className="h-8 w-8" />,
      color: "primary" as const
    },
    {
      id: "irrigation", 
      title: "Smart Irrigation",
      description: "Water management with SMAP soil moisture data",
      icon: <Droplets className="h-8 w-8" />,
      color: "accent" as const
    },
    {
      id: "livestock",
      title: "Livestock Grazing",
      description: "Optimize pasture management and animal health",
      icon: <Beef className="h-8 w-8" />,
      color: "secondary" as const
    },
    {
      id: "analytics",
      title: "Farm Analytics", 
      description: "Data insights from NASA climate datasets",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "muted" as const
    },
    {
      id: "mapping",
      title: "Field Mapping",
      description: "Interactive satellite imagery analysis",
      icon: <Map className="h-8 w-8" />,
      color: "primary" as const
    },
    {
      id: "learning",
      title: "Farming Guide",
      description: "Learn sustainable agriculture practices",
      icon: <BookOpen className="h-8 w-8" />,
      color: "accent" as const
    }
  ];

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          HARVESTIA
        </h1>
        <p className="text-xl text-muted-foreground">
          Welcome back, Sustainable Farmer! 
        </p>
        <p className="text-foreground/80 max-w-2xl mx-auto">
          Your gateway to data-driven sustainable agriculture using NASA satellite insights
        </p>
      </div>

        {/* Daily Farming Tip */}
        <FarmingTip />

        {/* Farming Modules Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Explore Your Farm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmingModules.map((module) => (
              <FarmingCard
                key={module.id}
                title={module.title}
                description={module.description}
                icon={module.icon}
                color={module.color}
                onClick={() => setSelectedModule(module.id)}
              />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-2xl font-bold text-primary">12</div>
            <div className="text-sm text-muted-foreground">Fields Monitored</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-2xl font-bold text-accent">85%</div>
            <div className="text-sm text-muted-foreground">Water Efficiency</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-2xl font-bold text-primary">2.1k</div>
            <div className="text-sm text-muted-foreground">Sustainability Score</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <div className="text-2xl font-bold text-accent">7</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
        </section>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
        Explore • Learn • Discover • Harvest
      </footer>
    </main>
  );
};

export default Index;
