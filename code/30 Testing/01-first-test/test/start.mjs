/**
 * !!!MUST DO CONFIGURATION!!!
 * ---------------------
 * Chai v5+ only supports ESM
 * rename file to .mjs
 */
import { expect } from 'chai';
/** ===================== */

it('should add numbers correctly', function () {
    const num1 = 2;
    const num2 = 3;
    expect(num1 + num2).to.equal(5);
});

it('should not give a result of 6', function () {
    const num1 = 2;
    const num2 = 3;
    expect(num1 + num2).not.to.equal(6);
});
