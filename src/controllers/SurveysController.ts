import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';

import { AppError } from '../errors/AppError';

import { SurveysRepository } from '../Repositories/SurveysRepository';

class SurveysController {
  async create(request: Request, response: Response): Promise<Response> {
    const { title, description } = request.body;

    const schema = yup.object().shape({
      title: yup.string().required('title é obrigatório'),
      description: yup.string().required('description é obrigatório'),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (error) {
      throw new AppError('Validations Falied!');
    }

    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({
      title,
      description,
    });

    await surveysRepository.save(survey);

    return response.status(200).json(survey);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const surveysRepository = getCustomRepository(SurveysRepository);
    const allSurveys = await surveysRepository.find();
    return response.status(200).json(allSurveys);
  }
}
export { SurveysController };
