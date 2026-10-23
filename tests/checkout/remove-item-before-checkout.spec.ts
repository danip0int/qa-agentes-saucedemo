import { test, expect } from '@playwright/test';
import { CheckoutInformationPage } from '../../pages/CheckoutInformationPage';

test.describe('Checkout flow', () => {
  test('Remove an item and ensure checkout reflects the remaining cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    // 1. From a fresh inventory page, add Sauce Labs Backpack and Sauce Labs Bike Light, then open the cart.
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Backpack' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    // 2. Remove the Sauce Labs Backpack from the cart.
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Backpack' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Bike Light' })).toBeVisible();
    await expect(
      page.locator('.cart_item').filter({ hasText: 'Sauce Labs Bike Light' }).locator('.cart_quantity'),
    ).toHaveText('1');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    // 3. Select Checkout, enter the customer information, then select Continue.
    await page.getByRole('button', { name: 'Checkout' }).click();
    const checkoutInformation = new CheckoutInformationPage(page);
    await checkoutInformation.fillInformation('Taylor', 'Morgan', '90210');
    await checkoutInformation.continueButton.click();
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Bike Light' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'View details for Sauce Labs Backpack' })).toHaveCount(0);
    await expect(page.getByText('Item total: $9.99', { exact: true })).toBeVisible();
    await expect(page.getByText('Tax: $0.80', { exact: true })).toBeVisible();
    await expect(page.getByText('Total: $10.79', { exact: true })).toBeVisible();

    // 4. Select Finish.
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  });
});
