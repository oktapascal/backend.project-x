import {Expose} from "class-transformer";

export class UserProfileDto {
    user_id?: string;

    @Expose()
    full_name: string;

    @Expose()
    email?: string;

    @Expose()
    phone_number?: string;

    @Expose()
    photo?: string;

    updated_at?: Date;
}