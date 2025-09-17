import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIStoryGenerator from "@/components/dashboard/AIStoryGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">Artisan Dashboard</h1>
      <Tabs defaultValue="story-generator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="story-generator">AI Story Generator</TabsTrigger>
          <TabsTrigger value="products">Manage Products</TabsTrigger>
          <TabsTrigger value="profile">Manage Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="story-generator">
          <AIStoryGenerator />
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Products</CardTitle>
              <CardDescription>
                Add, edit, or remove your products here. This is a placeholder for product management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Product management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Profile</CardTitle>
              <CardDescription>
                Update your personal information and story.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g., Elena Rodriguez" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="craft">Craft</Label>
                <Input id="craft" placeholder="e.g., Ceramics" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., Oaxaca, Mexico" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story">Your Story</Label>
                <Textarea id="story" placeholder="Tell us about your journey as an artisan..." />
              </div>
              <Button>Save Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
