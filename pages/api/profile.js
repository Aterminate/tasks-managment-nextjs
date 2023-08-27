import { trueTypeOf } from "../../helpers";
import { findUser, login, register, verifyToken, findProjectsByUserId } from "../../lib/users";

export default async (req, res) => {
  if (req.method !== "GET") {
    res.status(403).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the GET http method.`,
    });
    return;
  }

  const authorizationToken = req.headers.authorization;

  if (authorizationToken) {
    console.log(authorizationToken);
    try {
      const verifiedUser = verifyToken(authorizationToken);

      if (verifiedUser) {
        const user = await findUser(verifiedUser.username);
        if(user){
          const projects = await findProjectsByUserId(user.id);
          console.log('------------');
          console.log(projects);
          res.status(200).json({
            payload: {
              username: user.username,
              email: user.email,
              id: user.id,
              projects: projects
            },
          });
          return;
        }

      }
    } catch (error) {
      console.log("error", error);
      // Token has expired or we detected a fraud attack
      res.status(401).json({
        error: "Unauthorized",
        message: "Not allowed.",
      });
      return;
    }
  }

  // Token has expired or we detected a fraud attack
  res.status(401).json({
    error: "Unauthorized",
    message: "Not allowed.",
  });
};
