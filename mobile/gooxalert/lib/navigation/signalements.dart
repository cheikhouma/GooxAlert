import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'signalement_detail.dart';

class Signalements extends StatefulWidget {
  @override
  _SignalementsState createState() => _SignalementsState();
}

class _SignalementsState extends State<Signalements> {
  bool showMap = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF9F7F3),
      drawer: Drawer(
        child: Center(child: Text("Menu ici")),
      ),
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(height: 5),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _ToggleButton(
                    icon: Icons.location_on_outlined,
                    selected: showMap,
                    onTap: () => setState(() => showMap = true),
                  ),
                  SizedBox(width: 8),
                  _ToggleButton(
                    icon: Icons.list_alt,
                    selected: !showMap,
                    onTap: () => setState(() => showMap = false),
                  ),
                  Spacer(),
                  
                ],
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: showMap ? SignalementsCarte() : SignalementsListe(),
            ),
          ],
        ),
      ),
    );
  }
}

class _ToggleButton extends StatelessWidget {
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;
  const _ToggleButton({
    required this.icon,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? Color(0xFFB3D5D1) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white, width: 2),
        ),
        child: Icon(icon, color: selected ? Colors.black : Colors.black54),
      ),
    );
  }
}

class SignalementsCarte extends StatefulWidget {
  @override
  State<SignalementsCarte> createState() => _SignalementsCarteState();
}

class _SignalementsCarteState extends State<SignalementsCarte> {
  final List<Map<String, dynamic>> fakeReports = [
    {"lat": 14.764504, "lng": -17.366029, "category": "Lumière", "title": "Lampadaire cassé", "description": "Le lampadaire au coin de la rue ne fonctionne plus depuis deux semaines, créant une zone sombre...", "image": 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', "date": "15/11/2023", "author": "Par vous"},
    {"lat": 14.765504, "lng": -17.362029, "category": "Voirie", "title": "Nid de poule", "description": "Un nid de poule dangereux sur la route principale.", "image": 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', "date": "10/11/2023", "author": "Par vous"},
    {"lat": 14.762504, "lng": -17.364029, "category": "Déchets", "title": "Tas d'ordures", "description": "Tas d'ordures non ramassé depuis plusieurs jours.", "image": 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', "date": "12/11/2023", "author": "Par vous"},
    {"lat": 14.763504, "lng": -17.368029, "category": "Lumière", "title": "Lampadaire clignotant", "description": "Un lampadaire clignote toute la nuit.", "image": 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', "date": "13/11/2023", "author": "Par vous"},
    {"lat": 14.766504, "lng": -17.367029, "category": "Lumière", "title": "Zone sombre", "description": "Zone sans éclairage public.", "image": 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', "date": "14/11/2023", "author": "Par vous"},
  ];

  void _showReportSummary(Map<String, dynamic> report) {
    showModalBottomSheet(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(18)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(18.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.lightbulb_outline, color: Color(0xFF89BDB8)),
                  SizedBox(width: 8),
                  Text(report["category"], style: TextStyle(fontSize: 15, color: Color(0xFF89BDB8))),
                ],
              ),
              SizedBox(height: 8),
              Text(report["title"], style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              SizedBox(height: 8),
              Text(report["description"], maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 14)),
              SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 15),
                  SizedBox(width: 6),
                  Text(report["date"], style: TextStyle(fontSize: 13)),
                  SizedBox(width: 18),
                  Icon(Icons.person, size: 15),
                  SizedBox(width: 6),
                  Text(report["author"], style: TextStyle(fontSize: 13)),
                ],
              ),
              SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB3D5D1),
                        foregroundColor: Colors.black,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        elevation: 0,
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => SignalementDetailPage(
                              category: report["category"],
                              title: report["title"],
                              description: report["description"],
                              image: report["image"],
                              date: report["date"],
                              author: report["author"],
                              position: LatLng(report["lat"], report["lng"]),
                            ),
                          ),
                        );
                      },
                      child: Text('Détails'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return FlutterMap(
      options: MapOptions(
        initialCenter: LatLng(14.764504, -17.366029),
        initialZoom: 15.0,
      ),
      children: [
        TileLayer(
          urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          userAgentPackageName: 'com.example.gooxalert',
        ),
        MarkerLayer(
          markers: fakeReports.map((report) {
            return Marker(
              point: LatLng(report["lat"], report["lng"]),
              width: 40,
              height: 40,
              child: GestureDetector(
                onTap: () => _showReportSummary(report),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: Colors.black26, blurRadius: 4)],
                  ),
                  child: Center(
                    child: Icon(Icons.lightbulb_outline, color: Colors.white, size: 22),
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class SignalementsListe extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Rechercher',
                        border: InputBorder.none,
                        prefixIcon: Icon(Icons.search),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.filter_list),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            SizedBox(height: 18),
            Wrap(
              spacing: 12,
              runSpacing: 16,
              children: List.generate(6, (i) {
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => SignalementDetailPage(
                          category: 'Lumière',
                          title: 'Lampadaire cassé',
                          description: "Le lampadaire au coin de la rue ne fonctionne plus depuis deux semaines, créant une zone sombre...",
                          image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                          date: '15/11/2023',
                          author: 'Par vous',
                          position: LatLng(14.764504, -17.366029),
                        ),
                      ),
                    );
                  },
                  child: _SignalementCard(
                    status: i == 1 ? 'En cours' : (i == 2 ? 'Résolu' : 'En attente'),
                    category: 'Lumière',
                    title: 'Lampadaire cassé',
                    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                  ),
                );
              }),
            ),
            SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _SignalementCard extends StatelessWidget {
  final String status;
  final String category;
  final String title;
  final String image;
  const _SignalementCard({
    required this.status,
    required this.category,
    required this.title,
    required this.image,
  });

  Color get statusColor {
    switch (status) {
      case 'En cours':
        return Colors.amber;
      case 'Résolu':
        return Colors.green;
      default:
        return Colors.black54;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 170,
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
                  height: 80,
                  width: 170,
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
                      color: statusColor,
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
