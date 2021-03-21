import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import { SurveysRepository } from '../Repositories/SurveysRepository';
import { SurveysUsersRepository } from '../Repositories/SurveysUsersRepository';
import { UsersRepository } from '../Repositories/UsersRepository';
import SendEmailServices from '../Services/SendEmailServices';
import { AppError } from '../errors/AppError';

class SendEmailController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRespository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    // verificar se o usuário existe
    const userExists = await usersRepository.findOne({ email });
    if (!userExists) {
      throw new AppError('does not user exists!');
    }
    // se existe o survey no bd
    const surveyExists = await surveysRespository.findOne({ id: survey_id });
    if (!surveyExists) {
      throw new AppError('does not survey exists!');
    }

    const path = resolve(__dirname, '..', 'views', 'emails', 'npsEmail.hbs');
    const variables = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      link: process.env.URL_MAIL,
      id: '',
    };
    // se existe o survey_user no bd
    const surveyUserExist = await surveysUsersRepository.findOne({
      where: { user_id: userExists.id, value: null },
      relations: ['user', 'survey'],
    });
    if (surveyUserExist) {
      variables.id = surveyUserExist.id;
      // enviar o email
      await SendEmailServices.execute(
        email,
        surveyExists.title,
        variables,
        path,
      );
      return response.status(200).json(surveyUserExist);
    }
    // crio esse envio e salvo no BD survey_user
    // criando e salvando na tabela
    const surveyUser = surveysUsersRepository.create({
      user_id: userExists.id,
      survey_id,
    });
    await surveysUsersRepository.save(surveyUser);

    // enviar o email
    variables.id = surveyUser.id;
    // enviar o email
    await SendEmailServices.execute(email, surveyExists.title, variables, path);

    return response.status(200).json(surveyUser);
  }
}
export { SendEmailController };
