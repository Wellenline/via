import { IContext } from "../../http";
export declare class Query {
    index(context: IContext): Promise<{
        queryParams: any;
    }>;
}
