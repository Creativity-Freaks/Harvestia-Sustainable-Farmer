import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  Play, 
  Award, 
  Clock, 
  Users,
  Star,
  ChevronRight
} from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Sustainable Farming Fundamentals",
    description: "Learn the core principles of sustainable agriculture and environmental stewardship.",
    instructor: "Dr. Maria Rodriguez",
    duration: "4 weeks",
    difficulty: "Beginner",
    rating: 4.8,
    students: 1250,
    progress: 0,
    certificate: true,
    lessons: 12,
    quickFacts: [
      "Sustainable farming can increase crop yields by 20-30%",
      "Organic matter improves soil water retention by up to 20%",
      "Cover crops can reduce erosion by 90%"
    ]
  },
  {
    id: 2,
    title: "NASA Data for Smart Agriculture",
    description: "Harness satellite data and remote sensing for precision farming decisions.",
    instructor: "Prof. James Chen",
    duration: "6 weeks",
    difficulty: "Intermediate",
    rating: 4.9,
    students: 850,
    progress: 35,
    certificate: true,
    lessons: 18,
    quickFacts: [
      "Satellite data can predict crop yields with 85% accuracy",
      "MODIS sensors can detect plant stress before visible symptoms",
      "Precision agriculture can reduce water usage by 30%"
    ]
  },
  {
    id: 3,
    title: "Climate-Resilient Crop Management",
    description: "Adapt your farming practices to changing climate conditions using data-driven approaches.",
    instructor: "Dr. Sarah Williams",
    duration: "5 weeks",
    difficulty: "Advanced",
    rating: 4.7,
    students: 620,
    progress: 0,
    certificate: true,
    lessons: 15,
    quickFacts: [
      "Climate-adapted varieties can increase yields by 15-40%",
      "Crop diversification reduces risk by 60%",
      "Early warning systems prevent 70% of weather-related losses"
    ]
  }
]

export default function Courses() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Agricultural Courses</h1>
        <p className="text-muted-foreground mt-2">
          Master sustainable farming with expert-led courses and earn certificates
        </p>
      </div>

      <div className="grid gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{course.difficulty}</Badge>
                    {course.certificate && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <Award className="h-3 w-3 mr-1" />
                        Certificate
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                  <CardDescription className="text-base">{course.description}</CardDescription>
                  
                  <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students.toLocaleString()} students
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current text-yellow-500" />
                      {course.rating}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    Instructor: {course.instructor}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="w-full" />
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  💡 Quick Facts
                </h4>
                <div className="space-y-1">
                  {course.quickFacts.map((fact, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-start">
                      <ChevronRight className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                      {fact}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </Button>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}