export const Role = {
  SUPER_ADMIN: 'super_admin',
  CHANCELLOR: 'chancellor',
  DIRECTOR: 'director',
  HEAD_OF_SCHOOL: 'head_of_school',
  IN_CHARGE: 'in_charge',
  EXAM_CELL_HEAD: 'exam_cell_head',
  EXAM_CELL_MEMBER: 'exam_cell_member',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.CHANCELLOR]: 'Chancellor',
  [Role.DIRECTOR]: 'Director',
  [Role.HEAD_OF_SCHOOL]: 'Head of School',
  [Role.IN_CHARGE]: 'In-charge',
  [Role.EXAM_CELL_HEAD]: 'Exam Cell Head',
  [Role.EXAM_CELL_MEMBER]: 'Exam Cell Member',
  [Role.TEACHER]: 'Teacher',
  [Role.STUDENT]: 'Student',
};

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SUPER_ADMIN]: 0,
  [Role.CHANCELLOR]: 1,
  [Role.DIRECTOR]: 2,
  [Role.HEAD_OF_SCHOOL]: 3,
  [Role.IN_CHARGE]: 4,
  [Role.EXAM_CELL_HEAD]: 5,
  [Role.EXAM_CELL_MEMBER]: 6,
  [Role.TEACHER]: 7,
  [Role.STUDENT]: 8,
};
