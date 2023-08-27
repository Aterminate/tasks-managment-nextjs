import { login } from "../../lib/users";

export default async (req, res) => {
  console.log('check enter');

  if (req.method !== "POST") {
    res.status(405).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the POST http method.`,
    });
    return;
  }

  const { username, password } = JSON.parse(req.body);

  try {
    const loginResult = await login(username, password);
    console.log(loginResult);
    res.status(200).json(loginResult);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred.",
    });
  }
};
