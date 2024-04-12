export const randomHelpers = {
    randomEmail: require('random-email'),
    randomString: require('randomstring'),
    getRandomInt: function getRandomInt(from: number, to: number): number {
        let random = Math.floor(Math.random()* (to - from)) + from;
        return random;
    }
}