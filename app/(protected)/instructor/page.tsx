import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function InstructorPage() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-xl font-semibold">Instructor Dashboard</h1>
      </CardHeader>
      <CardContent className="text-sm text-neutral-600">
        Role-guarded route. Next: upload notes and assignments.
      </CardContent>
    </Card>
  );
}
