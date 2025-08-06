import 'package:flutter/material.dart';
import 'package:gooxalert/navigation/signalement_detail.dart';
import 'package:gooxalert/widgets/signalement_card.dart';
import 'package:latlong2/latlong.dart';

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
                          description:
                              "Le lampadaire au coin de la rue ne fonctionne plus depuis deux semaines, créant une zone sombre...",
                          image:
                              'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
                          date: '15/11/2023',
                          author: 'Par vous',
                          position: LatLng(14.764504, -17.366029),
                        ),
                      ),
                    );
                  },
                  child: SignalementCard(
                    status: i == 1
                        ? 'En cours'
                        : (i == 2 ? 'Résolu' : 'En attente'),
                    category: 'Lumière',
                    title: 'Lampadaire cassé',
                    image:
                        'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
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
