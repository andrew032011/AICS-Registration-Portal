export default class PermissionsUtils {
  public static isAdmin(dbUser: DBUser): boolean {
    if (dbUser.roles == null) {
      return false;
    }
    return dbUser.roles.includes("admin");
  }
}
