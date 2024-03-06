import { IsNotEmpty } from "class-validator";

export class loginUser{
    @IsNotEmpty()
    email:string
    @IsNotEmpty()
    password:string
}