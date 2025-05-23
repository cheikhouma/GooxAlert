import 'package:flutter/material.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF9F7F3),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(vertical: 0, horizontal: 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 70),
            // Carte profil
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black12,
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundImage: AssetImage('assets/image-albert.png'),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Albert William Adolphe Seck',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Bonjour et bienvenue.',
                            style: TextStyle(
                              color: Colors.black54,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 24),
            // Titre statistiques
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                "L'impact citoyen en chiffres",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
              ),
            ),
            SizedBox(height: 12),
            // Statistiques
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                ),
                padding: EdgeInsets.symmetric(vertical: 18, horizontal: 8),
                child: GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.2,
                  children: [
                    _StatCard(
                      icon: Icons.location_on_outlined,
                      value: '5600',
                      label: 'Signalements soumis',
                    ),
                    _StatCard(
                      icon: Icons.bar_chart_outlined,
                      value: '4072',
                      label: 'Problème en cours',
                    ),
                    _StatCard(
                      icon: Icons.assignment_turned_in_outlined,
                      value: '6017',
                      label: 'Problèmes résolus',
                    ),
                    _StatCard(
                      icon: Icons.groups_outlined,
                      value: '10012',
                      label: 'Citoyens actifs',
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 24),
            // Titre signalements récents
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Mes signalements récents',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
            ),
            SizedBox(height: 12),
            // Liste horizontale des signalements
            Container(
              height: 150,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: EdgeInsets.symmetric(horizontal: 12),
                children: [
                  _ReportCard(
                    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                    category: 'Lumière',
                    title: 'Lampadaire cassé',
                    status: 'En attente',
                  ),
                  SizedBox(width: 12),
                  _ReportCard(
                    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
                    category: 'Voirie',
                    title: 'Nid de poule',
                    status: 'En attente',
                  ),
                  SizedBox(width: 12),
                  _ReportCard(
                    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
                    category: 'Déchets',
                    title: 'Tas d\'ordures',
                    status: 'En attente',
                  ),
                ],
              ),
            ),
            SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  const _StatCard({required this.icon, required this.value, required this.label});


  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Color(0xFF89BDB8),
        borderRadius: BorderRadius.circular(16),
      ),
      padding: EdgeInsets.symmetric(vertical: 18, horizontal: 8),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 32, color: Colors.black),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.black),
          ),
          SizedBox(height: 4),
          Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: Colors.black87),
          ),
        ],
      ),
    );
  }
}

class _ReportCard extends StatelessWidget {
  final String image;
  final String category;
  final String title;
  final String status;
  const _ReportCard({required this.image, required this.category, required this.title, required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 220,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(18),
                  topRight: Radius.circular(18),
                ),
                child: Image.network(
                  image,
                  height: 90,
                  width: 220,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    status,
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.lightbulb_outline, size: 16, color: Color(0xFF89BDB8)),
                    SizedBox(width: 4),
                    Text(
                      category,
                      style: TextStyle(fontSize: 13, color: Color(0xFF89BDB8)),
                    ),
                  ],
                ),
                SizedBox(height: 4),
                Text(
                  title,
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
