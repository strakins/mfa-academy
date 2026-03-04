import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function StudentPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">Student Dashboard</h1>
      </CardHeader>
      <CardContent className="text-sm text-neutral-600">
        Role-guarded route. Next: cohort content access after payment approval.
      </CardContent>
    </Card>
  );
}
