import { newEnforcer } from 'casbin';
import {fileURLToPath} from "url";
import {dirname, join} from "path";

export const ENFORCER = 'ENFORCER';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modelPath = join(__dirname, '/config/casbin-config/model.conf');

export const casbinProvider = {
  provide: ENFORCER,
  useFactory: async (adapter: any) => {
    const enforcer = await newEnforcer(modelPath, adapter);
    await enforcer.loadPolicy()
    return enforcer;
  },
  inject: ['CASBIN_ADAPTER'],
};