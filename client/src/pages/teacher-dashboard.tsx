import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Assignment, Submission } from "@shared/schema";
import { AssignmentForm } from "@/components/assignment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, LogOut } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function TeacherDashboard() {
  const { user, logoutMutation } = useAuth();

  const { data: assignments = [] } = useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
  });

  const { data: allSubmissions = [] } = useQuery<Submission[]>({
    queryKey: ["/api/submissions/assignment", assignments[0]?.id],
    enabled: assignments.length > 0,
  });

  const totalAssignments = assignments.length;
  const totalSubmissions = allSubmissions.length;
  const averageAiScore = allSubmissions.reduce((acc, sub) => acc + (sub.aiScore || 0), 0) / (totalSubmissions || 1);
  const averagePlagiarismScore = allSubmissions.reduce((acc, sub) => acc + (sub.plagiarismScore || 0), 0) / (totalSubmissions || 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.username}</span>
            <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssignments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average AI Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{averageAiScore.toFixed(1)}%</div>
                <Progress value={averageAiScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Average Plagiarism</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{averagePlagiarismScore.toFixed(1)}%</div>
                <Progress value={averagePlagiarismScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Assignments & Submissions</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <AssignmentForm />
              </DialogContent>
            </Dialog>
          </div>

          {assignments.map((assignment) => {
            const submissions = allSubmissions.filter(
              (s) => s.assignmentId === assignment.id
            );

            return (
              <Card key={assignment.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Due: {format(new Date(assignment.dueDate), "PPP")}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead>File</TableHead>
                          <TableHead>AI Detection</TableHead>
                          <TableHead>Plagiarism</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            <TableCell>{submission.studentId}</TableCell>
                            <TableCell>
                              {format(new Date(submission.submitDate), "PP")}
                            </TableCell>
                            <TableCell>{submission.fileName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={submission.aiScore} 
                                  className="w-24"
                                />
                                <span className="text-sm">
                                  {submission.aiScore}%
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  value={submission.plagiarismScore} 
                                  className="w-24"
                                />
                                <span className="text-sm">
                                  {submission.plagiarismScore}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}