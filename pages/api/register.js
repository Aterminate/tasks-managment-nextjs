import { login, register } from "../../lib/users";

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "METHOD_NOT_ALLOWED",
      message: `${req.method} is not allowed, please use the POST http method.`,
    });
    return;
  }

  const payload = JSON.parse(req.body);

  try {
    const registrationResult = await register(payload);
    res.status(200).json(registrationResult);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred.",
    });
  }
};
