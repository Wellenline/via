import { IContext } from "../../http";
export declare class Errors {
    error(context: IContext): Promise<void>;
    headers(context: IContext): Promise<void>;
    header(context: IContext): Promise<void>;
}
