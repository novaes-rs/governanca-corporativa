import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, classSessions, teamResponses, teamScores, ClassSession, InsertTeamResponse } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ---- Class Session ----

export async function getActiveSession() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(classSessions)
    .where(eq(classSessions.isActive, true))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createSession() {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  // Deactivate all previous sessions
  await db.update(classSessions).set({ isActive: false });
  await db.insert(classSessions).values({
    isActive: true,
    currentSlide: 1,
    projectorMode: false,
    responsesVisible: false,
    scoresVisible: false,
  });
  return getActiveSession();
}

export async function updateSession(id: number, data: Partial<ClassSession>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(classSessions).set(data).where(eq(classSessions.id, id));
  return getActiveSession();
}

// ---- Team Responses ----

export async function saveTeamResponse(data: InsertTeamResponse) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  // Remove previous response from same team on same slide
  await db.delete(teamResponses).where(
    and(
      eq(teamResponses.sessionId, data.sessionId),
      eq(teamResponses.slideIndex, data.slideIndex),
      eq(teamResponses.teamName, data.teamName)
    )
  );
  await db.insert(teamResponses).values(data);
}

export async function getResponsesForSlide(sessionId: number, slideIndex: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamResponses).where(
    and(
      eq(teamResponses.sessionId, sessionId),
      eq(teamResponses.slideIndex, slideIndex)
    )
  );
}

export async function getAllResponsesForSession(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamResponses).where(eq(teamResponses.sessionId, sessionId));
}

// ---- Scores ----

export async function getScoresForSession(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(teamScores).where(eq(teamScores.sessionId, sessionId));
}

export async function upsertTeamScore(sessionId: number, teamName: string, points: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db.select().from(teamScores).where(
    and(eq(teamScores.sessionId, sessionId), eq(teamScores.teamName, teamName))
  ).limit(1);
  if (existing.length > 0) {
    await db.update(teamScores)
      .set({ totalPoints: (existing[0].totalPoints || 0) + points })
      .where(and(eq(teamScores.sessionId, sessionId), eq(teamScores.teamName, teamName)));
  } else {
    await db.insert(teamScores).values({ sessionId, teamName, totalPoints: points });
  }
}

export async function resetScoresForSession(sessionId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(teamScores).where(eq(teamScores.sessionId, sessionId));
}

export async function clearResponsesForSlide(sessionId: number, slideIndex: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(teamResponses).where(
    and(
      eq(teamResponses.sessionId, sessionId),
      eq(teamResponses.slideIndex, slideIndex)
    )
  );
}
