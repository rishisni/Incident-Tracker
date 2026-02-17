const { Router } = require('express');
const { IncidentController } = require('./controller/IncidentController');
const { validate } = require('../../middlewares/validation');
const {
  createIncidentSchema,
  updateIncidentSchema,
  getIncidentSchema,
  listIncidentsSchema,
} = require('./validators/IncidentValidators');

const router = Router();
const controller = new IncidentController();

router.post('/', validate(createIncidentSchema), controller.createIncident);
router.get('/', validate(listIncidentsSchema), controller.listIncidents);
router.get('/:id', validate(getIncidentSchema), controller.getIncidentById);
router.patch('/:id', validate(updateIncidentSchema), controller.updateIncident);

module.exports = { incidentRoutes: router };
