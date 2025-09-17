import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BrandDashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">Brand Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Brand Partner!</CardTitle>
          <CardDescription>
            This is your dashboard to connect with artisans and manage collaborations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Brand-specific functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
