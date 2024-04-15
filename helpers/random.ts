export const randomHelpers = {
  randomEmail: require("random-email"),
  randomString: require("randomstring"),
  getRandomInt: function getRandomInt(from: number, to: number): number {
    let random = Math.floor(Math.random() * (to - from)) + from;
    return random;
  },
};
/* 
use examples:
randomHelpers.randomString.generate(passwordLenght)

await randomHelpers.randomEmail({domain: 'gmail.com'})

*/
