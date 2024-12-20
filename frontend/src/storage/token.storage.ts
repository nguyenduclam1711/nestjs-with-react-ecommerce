class TokenStorage {
  private accessToken: string = "";

  getAccessTokenValue() {
    return this.accessToken;
  }

  setAccessTokenValue(newAccessToken: string) {
    this.accessToken = newAccessToken;
  }
}

const tokenStorage = new TokenStorage();

export default tokenStorage;
