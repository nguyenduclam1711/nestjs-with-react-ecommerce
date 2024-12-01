import * as bcrypt from 'bcrypt';

export const PasswordUtil = {
  async generateHashedPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  },
};
