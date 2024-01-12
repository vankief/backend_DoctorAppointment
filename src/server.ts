import { App } from '@/app';
import { AuthRoute } from '@api/routes/auth.route';
import { UserRoute } from '@api/routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { AdminsRoute } from './api/routes/admins.route';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new AdminsRoute()]);

app.listen();
