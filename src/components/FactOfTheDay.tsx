import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Calendar } from "lucide-react"

const farmingFacts = [
  {
    fact: "Earthworms can process their own body weight in soil every single day, making them nature's ultimate soil aerators.",
    category: "Soil Health",
    tip: "Encourage earthworms in your garden by adding organic matter like compost."
  },
  {
    fact: "A single mature oak tree can produce enough oxygen for two people for one full year.",
    category: "Environmental",
    tip: "Plant native trees around your farm to improve air quality and provide wildlife habitat."
  },
  {
    fact: "Cover crops can increase soil organic matter by up to 1% annually when properly managed.",
    category: "Sustainable Farming",
    tip: "Plant cover crops like clover or rye grass during off-seasons to protect and enrich soil."
  },
  {
    fact: "Crop rotation can reduce pest populations by up to 80% compared to monoculture farming.",
    category: "Pest Management",
    tip: "Rotate crops from different plant families to break pest and disease cycles naturally."
  }
]

export function FactOfTheDay() {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
  const todaysFact = farmingFacts[dayOfYear % farmingFacts.length]

  return (
    <Card className="bg-gradient-to-br from-accent to-accent/80 border-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-accent-foreground">
          <Lightbulb className="h-5 w-5 mr-2 text-primary" />
          Fact of the Day
          <Calendar className="h-4 w-4 ml-auto text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge variant="secondary" className="text-xs">
          {todaysFact.category}
        </Badge>
        <p className="text-sm font-medium text-accent-foreground">
          {todaysFact.fact}
        </p>
        <div className="p-3 bg-primary/10 rounded-lg">
          <p className="text-xs text-primary font-medium">💡 Pro Tip:</p>
          <p className="text-xs text-muted-foreground mt-1">
            {todaysFact.tip}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}