import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getActiveSession,
  createSession,
  updateSession,
  saveTeamResponse,
  getResponsesForSlide,
  getAllResponsesForSession,
  getScoresForSession,
  upsertTeamScore,
  resetScoresForSession,
  clearResponsesForSlide,
} from "./db";
import { TEAMS } from "../shared/slides-content";
import { TRPCError } from "@trpc/server";

// Password for professor login (stored as env or hardcoded default)
const PROFESSOR_PASSWORD = process.env.PROFESSOR_PASSWORD || "compliance2026";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ---- Professor Auth ----
  professor: router({
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(({ input, ctx }) => {
        if (input.password !== PROFESSOR_PASSWORD) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Senha incorreta" });
        }
        // Set a simple cookie for professor session
        ctx.res.cookie("prof_session", "authenticated", {
          httpOnly: true,
          maxAge: 60 * 60 * 8 * 1000, // 8 hours
          sameSite: "none",
          secure: true,
          path: "/",
        });
        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("prof_session", { path: "/" });
      return { success: true };
    }),

    checkAuth: publicProcedure.query(({ ctx }) => {
      const cookies = ctx.req.headers.cookie || "";
      const isAuth = cookies.includes("prof_session=authenticated");
      return { authenticated: isAuth };
    }),
  }),

  // ---- Class Session ----
  session: router({
    get: publicProcedure.query(async () => {
      let session = await getActiveSession();
      if (!session) {
        session = await createSession();
      }
      return session;
    }),

    create: publicProcedure.mutation(async () => {
      return createSession();
    }),

    setSlide: publicProcedure
      .input(z.object({ sessionId: z.number(), slideIndex: z.number() }))
      .mutation(async ({ input }) => {
        return updateSession(input.sessionId, {
          currentSlide: input.slideIndex,
          responsesVisible: false,
        });
      }),

    toggleProjector: publicProcedure
      .input(z.object({ sessionId: z.number(), enabled: z.boolean() }))
      .mutation(async ({ input }) => {
        return updateSession(input.sessionId, { projectorMode: input.enabled });
      }),

    toggleResponses: publicProcedure
      .input(z.object({ sessionId: z.number(), visible: z.boolean() }))
      .mutation(async ({ input }) => {
        return updateSession(input.sessionId, { responsesVisible: input.visible });
      }),

    toggleScores: publicProcedure
      .input(z.object({ sessionId: z.number(), visible: z.boolean() }))
      .mutation(async ({ input }) => {
        return updateSession(input.sessionId, { scoresVisible: input.visible });
      }),
  }),

  // ---- Responses ----
  responses: router({
    submit: publicProcedure
      .input(z.object({
        sessionId: z.number(),
        slideIndex: z.number(),
        teamName: z.string(),
        activityType: z.enum(["quiz", "vote", "case", "open"]),
        response: z.string(),
        isCorrect: z.boolean().optional(),
        pointsEarned: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        if (!TEAMS.includes(input.teamName)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Equipe inválida" });
        }
        await saveTeamResponse({
          sessionId: input.sessionId,
          slideIndex: input.slideIndex,
          teamName: input.teamName,
          activityType: input.activityType,
          response: input.response,
          isCorrect: input.isCorrect ?? false,
          pointsEarned: input.pointsEarned ?? 0,
        });
        // Update score if points earned
        if (input.pointsEarned && input.pointsEarned > 0) {
          await upsertTeamScore(input.sessionId, input.teamName, input.pointsEarned);
        }
        return { success: true };
      }),

    getForSlide: publicProcedure
      .input(z.object({ sessionId: z.number(), slideIndex: z.number() }))
      .query(async ({ input }) => {
        return getResponsesForSlide(input.sessionId, input.slideIndex);
      }),

    getAll: publicProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        return getAllResponsesForSession(input.sessionId);
      }),

    clearSlide: publicProcedure
      .input(z.object({ sessionId: z.number(), slideIndex: z.number() }))
      .mutation(async ({ input }) => {
        await clearResponsesForSlide(input.sessionId, input.slideIndex);
        return { success: true };
      }),
  }),

  // ---- Scores ----
  scores: router({
    get: publicProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ input }) => {
        const scores = await getScoresForSession(input.sessionId);
        // Ensure all 5 teams are present
        const result = TEAMS.map(team => {
          const found = scores.find(s => s.teamName === team);
          return { teamName: team, totalPoints: found?.totalPoints ?? 0 };
        });
        return result.sort((a, b) => b.totalPoints - a.totalPoints);
      }),

    reset: publicProcedure
      .input(z.object({ sessionId: z.number() }))
      .mutation(async ({ input }) => {
        await resetScoresForSession(input.sessionId);
        return { success: true };
      }),

    addPoints: publicProcedure
      .input(z.object({ sessionId: z.number(), teamName: z.string(), points: z.number() }))
      .mutation(async ({ input }) => {
        await upsertTeamScore(input.sessionId, input.teamName, input.points);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
