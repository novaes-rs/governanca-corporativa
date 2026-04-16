import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getActiveSession: vi.fn().mockResolvedValue({
    id: 1,
    isActive: true,
    currentSlide: 1,
    projectorMode: false,
    responsesVisible: false,
    scoresVisible: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  createSession: vi.fn().mockResolvedValue({
    id: 2,
    isActive: true,
    currentSlide: 1,
    projectorMode: false,
    responsesVisible: false,
    scoresVisible: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  updateSession: vi.fn().mockResolvedValue({
    id: 1,
    isActive: true,
    currentSlide: 3,
    projectorMode: false,
    responsesVisible: true,
    scoresVisible: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  saveTeamResponse: vi.fn().mockResolvedValue(undefined),
  getResponsesForSlide: vi.fn().mockResolvedValue([
    { id: 1, sessionId: 1, slideIndex: 7, teamName: "Equipe 1", activityType: "quiz", response: "b", isCorrect: true, pointsEarned: 20 }
  ]),
  getAllResponsesForSession: vi.fn().mockResolvedValue([]),
  getScoresForSession: vi.fn().mockResolvedValue([
    { id: 1, sessionId: 1, teamName: "Equipe 1", totalPoints: 20 },
    { id: 2, sessionId: 1, teamName: "Equipe 3", totalPoints: 10 },
  ]),
  upsertTeamScore: vi.fn().mockResolvedValue(undefined),
  resetScoresForSession: vi.fn().mockResolvedValue(undefined),
  clearResponsesForSlide: vi.fn().mockResolvedValue(undefined),
}));

function createPublicCtx(): TrpcContext {
  const cookies: Record<string, string> = {};
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { cookie: "" },
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string) => { cookies[name] = value; },
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("professor.login", () => {
  it("rejects wrong password", async () => {
    const ctx = createPublicCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.professor.login({ password: "wrong" })).rejects.toThrow("Senha incorreta");
  });

  it("accepts correct password", async () => {
    const ctx = createPublicCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.professor.login({ password: "compliance2026" });
    expect(result.success).toBe(true);
  });
});

describe("session.get", () => {
  it("returns active session", async () => {
    const ctx = createPublicCtx();
    const caller = appRouter.createCaller(ctx);
    const session = await caller.session.get();
    expect(session).not.toBeNull();
    expect(session?.isActive).toBe(true);
  });
});

describe("responses.submit", () => {
  it("rejects invalid team name", async () => {
    const ctx = createPublicCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.responses.submit({
        sessionId: 1,
        slideIndex: 7,
        teamName: "Equipe Inválida",
        activityType: "quiz",
        response: "a",
      })
    ).rejects.toThrow("Equipe inválida");
  });

  it("accepts valid team response", async () => {
    const ctx = createPublicCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.responses.submit({
      sessionId: 1,
      slideIndex: 7,
      teamName: "Equipe 1",
      activityType: "quiz",
      response: "b",
      isCorrect: true,
      pointsEarned: 20,
    });
    expect(result.success).toBe(true);
  });
});

describe("scores.get", () => {
  it("returns all 5 teams with scores", async () => {
    const ctx = createPublicCtx();
    const caller = appRouter.createCaller(ctx);
    const scores = await caller.scores.get({ sessionId: 1 });
    expect(scores).toHaveLength(5);
    expect(scores[0].totalPoints).toBeGreaterThanOrEqual(scores[1].totalPoints);
  });
});

describe("responses.getForSlide", () => {
  it("returns responses for a specific slide", async () => {
    const ctx = createPublicCtx();
    const caller = appRouter.createCaller(ctx);
    const responses = await caller.responses.getForSlide({ sessionId: 1, slideIndex: 7 });
    expect(Array.isArray(responses)).toBe(true);
    expect(responses.length).toBeGreaterThan(0);
    expect(responses[0].teamName).toBe("Equipe 1");
  });
});
