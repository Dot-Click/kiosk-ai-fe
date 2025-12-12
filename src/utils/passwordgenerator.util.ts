import { createId } from "@paralleldrive/cuid2";

export const generatePassword = () => {
  // Start with a unique base from createId
  const uniqueBase = createId();

  // Ensure it meets validation requirements by adding required characters
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Take more characters from unique base (15-20 characters)
  const targetLength = Math.floor(Math.random() * 6) + 15; // Random length between 15-20
  let password = uniqueBase.substring(0, targetLength);

  // Ensure it has at least one uppercase and one special character
  if (!/[A-Z]/.test(password)) {
    // Replace a random character with uppercase
    const randomIndex = Math.floor(Math.random() * password.length);
    password =
      password.substring(0, randomIndex) +
      uppercase[Math.floor(Math.random() * uppercase.length)] +
      password.substring(randomIndex + 1);
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    // Replace a random character with special
    const randomIndex = Math.floor(Math.random() * password.length);
    password =
      password.substring(0, randomIndex) +
      special[Math.floor(Math.random() * special.length)] +
      password.substring(randomIndex + 1);
  }

  return password;
};
