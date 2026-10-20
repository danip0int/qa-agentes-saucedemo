import { test, expect } from '@playwright/test';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage';
test.describe('Checkout flow', () => {
  test('Reject checkout information when a required field is missing', async ({ page }) => {
    // Open the inventory page (already logged in with the saved session)
    await page.goto('https://www.saucedemo.com/inventory.html');

    // 1. From a fresh inventory page, add a product, open the cart, and select Checkout.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    const infoPage = new CheckoutInformationPage(page);
    await expect(infoPage.firstName).toBeVisible();
    await expect(infoPage.lastName).toBeVisible();
    await expect(infoPage.postalCode).toBeVisible();

    // 2. Leave all fields blank and select Continue.
    await infoPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(infoPage.error).toContainText('Error: First Name is required');

    // 3. Enter a first name only and select Continue.
    await infoPage.firstName.fill('Jane');
    await infoPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(infoPage.error).toContainText('Error: Last Name is required');

    // 4. Enter a last name as well, leave Zip/Postal Code blank, and select Continue.
    await infoPage.lastName.fill('Doe');
    await infoPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(infoPage.error).toContainText('Error: Postal Code is required');

    // 5. Enter a postal code and select Continue.
    await infoPage.postalCode.fill('12345');
    await infoPage.continueButton.click();
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
  });
});
