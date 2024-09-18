export type Trace = {
  id: number;
  strava_id: string;
  strava_hash: string;
  start: string;
  finish: string;
  switch?: string;
  is_a_loop: boolean;
  distance: number;
  elevation: number;
  description: string;
  image: string;
  created_at: Date;
  updated_at?: Date;
};

export type Traces = Trace[];
