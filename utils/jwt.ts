import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("There is not JWT seed, please create or add it");
  }

  return jwt.sign(
    { _id, email },
    process.env.JWT_SECRET_SEED,
    { expiresIn: '30d' }
  )
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("There is not JWT seed, please create or add it");
  }

  if (token.length <= 10) {
    return Promise.reject('JWT is not valid');
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
        if (err) return reject('JWT is not valid');

        const { _id } = payload as { _id: string };

        resolve(_id);
      });
    } catch (error) {
      return reject('JWT is not valid');
    }
  });
}