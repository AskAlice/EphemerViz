export interface DbConfigVars {
  db: {
    host: string;
    port: string;
    name: string;
    user: string;
    password: string;
    url: string;
  };
}

export default () => {
  const response = {
    db: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      url: process.env.DB_URL,
    },
  };

  return response;
};
