import { Gender } from "./Gender";

export default interface Author {
  id: string;
  nickname: string;
  avatarUrl?: string;
  pronouns: string[];
  gender?: Gender;
  createdAt: string;
  timestamp: string;
}
