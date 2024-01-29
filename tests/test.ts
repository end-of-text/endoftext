import { test } from '@playwright/test';

test('can load', async ({ page }) => {
	await page.goto('/');
});
