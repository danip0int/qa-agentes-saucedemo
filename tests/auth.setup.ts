import { test as setup, expect } from '@playwright/test';

// Dónde se guarda la sesión
const authFile = 'playwright/.auth/user.json';
setup('authenticate', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Confirmación de login
  await expect(page).toHaveURL(/inventory/);

  // Guarda cookies y localStorage del navegador en el archivo
  await page.context().storageState({ path: authFile });
});