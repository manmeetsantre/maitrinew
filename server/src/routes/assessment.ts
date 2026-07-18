import { Router } from "express";
import { z } from "zod";
import { getDb } from "../setup";
import { requireAuth } from "../middleware";

const router = Router();

const saveAssessmentSchema = z.object({
  assessment_type: z.string(),
  answers: z.record(z.number()),
  results: z.array(z.object({
    toolName: z.string(),
    category: z.string(),
    score: z.number(),
    maxScore: z.number(),
    severity: z.string(),
    riskLevel: z.string(),
    requiresFollowUp: z.boolean(),
    description: z.string(),
    recommendations: z.array(z.string())
  }))
});

router.post("/", requireAuth as any, (req: any, res) => {
  const userId = req.user.userId as number;
  const parse = saveAssessmentSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { assessment_type, answers, results } = parse.data;

  const db = getDb();
  db.prepare(
    "INSERT INTO assessments (user_id, assessment_type, answers, results) VALUES (?, ?, ?, ?)"
  ).run(userId, assessment_type, JSON.stringify(answers), JSON.stringify(results));
  db.close();
  res.json({ message: "Assessment saved successfully" });
});

// GET all assessments for the authenticated user
router.get("/", requireAuth as any, (req: any, res) => {
  const userId = req.user.userId as number;
  const db = getDb();
  
  const assessments = db.prepare(
    "SELECT id, assessment_type, answers, results, created_at FROM assessments WHERE user_id = ? ORDER BY created_at DESC"
  ).all(userId) as any[];
  
  db.close();
  
  const formattedAssessments = assessments.map(assessment => ({
    id: assessment.id,
    assessment_type: assessment.assessment_type,
    answers: JSON.parse(assessment.answers),
    results: JSON.parse(assessment.results),
    created_at: assessment.created_at
  }));
  
  res.json(formattedAssessments);
});

// GET a specific assessment by ID
router.get("/:id", requireAuth as any, (req: any, res) => {
  const userId = req.user.userId as number;
  const assessmentId = parseInt(req.params.id);
  
  if (isNaN(assessmentId)) {
    return res.status(400).json({ error: "Invalid assessment ID" });
  }
  
  const db = getDb();
  const assessment = db.prepare(
    "SELECT id, assessment_type, answers, results, created_at FROM assessments WHERE id = ? AND user_id = ?"
  ).get(assessmentId, userId) as any;
  
  db.close();
  
  if (!assessment) {
    return res.status(404).json({ error: "Assessment not found" });
  }
  
  res.json({
    id: assessment.id,
    assessment_type: assessment.assessment_type,
    answers: JSON.parse(assessment.answers),
    results: JSON.parse(assessment.results),
    created_at: assessment.created_at
  });
});

// DELETE an assessment by ID
router.delete("/:id", requireAuth as any, (req: any, res) => {
  const userId = req.user.userId as number;
  const assessmentId = parseInt(req.params.id);
  
  if (isNaN(assessmentId)) {
    return res.status(400).json({ error: "Invalid assessment ID" });
  }
  
  const db = getDb();
  const result = db.prepare(
    "DELETE FROM assessments WHERE id = ? AND user_id = ?"
  ).run(assessmentId, userId);
  
  db.close();
  
  if (result.changes === 0) {
    return res.status(404).json({ error: "Assessment not found" });
  }
  
  res.json({ message: "Assessment deleted successfully" });
});

export default router;
