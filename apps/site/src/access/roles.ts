import type { Access, FieldAccess } from 'payload'

// Rôles du back-office (TDR §12 : CMS avec rôles et permissions).
// - admin : tout, y compris les comptes
// - validateur : publie et confirme les contenus
// - editeur : rédige, ne confirme pas
export const roleOptions = [
  { label: 'Administrateur', value: 'admin' },
  { label: 'Validateur', value: 'validateur' },
  { label: 'Éditeur', value: 'editeur' },
]

type UserWithRoles = { roles?: string[] | null } | null | undefined

export const hasRole = (user: UserWithRoles, ...roles: string[]) =>
  Boolean(user?.roles?.some((r) => roles.includes(r)))

export const anyone: Access = () => true
export const loggedIn: Access = ({ req }) => Boolean(req.user)
export const isAdmin: Access = ({ req }) => hasRole(req.user as UserWithRoles, 'admin')
export const isValidator: Access = ({ req }) =>
  hasRole(req.user as UserWithRoles, 'admin', 'validateur')

// Seuls admin et validateur peuvent changer le statut de validation.
export const canValidate: FieldAccess = ({ req }) =>
  hasRole(req.user as UserWithRoles, 'admin', 'validateur')
