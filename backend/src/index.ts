import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import recipeRoutes from "./routes/recipes";
import ingredientRoutes from "./routes/ingredients";
import aiRoutes from "./routes/ai";
import shoppingRoutes from "./routes/shopping";
import weeklyPlanRoutes from "./routes/weeklyPlan";
import favoriteRoutes from "./routes/favorites";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "ChefMind API" });
});

app.use("/auth", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/ingredients", ingredientRoutes);
app.use("/ai", aiRoutes);
app.use("/shopping", shoppingRoutes);
app.use("/weekly-plan", weeklyPlanRoutes);
app.use("/favorites", favoriteRoutes);

app.listen(PORT, () => {
  console.log(`ChefMind API çalışıyor: http://localhost:${PORT}`);
});

export default app;
