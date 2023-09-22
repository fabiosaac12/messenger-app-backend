import * as bcrypt from 'bcrypt';

export const encrypt = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error, salt) => {
      error
        ? reject(error)
        : bcrypt.hash(password, salt, (error, hash) => {
            error ? reject(error) : resolve(hash);
          });
    });
  });

export const comparePassword = (password: string, hash: string) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, result) => {
      error ? reject(error) : resolve(result);
    });
  });
