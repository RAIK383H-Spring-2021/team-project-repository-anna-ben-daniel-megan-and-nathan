import jwtDecode from "jwt-decode";

interface TokenUser {
  sub: number;
  email: string;
  name: string;
}

export class User {
  private static user: User;

  constructor(
    public id: number,
    public email: string,
    public first_name: string,
    public last_name: string
  ) {}

  static getUser() {
    const token = localStorage.getItem("token");
    if (token) {
      if (!this.user) {
        const claims = jwtDecode<TokenUser>(token);
        this.user = new User(claims.sub, claims.email, claims.name, "");
      }

      return this.user;
    }
  }
}
