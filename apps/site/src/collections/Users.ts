import type { CollectionConfig } from 'payload'

import { hasRole, isAdmin, roleOptions } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  auth: true,
  access: {
    // Un utilisateur voit et modifie son propre compte ; l'admin voit tout.
    read: ({ req }) => (hasRole(req.user as never, 'admin') ? true : { id: { equals: req.user?.id } }),
    update: ({ req }) => (hasRole(req.user as never, 'admin') ? true : { id: { equals: req.user?.id } }),
    create: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', label: 'Nom', type: 'text' },
    {
      name: 'roles',
      label: 'Rôles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editeur'],
      options: roleOptions,
      saveToJWT: true,
      access: {
        update: ({ req }) => hasRole(req.user as never, 'admin'),
      },
    },
  ],
}
