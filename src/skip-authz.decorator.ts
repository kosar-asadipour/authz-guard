import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_AUTHZ_KEY = 'isSkipAuthz';

export const SkipAuthz = () => SetMetadata(IS_SKIP_AUTHZ_KEY, true);
