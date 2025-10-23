import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default userModel;
//# sourceMappingURL=userModel.d.ts.map