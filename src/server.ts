import { App } from '@/app';
import { AuthRoute } from '@api/routes/auth.route';
import { UserRoute } from '@api/routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AdminsRoute } from './api/routes/admins.route';
import { DoctorRouter } from './api/routes/doctors.route';
import { PatientRoute } from './api/routes/patients.route';
import { DoctorTimeSlotController } from './api/controllers/doctorTimeSlot.controller';
import { DoctorTimeSlotRoute } from './api/routes/doctorTimeSlot.route';

ValidateEnv();

const app = new App([
  new AuthRoute(),
  new UserRoute(),
  new AdminsRoute(),
  new DoctorRouter(),
  new PatientRoute(),
  new DoctorTimeSlotRoute(),
]);

app.listen();
