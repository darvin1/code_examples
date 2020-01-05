import error from './error';

/**
 * Creates a new type error.
 *
 * @param  {string} name         - Name of variable.
 * @param  {string} expectedType - Expected type of variable.
 * @param  {any}    variable
 */

export default function typeError(name, expectedType, variable) {
  error(
    `Expected the ${name} to be a ${expectedType}. But got: ${
      variable === null ? 'null' : typeof variable
    }`
  );
}
