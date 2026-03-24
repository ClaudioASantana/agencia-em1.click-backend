import { SetMetadata } from '@nestjs/common';

export const PLAN_RESOURCE_KEY = 'planResource';
export const PlanResource = (
  resource: 'publication' | 'offer' | 'establishment',
) => SetMetadata(PLAN_RESOURCE_KEY, resource);
