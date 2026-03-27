# 📋 GUIDE CONFIGURATION VARIABLES RENDER

## ÉTAPE 1 : ACCÈS AU DASHBOARD RENDER

1. **Connectez-vous** à https://render.com/
2. **Allez sur votre service** "avico-pro"
3. **Cliquez sur "Environment"** dans le menu gauche
4. **Ajoutez les variables** une par une

---

## ÉTAPE 2 : VARIABLES OBLIGATOIRES

### 🔐 **Sécurité (IMPORTANT)**
```
HASH_SALT = avico_pro_salt_2024_secure_key_change_me
JWT_SECRET = avico_pro_jwt_secret_2024_change_me
APP_URL = https://avico-pro.onrender.com
```

### 🌐 **Application**
```
NODE_ENV = production
PORT = 3000
API_VERSION = v1
```

---

## ÉTAPE 3 : VARIABLES OPTIONNELLES

### 📧 **Email (si vous voulez envoyer des emails)**
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = votre-email@gmail.com
SMTP_PASS = votre-mot-de-passe-app
EMAIL_FROM = noreply@avico-pro.com
```

### 📊 **Analytics (si vous voulez suivre l'usage)**
```
GA_TRACKING_ID = G-XXXXXXXXXX
ENABLE_ANALYTICS = true
```

---

## ÉTAPE 4 : CONFIGURATION AVANCÉE

### 🎨 **Design**
```
THEME_COLOR = #2c3e50
PRIMARY_COLOR = #27ae60
SECONDARY_COLOR = #f39c12
```

### 📱 **Mobile**
```
ENABLE_PWA = true
CACHE_DURATION = 3600
OFFLINE_MODE = true
```

### 🔧 **Performance**
```
ENABLE_COMPRESSION = true
ENABLE_CDN = true
CACHE_STRATEGY = network_first
```

---

## ÉTAPE 5 : SÉCURITÉ

### 🛡️ **Protection**
```
RATE_LIMIT_WINDOW = 900000
RATE_LIMIT_MAX = 100
CORS_ORIGIN = *
ENABLE_HELMET = true
```

---

## ⚠️ **IMPORTANT**

### 🔑 **Changez ces valeurs :**
- `HASH_SALT` : Mettez une valeur unique
- `JWT_SECRET` : Mettez une valeur unique
- `SMTP_USER/PASS` : Vos vrais identifiants email

### 📧 **Pour Gmail SMTP :**
1. **Activez l'authentification 2 facteurs**
2. **Générez un "mot de passe d'application"**
3. **Utilisez ce mot de passe** dans `SMTP_PASS`

---

## 🎯 **DÉMARRAGE RAPIDE**

### ✅ **Minimum pour fonctionner :**
```
HASH_SALT = avico_pro_salt_2024_secure_key_change_me
JWT_SECRET = avico_pro_jwt_secret_2024_change_me
APP_URL = https://avico-pro.onrender.com
NODE_ENV = production
```

### 🚀 **Après configuration :**
1. **Redéployez automatiquement**
2. **Testez l'application**
3. **Vérifiez les logs** si besoin

---

## 📞 **SUPPORT**

Si vous avez besoin d'aide :
- **Documentation Render** : https://render.com/docs/environment-variables
- **Support Render** : support@render.com

---

## ✅ **CHECKLIST**

- [ ] Variables obligatoires ajoutées
- [ ] Valeurs de sécurité personnalisées
- [ ] Email configuré (si besoin)
- [ ] Redéploiement testé
- [ ] Application fonctionnelle

---

**Votre AVICO-PRO sera prêt avec ces variables !** 🚀
