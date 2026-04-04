import { Permission } from './permissions.enum';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {

  MEDICO: [
    Permission.VIEW_STUDY,
    Permission.CREATE_DIAGNOSTIC,
    Permission.VIEW_AGENDA,
  ],

  RECEPCION: [
    Permission.VIEW_STUDY,
    Permission.SEND_STUDY,
    Permission.VIEW_AGENDA,
    Permission.CREATE_CONSULT,
    Permission.CREATE_URGENCY,
    Permission.VIEW_PATIENT,
    Permission.CREATE_PATIENT,
    Permission.EDIT_PATIENT,
    Permission.VIEW_DOCTOR,
    Permission.CREATE_DOCTOR,
    Permission.EDIT_DOCTOR,
    Permission.DELETE_DOCTOR,
  ],

  RADIOLOGO: [
    Permission.VIEW_STUDY,
    Permission.SEND_STUDY,
    Permission.VIEW_AGENDA,
    Permission.CREATE_URGENCY,
    Permission.VIEW_PATIENT,
    Permission.CREATE_PATIENT,
  ],

  ADMINISTRADOR: [
    Permission.VIEW_STUDY,
    Permission.SEND_STUDY,
    Permission.DELETE_STUDY,
    Permission.CREATE_DIAGNOSTIC,
    Permission.VIEW_AGENDA,
    Permission.CREATE_CONSULT,
    Permission.CREATE_URGENCY,
    Permission.VIEW_PATIENT,
    Permission.CREATE_PATIENT,
    Permission.EDIT_PATIENT,
    Permission.DELETE_PATIENT,
    Permission.VIEW_DOCTOR,
    Permission.CREATE_DOCTOR,
    Permission.EDIT_DOCTOR,
    Permission.DELETE_DOCTOR,
    Permission.MANAGE_PACS,
    Permission.MANAGE_USERS,
    Permission.MANAGE_OFFICE,
  ],
};
