// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout flow', () => {
  test('Verify multi-item cart and calculated checkout totals', async ({ page }) => {
    // Log in to establish the standalone clean-session test state
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);

    // Add Sauce Labs Backpack priced at $29.99 to the cart
    await page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();

    // Add Sauce Labs Bike Light priced at $9.99 as the second cart product
    await page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();

    // Verify the cart badge shows two products
    await expect(page.getByRole('button', { name: 'Cart, 2 items' })).toBeVisible();

    // Open the cart to review both products
    await page.getByRole('button', { name: 'Cart, 2 items' }).click();

    // Verify both products are present in the cart
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
    await expect(page.getByText('$29.99')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();

    // Select Checkout to enter customer information
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Enter customer information
    await page.getByRole('textbox', { name: 'First Name' }).fill('Taylor');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Morgan');
    await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('90210');

    // Continue to the multi-item order overview
    await page.getByRole('button', { name: 'Continue' }).click();

    // Verify both products and their prices in the overview
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
    await expect(page.getByText('$29.99')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();

    // Verify the combined item total, tax, and final total
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $39.98');
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $3.20');
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $43.18');

    // Place the order containing the backpack and bike light
    await page.getByRole('button', { name: 'Finish' }).click();

    // Verify the completion page displays order confirmation
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
  });
});
