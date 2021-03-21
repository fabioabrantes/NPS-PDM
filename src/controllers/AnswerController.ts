import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../Repositories/SurveysUsersRepository';

class AnswerController {
  // http://localhost:3333/answers/3?su=92bc3567-2d5d-461b-9e49-520e1a74ef12
  /*
    Route params => parametros que compôe a rota. Faz parte da rota. Ou seja
    a rota só funciona se eles estiverem presentes
      ex: /answers/3
      routes.get('/answers/:value', controller.ddddd)
    Query params => utilizados para Busca, paginação, parâmetros não obrigatórios.
    Ou seja, são parâmetros que pode vir ou não que a rota vai continuar funcionando
    sempre vem depois da ?chave=valor
      ex: ?su=92bc3567-2d5d-461b-9e49-520e1a74ef12
  */
  async execute(request: Request, response: Response): Promise<Response> {
    const { value } = request.params;
    const { su } = request.query;

    const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveyUserRepository.findOne({ id: String(su) });

    if (!surveyUser) {
      throw new AppError('does not survey_user exists');
    }
    surveyUser.value = Number(value);
    await surveyUserRepository.save(surveyUser);

    return response.status(200).json(surveyUser);
  }
}
export { AnswerController };
