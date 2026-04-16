import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Sessão da aula - controla o estado global
export const classSessions = mysqlTable("class_sessions", {
  id: int("id").autoincrement().primaryKey(),
  isActive: boolean("isActive").default(true).notNull(),
  currentSlide: int("currentSlide").default(1).notNull(),
  projectorMode: boolean("projectorMode").default(false).notNull(),
  responsesVisible: boolean("responsesVisible").default(false).notNull(),
  scoresVisible: boolean("scoresVisible").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClassSession = typeof classSessions.$inferSelect;

// Respostas das equipes por slide/atividade
export const teamResponses = mysqlTable("team_responses", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  slideIndex: int("slideIndex").notNull(),
  teamName: varchar("teamName", { length: 32 }).notNull(), // "Equipe 1" ... "Equipe 5"
  activityType: mysqlEnum("activityType", ["quiz", "vote", "case", "open"]).notNull(),
  response: text("response").notNull(), // JSON string para quiz/vote, texto para open/case
  isCorrect: boolean("isCorrect").default(false),
  pointsEarned: int("pointsEarned").default(0).notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type TeamResponse = typeof teamResponses.$inferSelect;
export type InsertTeamResponse = typeof teamResponses.$inferInsert;

// Placar das equipes
export const teamScores = mysqlTable("team_scores", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: int("sessionId").notNull(),
  teamName: varchar("teamName", { length: 32 }).notNull(),
  totalPoints: int("totalPoints").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamScore = typeof teamScores.$inferSelect;
