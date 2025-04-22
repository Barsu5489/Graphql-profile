async function getJWT(username, password) {
    const credentials = btoa(`${username}:${password}`); 
    const res = await fetch('https://learn.zone01kisumu.ke/api/auth/signin', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`, 
      },
    });
  
    if (!res.ok) throw new Error('Login failed');
  console.log(res)
  const auth = await res.json();
  localStorage.setItem("auth", auth);
    return 
  }
  
  async function graphqlRequest(query, token, variables = {}) {
    const auth = localStorage.getItem('auth')
    token = auth
    const res = await fetch('https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });
  
    const data = await res.json();
    console.log("GraphQL response:", data);
    return data;
  }
  