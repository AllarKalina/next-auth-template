import { test, expect } from "@playwright/test";
import { eq } from "drizzle-orm";
import { db } from "../src/server/db";
import { emailVerificationTable, userTable } from "@/server/db/schema";

test.describe("Sign up", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/sign-up");
  });

  test("Should allow me to sign up", async ({ page }) => {
    const nameInput = page.getByTestId("name-input");
    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");
    const submitButton = page.getByTestId("sign-up-button");

    await nameInput.fill("Allar Kalina");
    await emailInput.fill("allarkalina@gmail.com");
    await passwordInput.fill("Tere1234");
    await submitButton.click();

    const emailConformationPageHeader = page.getByText("Check Your Email");

    await expect(emailConformationPageHeader).toBeVisible();

    const user = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, "allarkalina@gmail.com"),
    });

    await db
      .delete(emailVerificationTable)
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      .where(eq(emailVerificationTable.userId, user?.id!));

    await db
      .delete(userTable)
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      .where(eq(userTable.id, user?.id!));
  });

  test("Should display invalid name, email and password error message", async ({
    page,
  }) => {
    const nameInput = page.getByTestId("name-input");
    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");

    await nameInput.fill("a");
    await emailInput.fill("a");
    await passwordInput.fill("a");

    const nameError = page.getByText(
      "Name must contain atleast 2 character(s)",
    );
    const emailError = page.getByText(
      "Email must contain atleast 2 character(s)",
    );
    const passError = page.getByText(
      "Password must be at least 8 characters long",
    );

    await expect(nameError).toBeVisible();
    await expect(emailError).toBeVisible();
    await expect(passError).toBeVisible();
  });

  test("Should display email already exists", async ({ page }) => {
    const nameInput = page.getByTestId("name-input");
    const emailInput = page.getByTestId("email-input");
    const passwordInput = page.getByTestId("password-input");

    await nameInput.fill("Allar Klaina");
    await emailInput.fill("allarklaina@gmail.com");
    await passwordInput.fill("Tere1234");
    await passwordInput.press("Enter");

    const emailConformationPageHeader = page.getByText("Check Your Email");

    await expect(emailConformationPageHeader).toBeVisible();

    await page.goto("http://localhost:3000/sign-up");

    await nameInput.fill("Allar Klaina");
    await emailInput.fill("allarklaina@gmail.com");
    await passwordInput.fill("Tere1234");
    await passwordInput.press("Enter");

    const emailError = page.getByText("Email already exists.");

    await expect(emailError).toBeVisible();

    const user = await db.query.userTable.findFirst({
      where: (table, { eq }) => eq(table.email, "allarklaina@gmail.com"),
    });

    await db
      .delete(emailVerificationTable)
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      .where(eq(emailVerificationTable.userId, user?.id!));

    await db
      .delete(userTable)
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      .where(eq(userTable.id, user?.id!));
  });
});
