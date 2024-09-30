BEGIN;

TRUNCATE TABLE "user", "trace" RESTART IDENTITY CASCADE;

INSERT INTO "user"(firstname, email, password, is_admin) VALUES 
('Jared', 'tevbez@meramu.mk', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', false),
('Essie', 'cifkurul@izawbus.cv', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', false),
('Mario', 'di@puddiknun.uk', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', true),
('Etta', 'nawadi@ehve.bo', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', true),
('Sulumor', 'jojoetromu@gmail.com', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', true),
('Travis', 'jo@ocociec.jo', '$2b$12$WfNSMH0Yob5/JbuS4t9zYeSz1sZCDVCLlxcLS7fyt1EpNbiqxNaNa', false);

INSERT INTO "trace"(strava_id, strava_hash, start, finish, switch, is_a_loop, distance, elevation, description,image) VALUES
('3260656048129516876','8.1/49.041/1.929','Paris', 'Saint-Ouen-Sur-Seine', 'Cergy', true, 218, 2756, 'Trace CC vers Cergy modifié pour retourner à Saint Ouen sans passer par Cergy', 'src/assets/Screen 1.png' ),
('3266397698136738982','7.96/48.732/1.942','Clichy','Maison Laffitte', 'Epernon', true, 180, 1511, 'Boucle allant à Epernon et revenant sur Maison Laffitte', 'src/assets/Screen 2.png' ),
('3266399134342276188','8.11/48.711/1.942','Clichy','Saint-Nom-la-Bretèche', 'Epernon', true, 169, 1430,'Boucle allant à Epernon et revenant sur Saint-Nom-la-Bretèche','src/assets/Screen 3.png'),
('3266400069424732252','8.27/48.731/1.988','Clichy','Trappes', 'Epernon', true, 125, 997,'Boucle allant à Epernon et revenant sur Trappes','src/assets/Screen 4.png'),
('3266400749418058836','8.27/48.731/1.988', 'Clichy','Versailles', 'Epernon', true, 136, 1040,'Boucle allant à Epernon et revenant sur Versailles','src/assets/Screen 5.png'),
('3266401771559766182','8.57/49.0425/2.1196','Clichy','Clichy', 'Marines', true, 120, 1158, 'Petite boucle allant à Marines', 'src/assets/Screen 6.png'),
('3266402779273247828', '8.06/49.103/2.075', 'Clichy', 'Clichy', 'Marines', true, 165, 1520, 'Grande boucle allant à Marines', 'src/assets/Screen 7.png'),
('3266403421163991132', '8.45/49.055/2.464', 'Clichy', 'Clichy', 'Senlis', true, 130, 957, 'Petite boucle allant à Senlis', 'src/assets/Screen 8.png'),
('3266403983694334044', '8.32/49.07/2.516', 'Clichy', 'Clichy', 'Senlis', true, 167, 1225, 'Grande boucle allant à Senlis', 'src/assets/Screen 9.png'),
('3266404565748522150', '9.01/48.8684/1.9895', 'Clichy', 'Clichy', 'Septeuil', true, 125, 1048, 'Petite boucle allant à Septeuil', 'src/assets/Screen 10.png'),
('3266405242680998054', '8.72/48.8886/1.9209', 'Clichy', 'Clichy', 'Septeuil', true, 174, 1637, 'Grande boucle allant à Septeuil', 'src/assets/Screen 11.png');

COMMIT;
