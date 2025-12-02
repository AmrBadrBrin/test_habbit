import { Router } from 'express';
import * as habitsController from '../controllers/habitsController';

const router = Router();

router.get('/', habitsController.getAllHabits);
router.get('/:id', habitsController.getHabitById);
router.post('/', habitsController.createHabit);
router.put('/:id', habitsController.updateHabit);
router.delete('/:id', habitsController.deleteHabit);
router.post('/:id/complete', habitsController.completeHabit);
router.delete('/:id/complete/:date', habitsController.uncompleteHabit);

export default router;
