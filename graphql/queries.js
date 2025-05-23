    const GET_USER_INFO = `
      query getUserProfile($eventId: Int!) {
        user {
          login
          attrs
          auditRatio
          transactions(
            where: { type: { _eq: "xp" } }
            order_by: { createdAt: asc }
          ) {
            amount
            createdAt
            path
            type
          }
          progresses(
            where: { eventId: { _eq: $eventId } }
            order_by: { createdAt: desc }
          ) {
            grade
            path
            createdAt
            object {
              id
              name
              type
              attrs 
            }
          }
        }
      }
    `;
