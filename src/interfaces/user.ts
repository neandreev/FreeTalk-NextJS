import { ICollection } from "./collection";
import { IWord } from "./word";

export interface IUser {
  id: string;
  username: string,
  password: string,
  savedWords?: Array<IWord>,
  savedCollections?: Array<ICollection>
}