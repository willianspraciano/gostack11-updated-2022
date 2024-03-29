import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import uploadConfig from '../config/upload';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  user_id: string,
  avatarFilename: string,
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if(!user) { //verifica se o usuário existe
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if(user.avatar) {
      //deleta avatar anterior

      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath); //retorna o status do arquivo, se o arquivo existe

      if(userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath); //deleta arquivo
      }
    }

    user.avatar = avatarFilename;

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
