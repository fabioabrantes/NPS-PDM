import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { SurveysController } from './controllers/SurveysController';
import { SendEmailController } from './controllers/SendEmailController';
import { AnswerController } from './controllers/AnswerController';
import { NPSController } from './controllers/NPSController';

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();
const sendEmailController = new SendEmailController();
const answerController = new AnswerController();
const npsController = new NPSController();

// ============= usuarios ==========
router.post('/users', userController.create);

// ============= pesquisas ==========
router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

// ==============Pesquisa - usuarios ==================
router.post('/sendMail', sendEmailController.execute);
router.get('/answers/:value', answerController.execute);

// ========== calculos do NPS ============
router.get('/nps/:survey_id', npsController.execute);

export { router };
