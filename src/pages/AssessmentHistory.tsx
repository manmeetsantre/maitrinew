import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  History, 
  Trash2, 
  Calendar,
  ArrowLeft,
  ClipboardCheck,
  AlertCircle
} from "lucide-react";
import { API_URL } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getSeverityColor } from "@/components/ui/AssessmentCharts";

interface AssessmentHistoryItem {
  id: number;
  assessment_type: string;
  answers: { [key: string]: number };
  results: Array<{
    toolName: string;
    category: string;
    score: number;
    maxScore: number;
    severity: string;
    riskLevel: string;
    requiresFollowUp: boolean;
    description: string;
    recommendations: string[];
  }>;
  created_at: string;
}

export default function AssessmentHistory() {
  const [assessments, setAssessments] = useState<AssessmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(`${API_URL}/assessment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assessments");
      }

      const data = await response.json();
      setAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast({
        title: "Error",
        description: "Failed to load assessment history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(`${API_URL}/assessment/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete assessment");
      }

      setAssessments(assessments.filter(a => a.id !== id));
      toast({
        title: "Success",
        description: "Assessment deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast({
        title: "Error",
        description: "Failed to delete assessment.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAssessmentTypeLabel = (type: string) => {
    switch (type) {
      case "all":
        return "Complete Assessment";
      case "phq9":
        return "PHQ-9 (Depression)";
      case "gad7":
        return "GAD-7 (Anxiety)";
      case "ghq12":
        return "GHQ-12 (General Health)";
      default:
        return type;
    }
  };

  const getOverallRisk = (results: AssessmentHistoryItem["results"]) => {
    if (results.some(r => r.severity === "severe" || r.severity === "moderately-severe")) {
      return "high";
    }
    if (results.some(r => r.severity === "moderate")) {
      return "medium";
    }
    return "low";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading assessment history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <History className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Assessment History</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/assessment")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessment
            </Button>
          </div>
          <p className="text-muted-foreground">
            View and manage your past assessment results.
          </p>
        </div>

        {assessments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assessment History</h3>
              <p className="text-muted-foreground mb-4">
                You haven't completed any assessments yet.
              </p>
              <Button onClick={() => navigate("/assessment")}>
                Take Your First Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => {
              const overallRisk = getOverallRisk(assessment.results);
              return (
                <Card
                  key={assessment.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/assessment/${assessment.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {getAssessmentTypeLabel(assessment.assessment_type)}
                          </CardTitle>
                          <Badge className={getRiskColor(overallRisk)}>
                            {overallRisk.charAt(0).toUpperCase() + overallRisk.slice(1)} Risk
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(assessment.created_at)}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(assessment.id);
                        }}
                        disabled={deletingId === assessment.id}
                      >
                        {deletingId === assessment.id ? (
                          <div className="h-4 w-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {assessment.results.map((result) => (
                        <div
                          key={result.toolName}
                          className="p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {result.toolName}
                            </span>
                            <Badge
                              className={getSeverityColor(result.severity)}
                            >
                              {result.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Score: {result.score}/{result.maxScore}
                          </div>
                          {result.requiresFollowUp && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                              <AlertCircle className="h-3 w-3" />
                              Follow-up recommended
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/assessment/${assessment.id}`);
                        }}
                      >
                        View Full Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

