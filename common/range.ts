/**
 * 
 * https://stackoverflow.com/a/36963945/4761038
 * author: Aditya Singh
 * @param start 
 * @param end 
 */
export const range = (start: number, end: number) => Array.from({ length: (end - start) }, (v, k) => k + start);
