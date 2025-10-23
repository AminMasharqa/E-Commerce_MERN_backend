import type { Request, Response, NextFunction } from "express";
declare const validateJWT: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validateJWT;
//# sourceMappingURL=validateJWT.d.ts.map