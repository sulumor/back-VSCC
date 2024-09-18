export type User = {
  id: string;
  firstname: string;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: Date;
  updated_at?: Date;
};

export type Users = User[];
