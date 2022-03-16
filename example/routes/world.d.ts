import { IContext } from "../../http";
export declare class World {
    hello(): Promise<string>;
    wild(context: IContext): Promise<string>;
    parameters(context: IContext): Promise<{
        param1: any;
        optional: any;
        notoptiona: any;
    }>;
}
