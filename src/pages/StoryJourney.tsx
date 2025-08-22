import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  MapPin, 
  Play, 
  Lock, 
  CheckCircle2, 
  Sprout,
  Droplets,
  Sun,
  Trophy
} from "lucide-react"

const storyChapters = [
  {
    id: 1,
    title: "Welcome to Green Valley Farm",
    description: "Meet Sarah, a young farmer inheriting her grandmother's farm. Learn the basics of sustainable farming.",
    icon: Sprout,
    status: "completed",
    progress: 100,
    duration: "15 min"
  },
  {
    id: 2,
    title: "The Drought Challenge",
    description: "Water becomes scarce. Use NASA satellite data to optimize irrigation and save the crops.",
    icon: Droplets,
    status: "current",
    progress: 60,
    duration: "20 min"
  },
  {
    id: 3,
    title: "Climate Data Analytics",
    description: "Learn to interpret weather patterns and make data-driven farming decisions.",
    icon: Sun,
    status: "locked",
    progress: 0,
    duration: "25 min"
  },
  {
    id: 4,
    title: "Harvest Success",
    description: "Apply everything you've learned to achieve a successful sustainable harvest.",
    icon: Trophy,
    status: "locked",
    progress: 0,
    duration: "30 min"
  }
]

export default function StoryJourney() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Farm Story Journey</h1>
        <p className="text-muted-foreground mt-2">
          Follow Sarah's farming journey and learn sustainable agriculture through interactive storytelling
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
            <CardDescription>Chapter 2 of 4 - The Drought Challenge</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={42.5} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">42% Complete</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {storyChapters.map((chapter) => {
          const IconComponent = chapter.icon
          
          return (
            <Card key={chapter.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      chapter.status === 'completed' ? 'bg-primary text-primary-foreground' :
                      chapter.status === 'current' ? 'bg-secondary text-secondary-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Chapter {chapter.id}: {chapter.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {chapter.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      chapter.status === 'completed' ? 'default' :
                      chapter.status === 'current' ? 'secondary' : 'outline'
                    }>
                      {chapter.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {chapter.status === 'locked' && <Lock className="h-3 w-3 mr-1" />}
                      {chapter.status === 'current' && <MapPin className="h-3 w-3 mr-1" />}
                      {chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {chapter.status !== 'locked' && (
                      <div className="mb-3">
                        <Progress value={chapter.progress} className="w-full h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {chapter.progress}% complete
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Duration: {chapter.duration}
                    </p>
                  </div>
                  
                  <Button 
                    disabled={chapter.status === 'locked'}
                    variant={chapter.status === 'completed' ? 'outline' : 'default'}
                  >
                    {chapter.status === 'locked' && <Lock className="h-4 w-4 mr-2" />}
                    {chapter.status !== 'locked' && <Play className="h-4 w-4 mr-2" />}
                    {chapter.status === 'completed' ? 'Replay' : 
                     chapter.status === 'current' ? 'Continue' : 'Locked'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}