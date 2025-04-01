import Author from "./Author";

export default interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  timestamp: string;
}
