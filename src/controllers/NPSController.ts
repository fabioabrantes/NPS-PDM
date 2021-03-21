import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../Repositories/SurveysUsersRepository';

class NPSController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { survey_id } = request.params;

    const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    if (!surveysUsers) {
      throw new AppError('does not survey_user exists');
    }

    // filtrando os detratores (0 - 6), promotores (9 - 10) e passivos (7 - 8)
    // 1 2 3 4 5 6 7 8 9 10
    const detractors = surveysUsers.filter(
      surveyUser => surveyUser.value >= 0 && surveyUser.value <= 6,
    ).length;

    const promoters = surveysUsers.filter(
      surveyUser => surveyUser.value >= 9 && surveyUser.value <= 10,
    ).length;

    const passives = surveysUsers.filter(
      surveyUser => surveyUser.value >= 7 && surveyUser.value <= 8,
    ).length;

    const totalAnswers = surveysUsers.length;
    // ((num de promotores - num de detratores) / (num de respondentes)) *100
    const resultNPS = ((promoters - detractors) / totalAnswers) * 100;

    return response.status(200).json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: resultNPS,
    });
  }
}
export { NPSController };
