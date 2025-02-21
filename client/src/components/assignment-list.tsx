import { Assignment, Submission } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, AlertTriangle, Check } from "lucide-react";
import { FileUpload } from "./file-upload";
import { format } from "date-fns";

interface AssignmentListProps {
  assignments: Assignment[];
  submissions?: Submission[];
  showSubmissions?: boolean;
  showSubmitButton?: boolean;
}

export function AssignmentList({ 
  assignments,
  submissions = [],
  showSubmissions = false,
  showSubmitButton = false,
}: AssignmentListProps) {
  const getSubmissionForAssignment = (assignmentId: number) => {
    return submissions.find(s => s.assignmentId === assignmentId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment) => {
        const submission = getSubmissionForAssignment(assignment.id);
        const isOverdue = new Date(assignment.dueDate) < new Date();
        
        return (
          <Card key={assignment.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{assignment.title}</CardTitle>
                {submission && (
                  <div className="flex items-center space-x-2 text-sm">
                    {submission.aiScore !== undefined && (
                      <span className="text-blue-600">AI: {submission.aiScore}%</span>
                    )}
                    {submission.plagiarismScore !== undefined && (
                      <span className="text-red-600">Plag: {submission.plagiarismScore}%</span>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-gray-600 mb-4">{assignment.description}</p>
              
              <div className="mt-auto space-y-3">
                <div className="text-sm text-gray-500">
                  Due: {format(new Date(assignment.dueDate), "PPP")}
                </div>

                {showSubmissions && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {submissions.filter(s => s.assignmentId === assignment.id).length} submissions
                    </span>
                  </div>
                )}

                {showSubmitButton && (
                  <div className="flex items-center gap-2">
                    {submission ? (
                      <Button variant="outline" className="w-full" disabled>
                        <Check className="h-4 w-4 mr-2" />
                        Submitted
                      </Button>
                    ) : isOverdue ? (
                      <Button variant="destructive" className="w-full" disabled>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Overdue
                      </Button>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full">
                            <FileUp className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <FileUpload assignmentId={assignment.id} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
