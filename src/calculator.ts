export class MathOperations {
    static handleError(message: string): never {
      throw new Error(message);
    }
  
    static checkArgs(action: string, ...args: any[]) {
      if (
        (action === "fibonacci" && args.length < 1) ||
        (action !== "fibonacci" && args.length < 2)
      ) {
        return this.handleError("Some argument was missed");
      }
      if (
        action !== "fibonacci" &&
        (typeof args[0] != "number" ||
          typeof args[1] != "number" ||
          isNaN(args[0]) ||
          isNaN(args[1]))
      ) {
        return this.handleError("Incorrect variable type was passed");
      }
      if (args[1] === 0 && action === "divide") {
        return this.handleError("Dividing by 0 is not allowed");
      }
      if (
        action === "fibonacci" &&
        (typeof args[0] != "number" ||
          isNaN(args[0]) ||
          args[0] <= 0 ||
          args[0] != Math.trunc(args[0]))
      ) {
        return this.handleError("Incorrect variable type or value was passed");
      }
      return args;
    }
  
    //need to work around the inaccuracy of adding fractions
    static add(...args: any[]): number {
      let action = "add";
      try {
        const argsToBeAdded = this.checkArgs(action, ...args);
  
        return argsToBeAdded[0] + argsToBeAdded[1];
      } catch (error: any) {
        return error.message;
      }
    }
  
    //need to work around the inaccuracy of subtracting fractions
    static substract(...args: any[]): number {
      let action = "substract";
      try {
        const argsToBesubstracted = this.checkArgs(action, ...args);
        return argsToBesubstracted[0] - argsToBesubstracted[1];
      } catch (error: any) {
        return error.message;
      }
    }
  
    static multiply(...args: any[]): number {
      let action = "multiply";
      try {
        const argsToBeMultiplied = this.checkArgs(action, ...args);
        return argsToBeMultiplied[0] * argsToBeMultiplied[1];
      } catch (error: any) {
        return error.message;
      }
    }
  
    static divide(...args: any[]): number {
      let action = "divide";
      try {
        const argsToBeDivided = this.checkArgs(action, ...args);
        return argsToBeDivided[0] / argsToBeDivided[1];
      } catch (error: any) {
        return error.message;
      }
    }
    static power(...args: any[]): number {
      let action = "power";
      try {
        const argsForPowereing = this.checkArgs(action, ...args);
        return Math.pow(argsForPowereing[0], argsForPowereing[1]);
      } catch (error: any) {
        return error.message;
      }
    }
  
    static getFibonacci(...args: any[]): number[] {
      let action = "fibonacci";
      try {
        const argForFetchFibonacciRow = this.checkArgs(action, ...args);
        let initialArr: number[] = [0, 1];
        if (argForFetchFibonacciRow[0] === 1) {
          initialArr.pop();
          return initialArr;
        } else if (argForFetchFibonacciRow[0] === 2) {
          return initialArr;
        } else {
          for (
            argForFetchFibonacciRow[0];
            argForFetchFibonacciRow[0] > 2;
            argForFetchFibonacciRow[0]--
          ) {
            initialArr.push(
              initialArr[initialArr.length - 1] +
                initialArr[initialArr.length - 2]
            );
          }
          return initialArr;
        }
      } catch (error: any) {
        return error.message;
      }
    }
  }