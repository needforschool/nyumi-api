const MESSAGES = {
  ERROR_NOT_FOUND: (item: string) =>
    `${item.charAt(0).toUpperCase() + item.slice(1)} not found`,
  ERROR_AUTH_HEADER: "Authorization header must be provided",
  ERROR_AUTH_TOKEN: "Authentication token must be 'Mskn [token]'",
  ERROR_AUTH_TOKEN_INVALID: "Invalid/Expired token",
  ERROR_AUTH_NOT_ALLOWED: "Action not allowed",
  ERROR_AUTH_CREDENTIALS: "auth.credentials",
};

export default MESSAGES;
