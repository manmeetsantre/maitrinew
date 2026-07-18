import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Calendar,
  Brain,
  Heart,
  AlertCircle,
  CheckCircle,
  Phone,
  Shield,
  BarChart3
} from "lucide-react";
import { API_URL } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  AssessmentPieChart, 
  AnimatedCircleProgress, 
  getSeverityColor
} from "@/components/ui/AssessmentCharts";

interface AssessmentDetail {
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

export default function AssessmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await fetch(`${API_URL}/assessment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Not Found",
            description: "Assessment not found.",
            variant: "destructive",
          });
          navigate("/assessment/history");
          return;
        }
        throw new Error("Failed to fetch assessment");
      }

      const data = await response.json();
      setAssessment(data);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      toast({
        title: "Error",
        description: "Failed to load assessment details.",
        variant: "destructive",
      });
      navigate("/assessment/history");
    } finally {
      setLoading(false);
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
        return "PHQ-9 (Depression Screening)";
      case "gad7":
        return "GAD-7 (Anxiety Screening)";
      case "ghq12":
        return "GHQ-12 (General Health Questionnaire)";
      default:
        return type;
    }
  };

  const getOverallRisk = (results: AssessmentDetail["results"]) => {
    if (results.some(r => r.severity === "severe" || r.severity === "moderately-severe")) {
      return "high";
    }
    if (results.some(r => r.severity === "moderate")) {
      return "medium";
    }
    return "low";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading assessment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  const overallRisk = getOverallRisk(assessment.results);
  const hasHighRisk = overallRisk === "high";
  const hasFollowUp = assessment.results.some(r => r.requiresFollowUp);

  return (
    <div className="min-h-screen bg-background pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/assessment/history")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to History
          </Button>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold">Assessment Details</h1>
            </div>
            <p className="text-muted-foreground">
              {getAssessmentTypeLabel(assessment.assessment_type)}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {formatDate(assessment.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Risk Card */}
        <Card className={`mb-6 ${overallRisk === 'high' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : 
                         overallRisk === 'medium' ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/10' : 
                         'border-green-200 bg-green-50 dark:bg-green-900/10'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${overallRisk === 'high' ? 'text-red-700 dark:text-red-400' : 
                                  overallRisk === 'medium' ? 'text-orange-700 dark:text-orange-400' : 
                                  'text-green-700 dark:text-green-400'}`}>
              {overallRisk === 'high' ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
              Overall Assessment: {overallRisk.charAt(0).toUpperCase() + overallRisk.slice(1)} Risk
            </CardTitle>
            <CardDescription>
              Assessment completed using standardized screening tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasHighRisk && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <p className="font-medium text-red-800 dark:text-red-200">Immediate Support Recommended</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Your responses indicate significant symptoms that would benefit from professional support.
                </p>
                <div className="flex gap-2">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Crisis Line
                  </Button>
                  <Button variant="outline" className="border-red-200" onClick={() => navigate("/booking")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Counseling
                  </Button>
                </div>
              </div>
            )}
            
            {hasFollowUp && !hasHighRisk && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <p className="font-medium text-orange-800 dark:text-orange-200">Follow-up Recommended</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Consider discussing your results with a mental health professional.
                </p>
                <Button variant="outline" className="border-orange-200" onClick={() => navigate("/booking")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Individual Results */}
        <div className="mb-8 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {assessment.results.map((result) => (
              <Card key={result.toolName} className={result.riskLevel === 'high' ? 'border-red-200' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{result.category}</CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        {result.toolName}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge className={getSeverityColor(result.severity)}>
                        {result.severity}
                      </Badge>
                      {result.requiresFollowUp && (
                        <div className="mt-1">
                          <Badge variant="outline" className="text-xs">
                            Follow-up
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Score: {result.score}/{result.maxScore}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center py-2">
                    <div className="w-full flex justify-center">
                      <AnimatedCircleProgress
                        score={result.score}
                        maxScore={result.maxScore}
                        severity={result.severity}
                        toolName={result.toolName}
                        color={getSeverityColor(result.severity)}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">{result.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {assessment.results.map((result) => (
                <div key={result.category}>
                  <h3 className="font-semibold mb-3">For {result.category}:</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                  {result !== assessment.results[assessment.results.length - 1] && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="justify-start h-auto p-4" variant="outline" onClick={() => navigate("/booking")}>
                <div className="text-left">
                  <div className="font-medium">Book a Counseling Session</div>
                  <div className="text-sm text-muted-foreground">Connect with a professional</div>
                </div>
              </Button>
              <Button className="justify-start h-auto p-4" variant="outline" onClick={() => navigate("/activities")}>
                <div className="text-left">
                  <div className="font-medium">Explore Wellness Activities</div>
                  <div className="text-sm text-muted-foreground">Find activities that help</div>
                </div>
              </Button>
              <Button className="justify-start h-auto p-4" variant="outline" onClick={() => navigate("/community")}>
                <div className="text-left">
                  <div className="font-medium">Join Peer Support</div>
                  <div className="text-sm text-muted-foreground">Connect with others</div>
                </div>
              </Button>
              <Button className="justify-start h-auto p-4" variant="outline" onClick={() => navigate("/assessment")}>
                <div className="text-left">
                  <div className="font-medium">Retake Assessment</div>
                  <div className="text-sm text-muted-foreground">Track your progress</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

