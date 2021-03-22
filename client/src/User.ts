import jwtDecode from "jwt-decode";

export class User {
  private static user: User;

  constructor(public sub: number, public email: string, public name: string) {}

  static getUser() {
    const token = localStorage.getItem("token");
    if (token) {
      if (!this.user) {
        const claims = jwtDecode<User>(token);
        this.user = new User(claims.sub, claims.email, claims.name);
      }

      return this.user;
    }
  }
}
