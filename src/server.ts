import { App } from '@/app';
import { AuthRoute } from '@api/routes/auth.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AdminsRoute } from './api/routes/admins.route';
import { DoctorRouter } from './api/routes/doctors.route';
import { PatientRoute } from './api/routes/patients.route';
import { DoctorTimeSlotRoute } from './api/routes/doctorTimeSlot.route';

ValidateEnv();

const app = new App([
  new AuthRoute(),
  new AdminsRoute(),
  new DoctorRouter(),
  new PatientRoute(),
  new DoctorTimeSlotRoute(),
]);

app.listen();
