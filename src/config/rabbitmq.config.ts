export const rabbitMQConfig = () => ({
  exchanges: {
    consumer: {},
    publisher: {
      user: 'kingsley_proxy_users_requests',
    },
  },
  queues: {},
  routingKeys: {
    userRequest: 'user.request',
  },
});
