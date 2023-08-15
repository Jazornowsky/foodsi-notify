import { AxiosHeaders } from "axios";

export interface AuthHeader {
    'Access-Token': string,
    Client: string,
    Uid: string
}