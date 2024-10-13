## Setup Keycloak

1. Build the theme

```
npm run build-keycloak-theme
```

2. Copy the theme to the remote server

```
scp -P SERVER_PORT ./dist_keycloak/keycloak-theme-for-kc-22-and-above.jar USER@IP_ADDRESS:~/app/keycloak-themes/museifier-theme.jar
```

3. Build the image

```bash
docker buildx build --platform linux/amd64 -t hoshiix/museifier-web:latest --push .
```

Go to http://localhost:9000/admin and create 'museifier-dev' realm

Go to http://localhost:9000/realms/museifier-dev/account

1. Create 'tartempion@demo.com' user
2. Create a client:
   - id: `dtiMy6xitk6niYDU2LGZmMT6qymK5t978TqaoKUu`
   - name: `museifier-dev`
   - Client authentication: `On`
   - Valid redirect URIs: `http://localhost:5173/*`
   - Web origins: `http://localhost:5173`
3. Update `VITE_OAUTH_CLIENT_SECRET` in `.env.local` file
4. Change Realm settings - Themes - Login theme to `museifier-dev`
5. Change Realm settings - Localization to `french`
6. Change Realm settings - Sessions - SSO Session Idle to `30` days
7. Change Realm settings - Sessions - SSO Session Max to `30` days
8. Change Realm settings - Tokens - Access Token Lifespan to `23` hours
9. TODO create test user

## User stories

A user should see:

- the list of visits (searching & filtering & sorting). A museum can have multiple visits.
- the map of museums (searching & filtering & sorting). If a museum is visited, there will be a indicator.

## TODO

- [x] debounced values on filters fields.
- [x] fix autocomplete loading
- [x] fix multiple same museum labels

- [x] display the selected marker on hover
- [x] ajouter le texte "x résultats à proximité de {adresse}"
- [x] display the number of visits on the marker
- [x] display the distance in map museum cards
- [x] implement "my location"
- [x] trucate les urls de 18 Place Occitane 31000 Toulouse
- [x] store states in the url
- [x] can't find Le Louvre
- [x] add a visits in visit list
- [x] implement 'add a visit' on the map
- [x] implement 'see visits' on the map
- [x] display the stars on the map
- [x] 404 not found error page
- [x] change the avatar
- [x] display department & icons
- [x] create a login page
- [x] create footer
- [x] move all images to /assets
- [x] fix cookies
