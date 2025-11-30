import { test, expect } from '@playwright/test';

test('get started link', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.click('text=Login to your account');
  await page.click('text=Sign up');

  await expect(page).toHaveURL('http://localhost:3000/signup');
});


// TODO: test register


// TODO: test login flow with cookie storage


// TODO: test dashboard access after login


// TODO: test logout flow


// TODO: test add user flow in admin panel


// TODO: test edit user flow in admin panel