import { User } from '@/types/payload';
import { Access, FieldAccess } from 'payload';

const checkSuperAdmin = ({ req: { user } }: { req: { user: User } }) => {
  if (!user) return false;
  if (user.roles.includes('super-admin')) return true;
  return false;
};

export const isSuperAdmin = {
  collection: checkSuperAdmin as Access,
  field: checkSuperAdmin as FieldAccess,
  check: (user: User | null): boolean => {
    return Boolean(user?.roles?.includes('super-admin'));
  },
};
