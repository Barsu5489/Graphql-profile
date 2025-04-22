const GET_USER_INFO = `
query getUserInfo($name: String!) {
  user(where: {login: {_eq: $name}}) {
    profile
    login
    attrs
    auditRatio
    campus
    totalDown
    totalUp
    updatedAt
  }
}
`;
