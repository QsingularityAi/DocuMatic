import { Field } from 'payload';

export const userRelationship: Field = {
  name: 'user',
  type: 'relationship',
  relationTo: 'users',
  index: true,
  admin: {
    position: 'sidebar',
  },
};
