/**
 * Return a random string
 * @return {string} A random string with 13 elements
 */
export const randomString = ()=>Math.random().toString(36).substring(2, 15);;

/**
 * Random select a element of a given array
 * @param  {array} arr -
 * @return {Object} A random choiced element of the given array
 */
export const randomChoice = (arr) => arr[Math.floor(arr.length * Math.random())];


