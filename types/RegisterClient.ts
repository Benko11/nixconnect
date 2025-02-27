export default interface RegisterClient {
  nickname: string;
  email: string;
  password: string;
  passwordAgain: string;
  gender?: number;
  pronouns: string[];
}
