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
const GET_USER_XP = `query xp($name: String!) {
  xp(where: {user: {login: {_eq: $name}}}) {
    user {
      login
    }
    amount
  }
}`