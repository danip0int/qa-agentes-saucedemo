# SauceDemo Checkout Flow Test Plan

## Application Overview

Validate the SauceDemo checkout journey from the logged-in inventory state supplied by tests/seed.spec.ts: add product(s), review/edit the cart, provide checkout information, verify the order overview and complete the order. Each scenario starts from a fresh application/cart state with the seed's authenticated inventory page; do not test login.

## Test Scenarios

### 1. Checkout flow

**Seed:** `tests/seed.spec.ts`

#### 1.1. Complete checkout and order a single product

**File:** `tests/checkout/happy-path-single-item.spec.ts`

**Steps:**
  1. Starting from the fresh inventory page, add Sauce Labs Backpack to the cart.
    - expect: The backpack's action changes to Remove and the cart badge shows 1.
  2. Open the cart and review the backpack entry, quantity, and $29.99 price; select Checkout.
    - expect: The cart contains exactly one Sauce Labs Backpack, quantity 1, priced at $29.99.
    - expect: The Checkout: Your Information form is displayed.
  3. Enter First Name Taylor, Last Name Morgan, and Zip/Postal Code 90210, then select Continue.
    - expect: The Checkout: Overview page is displayed with the backpack and quantity 1.
    - expect: Payment information and shipping information are displayed.
    - expect: Item total is $29.99, tax is $2.40, and total is $32.39.
  4. Select Finish.
    - expect: The Checkout: Complete! page displays “Thank you for your order!” and the order-dispatched confirmation.
    - expect: The cart badge is empty.

#### 1.2. Verify multi-item cart and calculated checkout totals

**File:** `tests/checkout/multiple-items-totals.spec.ts`

**Steps:**
  1. From a fresh inventory page, add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to the cart.
    - expect: The cart badge shows 2.
  2. Open the cart and select Checkout.
        - expect: The cart lists both products, each with quantity 1: Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99).
  3. Enter First Name Taylor, Last Name Morgan, and Zip/Postal Code 90210, then select Continue.
    - expect: The overview lists both products with the correct quantities and prices.
    - expect: Item total is $39.98, tax is $3.20, and total is $43.18.
  4. Select Finish.
    - expect: The order completion page displays the order confirmation.

#### 1.3. Reject checkout information when a required field is missing

**File:** `tests/checkout/required-fields-validation.spec.ts`

**Steps:**
  1. From a fresh inventory page, add a product, open the cart, and select Checkout.
    - expect: The checkout information form has First Name, Last Name, and Zip/Postal Code inputs.
   2. Leave all fields blank and select Continue.
    - expect: Checkout does not advance and the error message "Error: First Name is required" is displayed.
  3. Enter a first name only and select Continue.
    - expect: Checkout does not advance and the error message "Error: Last Name is required" is displayed.
  4. Enter a last name as well, leave Zip/Postal Code blank, and select Continue.
    - expect: Checkout does not advance and the error message "Error: Postal Code is required" is displayed.
  5. Enter a postal code and select Continue.
    - expect: The form accepts the completed required fields and advances to Checkout: Overview.

#### 1.4. Cancel checkout information and resume with cart preserved

**File:** `tests/checkout/cancel-information-and-resume.spec.ts`

**Steps:**
  1. From a fresh inventory page, add Sauce Labs Backpack and open the cart.
    - expect: The cart contains the backpack and its badge shows 1.
  2. Select Checkout, then select Cancel on the checkout information page.
    - expect: The user returns to the cart.
    - expect: The backpack remains in the cart and the badge still shows 1.
  3. Select Checkout again, enter First Name Taylor, Last Name Morgan, and Zip/Postal Code 90210, then select Continue.
    - expect: The overview shows the backpack with the expected Item total: $29.99, Tax: $2.40, and Total: $32.39.
  4. Select Finish.
    - expect: The order completes successfully and the completion confirmation is displayed.

#### 1.5. Remove an item and ensure checkout reflects the remaining cart

**File:** `tests/checkout/remove-item-before-checkout.spec.ts`

**Steps:**
  1. From a fresh inventory page, add Sauce Labs Backpack and Sauce Labs Bike Light, then open the cart.
    - expect: The cart lists both products and the badge shows 2.
  2. Remove the Sauce Labs Backpack from the cart.
    - expect: The backpack is absent, the Bike Light remains with quantity 1, and the badge shows 1.
  3. Select Checkout, enter First Name Taylor, Last Name Morgan, and Zip/Postal Code 90210, then select Continue.
    - expect: The overview contains only Sauce Labs Bike Light.
    - expect: Item total is $9.99, tax is $0.80, and total is $10.79.
  4. Select Finish.
    - expect: The order completion page displays the order confirmation.
