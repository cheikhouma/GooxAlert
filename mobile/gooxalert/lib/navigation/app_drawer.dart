import 'package:flutter/material.dart';
import '../drawer/profil.dart';
import '../drawer/settings.dart';
import '../drawer/notifications.dart';
import '../drawer/about.dart';
import '../drawer/contact.dart';
import '../drawer/rate_app.dart';
import '../auth/login.dart';


class AppDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Drawer(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: ListView(
        padding: EdgeInsets.symmetric(vertical: 24, horizontal: 8),
        children: [
          SizedBox(height: 20),
          ListTile(
            leading: Icon(Icons.person),
            title: Text('Profil'),
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => ProfilPage())),
          ),
          ListTile(
            leading: Icon(Icons.tune),
            title: Text('Paramètres'),
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => SettingsPage())),
          ),
          ListTile(
            leading: Icon(Icons.notifications_none),
            title: Text('Notifications'),
            onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => NotificationsPage())),
          ),
          ListTile(
            leading: Icon(Icons.info_outline),
            title: Text('A propos'),
            onTap: () => {}
          ),
          ListTile(
            leading: Icon(Icons.mail_outline),
            title: Text('Contact'),
            onTap: () => {},
          ),
          ListTile(
            leading: Icon(Icons.star_border),
            title: Text('Notez l\'application'),
            onTap: () => {},
          ),
          Divider(),
          ListTile(
            leading: Icon(Icons.logout),
            title: Text('Déconnexion'),
            onTap: () {
              Navigator.of(context).pushAndRemoveUntil(
                MaterialPageRoute(builder: (_) => Login()),
                (route) => false,
              );
            },
          ),
        ],
      ),
    );
  }
} 