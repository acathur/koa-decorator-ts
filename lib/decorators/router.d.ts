import { MethodType } from '../router';
import { Schema } from 'jsonschema';
export declare const Priority: (priority: number) => Function;
export declare const Meta: (meta: any) => Function;
export declare const Get: (path?: string) => Function;
export declare const Post: (path?: string) => Function;
export declare const Put: (path?: string) => Function;
export declare const Delete: (path?: string) => Function;
export declare const Patch: (path?: string) => Function;
export declare const Options: (path?: string) => Function;
export declare const Head: (path?: string) => Function;
export declare const All: (path?: string) => Function;
export declare const Route: {
    get: (path?: string) => Function;
    post: (path?: string) => Function;
    put: (path?: string) => Function;
    del: (path?: string) => Function;
    patch: (path?: string) => Function;
    all: (path?: string) => Function;
};
export declare const Controller: (path?: string) => (target: any) => void;
export declare const Middleware: (convert: (...args: any[]) => Promise<any>) => (...args: any[]) => TypedPropertyDescriptor<(...args: any[]) => Promise<any>>;
export declare const RequiredBody: (Type: new () => any) => (...args: any[]) => TypedPropertyDescriptor<(...args: any[]) => Promise<any>>;
export declare const RequiredQuery: (Type: new () => any) => (...args: any[]) => TypedPropertyDescriptor<(...args: any[]) => Promise<any>>;
export declare const Required: (rules: RequiredConfig) => (...args: any[]) => TypedPropertyDescriptor<(...args: any[]) => Promise<any>>;
export interface RouteConfig {
    method: MethodType;
    path: string;
}
export interface RequiredConfig {
    params?: Schema;
    query?: Schema;
    body?: Schema;
}
