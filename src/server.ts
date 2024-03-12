import { App } from '@/app';
import { AuthRoute } from '@api/routes/auth.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AdminsRoute } from './api/routes/admins.route';
import { DoctorRouter } from './api/routes/doctors.route';
import { PatientRoute } from './api/routes/patients.route';
import { DoctorTimeSlotRoute } from './api/routes/doctorTimeSlot.route';
import { AppointmentRoute } from './api/routes/appointment.route';
import { TestRouter } from './api/routes/test.route';
import { SpecialistRouter } from './api/routes/specialist.route';

ValidateEnv();

const app = new App(new TestRouter(), [
  new AuthRoute(),
  new AdminsRoute(),
  new DoctorRouter(),
  new PatientRoute(),
  new DoctorTimeSlotRoute(),
  new AppointmentRoute(),
  new SpecialistRouter(),
]);

app.listen();
