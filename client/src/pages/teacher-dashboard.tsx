import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Assignment, Submission } from "@shared/schema";
import { AssignmentForm } from "@/components/assignment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, LogOut, TrendingUp, Users, FileText, AlertTriangle } from "lucide-react";
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

  // Calculate statistics
  const totalAssignments = assignments.length;
  const totalSubmissions = allSubmissions.length;
  const totalStudents = new Set(allSubmissions.map(s => s.studentId)).size;

  // AI and Plagiarism Stats
  const averageAiScore = allSubmissions.reduce((acc, sub) => acc + (sub.aiScore || 0), 0) / (totalSubmissions || 1);
  const averagePlagiarismScore = allSubmissions.reduce((acc, sub) => acc + (sub.plagiarismScore || 0), 0) / (totalSubmissions || 1);

  // High Risk Submissions
  const highRiskSubmissions = allSubmissions.filter(
    sub => (sub.aiScore || 0) > 80 || (sub.plagiarismScore || 0) > 50
  ).length;

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
              <CardTitle className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                Total Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssignments}</div>
              <p className="text-sm text-gray-500 mt-1">Active courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-green-500" />
                Active Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-sm text-gray-500 mt-1">Submitted work</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                AI Detection Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{averageAiScore.toFixed(1)}%</div>
                <Progress value={averageAiScore} className="h-2" />
                <p className="text-sm text-gray-500">Average AI probability</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                High Risk Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highRiskSubmissions}</div>
              <p className="text-sm text-gray-500 mt-1">Need review</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Assignments & Submissions</h2>
              <p className="text-sm text-gray-500">Review and manage student work</p>
            </div>
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

            const submissionRate = ((submissions.length / totalStudents) * 100) || 0;

            return (
              <Card key={assignment.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Due: {format(new Date(assignment.dueDate), "PPP")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Submission Rate</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {submissionRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead>File</TableHead>
                          <TableHead>AI Detection</TableHead>
                          <TableHead>Plagiarism</TableHead>
                          <TableHead>Risk Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions.map((submission) => {
                          const riskLevel = 
                            (submission.aiScore || 0) > 80 || (submission.plagiarismScore || 0) > 50
                              ? "High"
                              : (submission.aiScore || 0) > 50 || (submission.plagiarismScore || 0) > 30
                              ? "Medium"
                              : "Low";

                          const riskColor = {
                            High: "text-red-600",
                            Medium: "text-yellow-600",
                            Low: "text-green-600"
                          }[riskLevel];

                          return (
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
                              <TableCell className={riskColor}>
                                {riskLevel}
                              </TableCell>
                            </TableRow>
                          );
                        })}
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