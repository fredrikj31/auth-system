interface DecodeJwtTokenOptions {
  token: string | undefined;
}

export const decodeJwtToken = <T>({ token }: DecodeJwtTokenOptions): T | undefined => {
  if (!token) {
    return undefined;
  }

  const jwtBody = token.split(".")[1];
  if (!jwtBody) {
    return undefined;
  }

  const payload = JSON.parse(window.atob(decodeURIComponent(jwtBody)));
  return payload;
};
