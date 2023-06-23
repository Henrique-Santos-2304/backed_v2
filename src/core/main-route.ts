import express from "express";
import {
  farmRoutes,
  pivotRoutes,
  schedulingsRoutes,
  userRoutes,
} from "./routes";
import { cyclesRoutes } from "./routes/state";
import { radioVariablesRoutes } from "./routes/radio-variables";
import { Injector } from "@root/main/injector";
import { IBaseController } from "@root/domain";
import { INJECTOR_CONTROLS } from "@root/shared";

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

export const expressRouters = () =>
  express
    .Router()
    .use(error)
    .use("/users", userRoutes())
    .use("/farms", farmRoutes())
    .use("/pivots", pivotRoutes())
    .use("/cycles", cyclesRoutes())
    .use("/radio_variables", radioVariablesRoutes())
    .use("/schedulings", schedulingsRoutes())
    .post(
      "/actions/create/:id",
      Injector.get<IBaseController>(INJECTOR_CONTROLS.STATES.ACTION).handle
    );

/*
router.use('/states', stateRoute);
router.use('/schedulings', schedulingRoute);
router.use('/radio_variables', RadioVariableRoute);
router.use('/aws_iot', TestAws); */
