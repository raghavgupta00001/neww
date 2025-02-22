import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Bot } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AIDetectorPage() {
  const [text, setText] = useState("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await apiRequest("POST", "/api/analyze", { text });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "Text has been analyzed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              AI Content Detector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your text here to analyze..."
                className="min-h-[200px]"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <Button 
                onClick={() => analyzeMutation.mutate(text)}
                disabled={!text || analyzeMutation.isPending}
                className="w-full"
              >
                {analyzeMutation.isPending ? "Analyzing..." : "Analyze Text"}
              </Button>

              {analyzeMutation.data && (
                <div className="space-y-6 mt-8">
                  <div>
                    <h3 className="text-sm font-medium mb-2">AI-Generated Content Probability</h3>
                    <Progress value={analyzeMutation.data.aiScore} />
                    <p className="text-sm text-gray-500 mt-1">
                      {analyzeMutation.data.aiScore}% likely to be AI-generated
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Plagiarism Score</h3>
                    <Progress 
                      value={analyzeMutation.data.plagiarismScore}
                      className="bg-red-100"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {analyzeMutation.data.plagiarismScore}% content matches other sources
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}