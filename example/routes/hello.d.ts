import { BaseClass } from "./base";
export declare class Hello extends BaseClass {
    constructor();
    doSome(): Promise<{
        say: string;
        count: number;
    }>;
    world(): Promise<{
        hello: number;
        counter: number;
    }>;
}
