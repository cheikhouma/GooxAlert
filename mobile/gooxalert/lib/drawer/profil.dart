import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import '../navigation/signalement_detail.dart';
import 'edit_profil.dart';

class ProfilPage extends StatefulWidget {
  @override
  _ProfilPageState createState() => _ProfilPageState();
}

class _ProfilPageState extends State<ProfilPage> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  final List<Map<String, dynamic>> myReports = [
    {
      "category": "Lumière",
      "title": "Lampadaire cassé",
      "description": "Le lampadaire au coin de la rue ne fonctionne plus depuis deux semaines, créant une zone sombre...",
      "image": "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      "date": "15/11/2023",
      "author": "Moi",
      "status": "En attente",
      "position": LatLng(14.764504, -17.366029),
    },
    {
      "category": "Voirie",
      "title": "Nid de poule",
      "description": "Un nid de poule dangereux sur la route principale.",
      "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      "date": "10/11/2023",
      "author": "Moi",
      "status": "En cours",
      "position": LatLng(14.765504, -17.362029),
    },
    {
      "category": "Déchets",
      "title": "Tas d'ordures",
      "description": "Tas d'ordures non ramassé depuis plusieurs jours.",
      "image": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      "date": "12/11/2023",
      "author": "Moi",
      "status": "Résolu",
      "position": LatLng(14.762504, -17.364029),
    },
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(milliseconds: 800),
      vsync: this,
    );
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF9F7F3),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: BackButton(color: Colors.black),
        actions: [
          IconButton(
            icon: Icon(Icons.edit, color: Colors.black),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => EditProfilPage()),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header profil avec animation
            FadeTransition(
              opacity: _animation,
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFFB3D5D1), Color(0xFF89BDB8)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(32),
                    bottomRight: Radius.circular(32),
                  ),
                ),
                padding: EdgeInsets.only(top: 20, bottom: 24, left: 24, right: 24),
                child: Column(
                  children: [
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundImage: AssetImage("assets/image-albert.png"),
                        ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.camera_alt, size: 20, color: Color(0xFF89BDB8)),
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    Text(
                      "Albert William Adolphe Seck",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 24,
                        color: Colors.black,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "Citoyen engagé",
                      style: TextStyle(
                        color: Colors.black87,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 24),
            Row(
              children: [
                SizedBox(width: 10),
                Text("Statistiques", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black87),),
                      ]            ),
            // Statistiques
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 5),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _StatCard(
                    label: "Signalements",
                    value: "12",
                    icon: Icons.location_on_outlined,
                    color: Color(0xFF89BDB8),
                  ),
                  _StatCard(
                    label: "Résolus",
                    value: "7",
                    icon: Icons.check_circle_outline,
                    color: Colors.green,
                  ),
                  _StatCard(
                    label: "En cours",
                    value: "3",
                    icon: Icons.timelapse,
                    color: Colors.amber,
                  ),
                  _StatCard(
                    label: "En attente",
                    value: "2",
                    icon: Icons.hourglass_empty,
                    color: Colors.redAccent,
                  ),
                ],
              ),
            ),
            SizedBox(height: 32),
            // Informations personnelles
            _buildSection(
              title: "Informations personnelles",
              child: Column(
                children: [
                  _buildInfoTile(
                    icon: Icons.person_outline,
                    title: "Nom complet",
                    subtitle: "Albert William Adolphe Seck",
                  ),
                  _buildInfoTile(
                    icon: Icons.phone_outlined,
                    title: "Téléphone",
                    subtitle: "+221 77 123 45 67",
                  ),
                  
                  _buildInfoTile(
                    icon: Icons.location_on_outlined,
                    title: "Commune",
                    subtitle: "Thiès",
                  ),
                ],
              ),
            ),
            // Préférences
            _buildSection(
              title: "Préférences",
              child: Column(
                children: [
                  _buildSwitchTile(
                    title: "Notifications",
                    subtitle: "Recevoir des notifications",
                    value: true,
                    onChanged: (value) {},
                  ),
                  _buildSwitchTile(
                    title: "Mode sombre",
                    subtitle: "Activer le thème sombre",
                    value: false,
                    onChanged: (value) {},
                  ),
                ],
              ),
            ),
            // Message inspirant
            Padding(
              padding: const EdgeInsets.all(24),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFFB3D5D1), Color(0xFF89BDB8)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(18),
                ),
                padding: EdgeInsets.all(20),
                child: Row(
                  children: [
                    Icon(Icons.emoji_events, color: Colors.black, size: 32),
                    SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        "Merci pour votre engagement citoyen ! Chaque signalement contribue à améliorer la vie de tous.",
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.black87,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({required String title, required Widget child}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: child,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return ListTile(
      leading: Container(
        padding: EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Color(0xFF89BDB8).withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: Color(0xFF89BDB8)),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontSize: 14,
          color: Colors.black54,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          fontSize: 16,
          color: Colors.black87,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildSwitchTile({
    required String title,
    required String subtitle,
    required bool value,
    required Function(bool) onChanged,
  }) {
    return ListTile(
      title: Text(
        title,
        style: TextStyle(
          fontSize: 16,
          color: Colors.black87,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: TextStyle(
          fontSize: 14,
          color: Colors.black54,
        ),
      ),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeColor: Color(0xFF89BDB8),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
              color: Colors.black87,
            ),
          ),
          SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.black54,
            ),
          ),
        ],
      ),
    );
  }
}
