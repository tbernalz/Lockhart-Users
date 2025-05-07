export const rabbitMQConfig = () => ({
  exchanges: {
    consumer: {
      user: 'lockhart_users_responses',
    },
    publisher: {
      user: 'kingsley_proxy_users_requests',
      document: 'dobby_requests',
    },
  },
  queues: {
    userRequest: 'users.request.queue',
  },
  routingKeys: {
    userRequest: 'user.request',
    documentRequest: 'document.request',
  },
});
