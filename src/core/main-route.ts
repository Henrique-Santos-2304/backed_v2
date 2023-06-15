import express from "express";
import { userRoutes } from "./routes";

const expressRouters = express.Router();
function error(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.log(err);
  /*   if (err instanceof ServerError) res.status(400).send(err.message);
  else if (err instanceof Error) res.status(500).send(err.message); */
  res.status(500).send("Internal Server Error");
  next();
}

expressRouters.use(error);
expressRouters.use("/users", userRoutes);

export { expressRouters };

/* router.use('/farms', farmRoute);
router.use('/pivots', pivotRoute);
router.use('/cycles', cycleRoute);
router.use('/states', stateRoute);
router.use('/schedulings', schedulingRoute);
router.use('/radio_variables', RadioVariableRoute);
router.use('/aws_iot', TestAws); */
