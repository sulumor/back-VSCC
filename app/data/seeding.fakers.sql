BEGIN;

TRUNCATE TABLE "user", "trace" RESTART IDENTITY CASCADE;

INSERT INTO "user"(firstname, email, password, is_admin) VALUES 
('Sulumor', 'jojoetromu@gmail.com', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', true);
-- ('Jared', 'tevbez@meramu.mk', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', false),
-- ('Essie', 'cifkurul@izawbus.cv', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', false),
-- ('Mario', 'di@puddiknun.uk', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', true),
-- ('Etta', 'nawadi@ehve.bo', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', true),
-- ('Travis', 'jo@ocociec.jo', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', false);

INSERT INTO "trace"(title, strava_id, strava_hash, start, finish, switch, is_a_loop, distance, elevation, description,image) VALUES
("Epernon 180km","3278073778981727430","7.96/48.732/1.942","Clichy","Maison Laffite","Épernon",false,180,1511,"Boucle allant à Epernon et revenant sur Maison Laffitte","cdrdaardlcivn3lu6uqm"),
("Epernon 170km","3278072985145056506","7.86/48.711/1.942","Clichy", "Saint-Nom-la-Bretèche", "Épernon",false, 168, 1431, "Boucle allant à Epernon et revenant sur Saint-Nom-la-Bretèche", "uvnvy12o3thcklczsd8p"),
("Epernon 136km","3278072630891959462","8.02/48.731/1.988","Clichy", "Versailles", "Épernon",false, 136, 1039, "Boucle allant à Epernon et revenant sur Versailles", "gznyzvmd8wwfrlvsjqdr"),
("Epernon 125km","3278058410613236902","8.02/48.731/1.988","Clichy", "Trappes", "Épernon",false, 125, 997, "Boucle allant à Epernon et revenant sur Trappes", "sgzrhwjotru13xqf9jd6"),
("Asnièroise 100km","3274090060887550118","8.6/49.0257/2.2679","Asnières", "Asnières","Beaumont-sur-Oise",true, 100, 997, "Rallye d'Asnières sur la trace de 100km", "dbtcz7rpllhcosbaij4k"),
("Asnièroise 76km","3274089813748275862","8.6/49.0257/2.3038","Asnières", "Asnières", "Beaumont-sur-Oise",true, 76, 790, "Rallye d'Asnières sur la trace de 76km", "w8fmfmvr3prp6gcnsnhn"),
("Asnièroise 52km","3274089454964128934","9.05/48.9948/2.2972","Asnières", "Asnières", "Montsoult",true, 53, 454, "Rallye dÁsnières trace de 53km", "kvou18wjdzzhl60b7zay"),
("Circuit de Baillet","3273380221925510310","8.93/48.992/2.2972","Clichy", "Clichy", "Baillet",true, 59, 419, "Circuit de Baillet", "vru2ehiuh4sc1plukokb"),
("Conflans-Marly","3273380046053851302","9.16/48.9138/2.1273","Clichy", "Clichy", "Orgeval",true, 83, 534, "Sortie longue Conflans", "urlumqkudgkgdc13pfsq"),
("Parcours Conflans-Sainte-Honorine","3273379655774771420","9.95/48.9471/2.1977","Clichy", "Clichy", "Conflans-Sainte-Honorine",true, 58, 227, "Petite sortie Conflans", "k1xjceef96klqedgrzrb"),
("Vallée de l'Oise","3273379380659923110","8.49/49.0261/2.2802","Clichy", "Clichy", "Persan",true, 85, 715, "Ballade dans la vallée de l'Oise", "pkpqv8nqeab6tmdbguxw"),
("Marines 120km","3278728906700123164","8.32/49.042/2.12","Clichy", "Clichy", "Marines",true, 120, 1158, "Boucle dans le Vexin allant jusqu'à Marines ", "ih1zvemrwqbmdlcrt3rh"),
("Marines 165km","3278729770674266140","7.81/49.103/2.075","Clichy", "Clichy", "Marines",true, 165, 1519, "Boucle dans le Vexin allant jusqu`à Marines", "ldl8yq7xzmtlsygiclnm"),
("Senlis 130km","3278730957875472550","8.2/49.055/2.464","Clichy", "Clichy", "Senlis",true, 130, 957, "Boucle dans la forêt de Chantilly allant jusqu'à Senlis", "kxcld2s91zymahuijlqp"),
("Senlis 167km","3278731632282386598","8.07/49.07/2.516","Clichy", "Clichy", "Senlis",true, 167, 1225, "Boucle dans la forêt de Chantilly jusqu'à Senlis", "pyyyjviobojwdlfbdky5"),
("Septeuil 126km","3278732235367107612","8.76/48.8684/1.9895","Clichy", "Clichy", "Septeuil",true, 126, 1048, "Boucle dans l'ouest parisien allant jusqu'à Septeuil", "hgay2iti4leesiq1j2ls"),
("Septeuil 175km","3278732929385779228","8.47/48.8886/1.9209","Clichy", "Clichy", "Septeuil",true, 174, 1637, "Boucle dans l'ouest parisien allant jusqu'à Septeuil", "mhdr7pbh0xl8mu0liy9u"),
("Clichy-Le Crotoy 2024","3278733761683209308","6.08/49.567/2.057","Clichy", "Le Crotoy", "Chantilly",false, 219, 1636, "Tracé Paris-Le Crotoy modifié pour partir de Clichy", "bas7mg1g6yn56sez2fq8");

COMMIT;
