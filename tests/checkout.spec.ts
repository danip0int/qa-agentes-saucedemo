// spec: specs/checkout-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('Complete checkout and order a single product', async ({ page }) => {
    // 1. Log in (same steps as tests/seed.spec.ts)
    await page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/inventory/);

    // 2. Add Sauce Labs Backpack as the single product in the order
    await page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();

    // 3. Open the cart to verify the selected product before checkout
    await page.getByRole('button', { name: 'Cart, 1 items' }).click();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();

    // 4. Proceed from the cart to checkout information
    await page.getByRole('button', { name: 'Checkout' }).click();

    // 5. Enter the customer's first name
    await page.getByRole('textbox', { name: 'First Name' }).fill('Jane');

    // 6. Enter the customer's last name
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');

    // 7. Enter the customer's postal code
    await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');

    // 8. Continue to review the order
    await page.getByRole('button', { name: 'Continue' }).click();

    // 9. Verify the order overview contains the selected backpack
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');

    // 10. Verify the item subtotal matches the backpack price
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $29.99');

    // 11. Verify the calculated tax
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $2.40');

    // 12. Verify the full order total
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39');

    // 13. Place the order for the single backpack
    await page.getByRole('button', { name: 'Finish' }).click();

    // 14. Verify the completed order confirmation heading
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');

    // 15. Verify the order dispatch confirmation message
    await expect(page.locator('[data-test="complete-text"]')).toHaveText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
  });
});
