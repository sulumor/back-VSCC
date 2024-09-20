export type User = {
  id: string;
  firstname: string;
  email: string;
  password: string;
  is_admin: boolean;
  is_resetting_password: boolean;
  reset_password_token?: string | null;
  created_at: Date;
  updated_at?: Date;
};

export type Users = User[];
