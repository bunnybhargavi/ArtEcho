import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuyerDashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">Buyer Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Buyer!</CardTitle>
          <CardDescription>
            This is your personal dashboard to manage your favorite items and purchases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Buyer-specific functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
