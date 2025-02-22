import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Assignment } from "@shared/schema";
import { QRCodeCanvas } from "qrcode.react"; // Fixed import
import { useAuth } from "@/hooks/use-auth";

export default function QRCodePage() {
  const { user } = useAuth();

  const { data: assignments = [] } = useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
    enabled: !!user,
  });

  const downloadQR = (assignmentId: number, title: string) => {
    const canvas = document.getElementById(`qr-${assignmentId}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${title.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const getAssignmentUploadUrl = (assignmentId: number) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/upload/${assignmentId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-6 w-6" />
              Assignment QR Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <QRCodeCanvas
                        id={`qr-${assignment.id}`}
                        value={getAssignmentUploadUrl(assignment.id)}
                        size={200}
                        level="H"
                        includeMargin
                      />
                      <h3 className="font-medium text-center">{assignment.title}</h3>
                      <Button
                        variant="outline"
                        onClick={() => downloadQR(assignment.id, assignment.title)}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}