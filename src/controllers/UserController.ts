import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';

import { AppError } from '../errors/AppError';

import { UsersRepository } from '../Repositories/UsersRepository';

class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required('Nome é obrigatório'),
      email: yup.string().email().required('email incorreto'),
    });
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError('Validations Falied!');
    }

    const userRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await userRepository.findOne({ email });
    if (userAlreadyExists) {
      throw new AppError('Users already exists!');
    }

    const user = userRepository.create({
      name,
      email,
    });
    await userRepository.save(user);

    return response.status(200).json(user);
  }
}
export { UserController };
