import { test, expect } from '@playwright/test';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage';

test.describe('Checkout flow', () => {
  let infoPage: CheckoutInformationPage;

  // Se ejecuta antes de CADA test: deja la app en el formulario de datos
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    infoPage = new CheckoutInformationPage(page);
    await expect(infoPage.title).toHaveText('Checkout: Your Information');
  });

  test('Checkout information form shows the required inputs', async () => {
    await expect(infoPage.firstName).toBeVisible();
    await expect(infoPage.lastName).toBeVisible();
    await expect(infoPage.postalCode).toBeVisible();
  });

  test('Rejects the form when all fields are blank', async ({ page }) => {
    await infoPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(infoPage.error).toContainText('Error: First Name is required');
  });

  test('Rejects the form when only the first name is filled', async ({ page }) => {
    await infoPage.firstName.fill('Jane');
    await infoPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(infoPage.error).toContainText('Error: Last Name is wrong');
  });

  test('Rejects the form when the postal code is missing', async ({ page }) => {
    await infoPage.firstName.fill('Jane');
    await infoPage.lastName.fill('Doe');
    await infoPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(infoPage.error).toContainText('Error: Postal Code is required');
  });

  test('Accepts the form when all required fields are filled', async ({ page }) => {
    await infoPage.fillInformation('Jane', 'Doe', '12345');
    await infoPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
  });
});